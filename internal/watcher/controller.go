package watcher

import (
	"context"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/events"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"go.uber.org/zap"
)

type TargetContainer struct {
	ID          string
	Strategy    string   // "signal" or "restart"
	ComposePath string   // Optional path to docker-compose.yml
	Secrets     []string // List of secrets this container depends on
}

type ReloaderController struct {
	Logger  *zap.Logger
	Targets sync.Map // map[string]*TargetContainer (key: containerID)
	cli     *client.Client
}

func NewReloaderController(logger *zap.Logger) (*ReloaderController, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	return &ReloaderController{
		Logger: logger,
		cli:    cli,
	}, nil
}

// StartEventLoop connects to the Docker Events API and maintains the active target cache
func (r *ReloaderController) StartEventLoop(ctx context.Context) {
	r.Logger.Info("Starting Docker Events loop for ReloaderController")

	go func() {
		r.populateInitialTargets(ctx)

		filterArgs := filters.NewArgs()
		filterArgs.Add("type", "container")
		filterArgs.Add("event", "start")
		filterArgs.Add("event", "die")
		filterArgs.Add("event", "stop")

		msgCh, errCh := r.cli.Events(ctx, events.ListOptions{Filters: filterArgs})

		for {
			select {
			case <-ctx.Done():
				r.Logger.Info("Shutting down ReloaderController event loop")
				r.cli.Close()
				return
			case err := <-errCh:
				r.Logger.Error("Docker Events API error", zap.Error(err))
				observability.BackendFailuresTotal.WithLabelValues("docker_events", "stream_error").Inc()
				time.Sleep(5 * time.Second) // Backoff
				msgCh, errCh = r.cli.Events(ctx, events.ListOptions{Filters: filterArgs})
			case msg := <-msgCh:
				if msg.Action == "start" {
					if _, hasLabel := msg.Actor.Attributes["dso.reloader"]; hasLabel {
						strategy := msg.Actor.Attributes["dso.update.strategy"]
						if strategy == "" {
							strategy = "restart" // default
						}
						composePath := msg.Actor.Attributes["dso.compose.path"]
						secretList := strings.Split(msg.Actor.Attributes["dso.secrets"], ",")

						r.Targets.Store(msg.Actor.ID, &TargetContainer{
							ID:          msg.Actor.ID,
							Strategy:    strategy,
							ComposePath: composePath,
							Secrets:     secretList,
						})
						r.Logger.Info("Registered target container dynamically", zap.String("id", msg.Actor.ID), zap.String("strategy", strategy))
					}
				} else if msg.Action == "die" || msg.Action == "stop" {
					if _, loaded := r.Targets.LoadAndDelete(msg.Actor.ID); loaded {
						r.Logger.Info("De-registered target container", zap.String("id", msg.Actor.ID))
					}
				}
			}
		}
	}()
}

func (r *ReloaderController) populateInitialTargets(ctx context.Context) {
	filterArgs := filters.NewArgs()
	filterArgs.Add("label", "dso.reloader=true")

	containers, err := r.cli.ContainerList(ctx, container.ListOptions{Filters: filterArgs})
	if err != nil {
		r.Logger.Error("Failed to list initial containers", zap.Error(err))
		return
	}

	for _, c := range containers {
		strategy := c.Labels["dso.update.strategy"]
		if strategy == "" {
			strategy = "restart"
		}
		composePath := c.Labels["dso.compose.path"]
		secretList := strings.Split(c.Labels["dso.secrets"], ",")

		r.Targets.Store(c.ID, &TargetContainer{
			ID:          c.ID,
			Strategy:    strategy,
			ComposePath: composePath,
			Secrets:     secretList,
		})
	}
	r.Logger.Info("Initial container population complete")
}

// TriggerReload executes the appropriate action for all active, mapped containers
func (r *ReloaderController) TriggerReload(ctx context.Context, secretName string) error {
	r.Targets.Range(func(key, value interface{}) bool {
		target := value.(*TargetContainer)

		// Filter: only reload if the container uses THIS secret (or if secretName is empty for global reload)
		usesSecret := false
		if secretName == "" {
			usesSecret = true
		} else {
			for _, s := range target.Secrets {
				if s == secretName || strings.Contains(secretName, s) || strings.Contains(s, secretName) {
					usesSecret = true
					break
				}
			}
		}

		if !usesSecret {
			return true
		}

		if target.ComposePath != "" && target.Strategy == "restart" {
			r.Logger.Info("Triggering native Docker Compose rotation", zap.String("id", target.ID), zap.String("path", target.ComposePath))
			// Run 'docker-dso up -d' using the binary path or proxy
			// Actually, the agent can call the plugin's 'up' logic or just 'docker compose up -d'
			// Since the agent already has the env injected, calling 'docker compose up -d' 
			// with the same transformed env will work IF the agent is in the same context.
			// Better: The agent should just run 'docker compose -f path up -d'
			cmd := exec.Command("docker", "compose", "-f", target.ComposePath, "up", "-d")
			cmd.Env = os.Environ() // Agent has the master config, but we need the specific container env?
			// Actually, running 'docker dso up -d' is even better but might cause recursion.
			// We'll stick to a simple compose up for now.
			if err := cmd.Run(); err != nil {
				r.Logger.Error("Failed to trigger compose rotation", zap.Error(err))
			}
			return true
		}

		if target.Strategy == "signal" {
			r.Logger.Info("Sending SIGHUP to container", zap.String("id", target.ID))
			if err := r.cli.ContainerKill(ctx, target.ID, "SIGHUP"); err != nil {
				r.Logger.Error("Failed to signal container", zap.String("id", target.ID), zap.Error(err))
				observability.BackendFailuresTotal.WithLabelValues("docker_injector", "signal_failed").Inc()
			}
		} else if target.Strategy == "restart" {
			r.Logger.Info("Executing Stop/Start restart pattern", zap.String("id", target.ID))

			timeout := 10 // 10 seconds grace period
			stopOpts := container.StopOptions{Timeout: &timeout}
			if err := r.cli.ContainerStop(ctx, target.ID, stopOpts); err != nil {
				r.Logger.Error("Failed to stop container", zap.String("id", target.ID), zap.Error(err))
				observability.BackendFailuresTotal.WithLabelValues("docker_injector", "stop_failed").Inc()
				return true
			}

			startOpts := container.StartOptions{}
			if err := r.cli.ContainerStart(ctx, target.ID, startOpts); err != nil {
				r.Logger.Error("Failed to start container", zap.String("id", target.ID), zap.Error(err))
				observability.BackendFailuresTotal.WithLabelValues("docker_injector", "start_failed").Inc()
				return true
			}

			r.Logger.Info("Container securely restarted", zap.String("id", target.ID))
		}
		return true
	})
	return nil
}
