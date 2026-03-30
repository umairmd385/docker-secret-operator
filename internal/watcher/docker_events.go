package watcher

import (
	"context"
	"fmt"
	"os"

	"github.com/docker/docker/api/types/events"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

// DockerWatcher handles the low-level subscription to the Docker Events API
type DockerWatcher struct {
	cli   *client.Client
	Debug bool
}

func NewDockerWatcher(debug bool) (*DockerWatcher, error) {
	// Check socket permissions before starting
	socket := "/var/run/docker.sock"
	if _, err := os.Stat(socket); err != nil {
		return nil, fmt.Errorf("[ERROR] Cannot access Docker socket at %s. Try: sudo usermod -aG docker $USER", socket)
	}

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	return &DockerWatcher{
		cli:   cli,
		Debug: debug,
	}, nil
}

// Subscribe streams events based on the provided filters
func (dw *DockerWatcher) Subscribe(ctx context.Context) (<-chan events.Message, <-chan error) {
	filter := filters.NewArgs()
	filter.Add("type", "container")
	filter.Add("event", "start")
	filter.Add("event", "stop")
	filter.Add("event", "die")
	filter.Add("event", "restart")
	filter.Add("event", "kill")

	return dw.cli.Events(ctx, events.ListOptions{Filters: filter})
}
