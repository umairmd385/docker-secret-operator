package watcher

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/internal/analyzer"
	"github.com/docker-secret-operator/dso/internal/core"
	"github.com/docker-secret-operator/dso/internal/rotation"
	"github.com/docker-secret-operator/dso/internal/strategy"
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
	Server  interface{}
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
				time.Sleep(5 * time.Second)
				msgCh, errCh = r.cli.Events(ctx, events.ListOptions{Filters: filterArgs})
			case msg := <-msgCh:
				if msg.Action == "start" {
					if _, hasLabel := msg.Actor.Attributes["dso.reloader"]; hasLabel {
						strategy := msg.Actor.Attributes["dso.update.strategy"]
						if strategy == "" {
							strategy = "restart"
						}
						composePath := msg.Actor.Attributes["dso.compose.path"]
						secretList := strings.Split(msg.Actor.Attributes["dso.secrets"], ",")

						r.Targets.Store(msg.Actor.ID, &TargetContainer{
							ID:          msg.Actor.ID,
							Strategy:    strategy,
							ComposePath: composePath,
							Secrets:     secretList,
						})
						r.Logger.Info("Registered target container dynamically", zap.String("id", msg.Actor.ID))
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

func (r *ReloaderController) TriggerReload(ctx context.Context, secretName string) error {
	r.Targets.Range(func(key, value interface{}) bool {
		target := value.(*TargetContainer)

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

		activeStrategy := target.Strategy
		if activeStrategy == "auto" || activeStrategy == "" {
			inspect, err := r.cli.ContainerInspect(ctx, target.ID)
			if err == nil {
				analysisResult := analyzer.AnalyzeContainer(inspect)
				decision := strategy.DecideStrategy(analysisResult)

				if r.Server != nil {
					if as, ok := r.Server.(interface{ Emit(string) }); ok {
						as.Emit("\n" + decision.Report)
					}
				}
				activeStrategy = decision.Strategy
			} else {
				activeStrategy = "restart"
			}
		}

		if target.ComposePath != "" && activeStrategy == "restart" {
			r.Logger.Info("Triggering native Docker Compose rotation via Core Engine", zap.String("path", target.ComposePath))
			
			go func() {
				RecordDSOAction(filepath.Base(filepath.Dir(target.ComposePath)))
				
				if r.Server != nil {
					if as, ok := r.Server.(interface{ Emit(string) }); ok {
						as.Emit(fmt.Sprintf("\033[1;36m[DSO EXECUTION]\033[0m\nStrategy: restart (compose)\n🔄 Native rotation: Scaling %s from compose context.", target.ComposePath))
					}
				}
				err := core.RunComposeUpWithEnv(target.ComposePath, []string{"-d"}, "", false)
				if err != nil {
					r.Logger.Error("Background rotation failed", zap.Error(err))
				} else {
					r.Logger.Info("Background rotation successful", zap.String("path", target.ComposePath))
				}
			}()
			return true
		}

		if activeStrategy == "signal" {
			r.Logger.Info("Sending SIGHUP to container", zap.String("id", target.ID))
			_ = r.cli.ContainerKill(ctx, target.ID, "SIGHUP")
		} else if activeStrategy == "rolling" {
			r.Logger.Info("🚀 Executing Zero-Downtime Rolling Rotation", zap.String("id", target.ID))
			RecordDSOAction(target.ID)
			
			rs := rotation.NewRollingStrategy(r.cli)
			
			go func() {
				if r.Server != nil {
					if as, ok := r.Server.(interface{ Emit(string) }); ok {
						as.Emit(fmt.Sprintf("\033[1;36m[DSO EXECUTION]\033[0m\nStrategy: rolling\n🔄 Rolling Swap Start: %s", target.ID[:12]))
					}
				}

				err := rs.Execute(ctx, target.ID, map[string]string{}, 30*time.Second)
				if err != nil {
					r.Logger.Error("Rolling rotation failed, triggering fallback", zap.Error(err))
					if r.Server != nil {
						if as, ok := r.Server.(interface{ Emit(string) }); ok {
							as.Emit(fmt.Sprintf("\033[1;31m[DSO FALLBACK]\033[0m\nRolling failed due to: %v → switching to restart", err))
							as.Emit("\033[1;36m[DSO EXECUTION]\033[0m\nStrategy: restart\nStopping container → injecting new secrets → starting container")
						}
					}
					// FALLBACK
					timeout := 10
					_ = r.cli.ContainerStop(ctx, target.ID, container.StopOptions{Timeout: &timeout})
					_ = r.cli.ContainerStart(ctx, target.ID, container.StartOptions{})
				}
			}()

		} else if activeStrategy == "restart" {
			r.Logger.Info("Restarting container", zap.String("id", target.ID))
			RecordDSOAction(target.ID)
			
			if r.Server != nil {
				if as, ok := r.Server.(interface{ Emit(string) }); ok {
					as.Emit("\033[1;36m[DSO EXECUTION]\033[0m\nStrategy: restart\nStopping container → injecting new secrets → starting container")
				}
			}
			timeout := 10
			_ = r.cli.ContainerStop(ctx, target.ID, container.StopOptions{Timeout: &timeout})
			_ = r.cli.ContainerStart(ctx, target.ID, container.StartOptions{})
		}
		return true
	})
	return nil
}
