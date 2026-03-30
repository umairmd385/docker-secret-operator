package rotation

import (
	"context"
	"fmt"
	"time"

	"github.com/docker/docker/client"
)

// WaitHealthy monitors the shadow instance status before cutover
func WaitHealthy(ctx context.Context, cli *client.Client, containerID string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)

	for time.Now().Before(deadline) {
		inspect, err := cli.ContainerInspect(ctx, containerID)
		if err != nil {
			return fmt.Errorf("failed to inspect container health: %w", err)
		}

		// Check Docker native health check status if present
		if inspect.State.Health != nil {
			switch inspect.State.Health.Status {
			case "healthy":
				return nil
			case "unhealthy":
				return fmt.Errorf("container became unhealthy during rotation")
			case "starting":
				// still waiting...
			}
		} else {
			// Fallback: If no health check defined, just wait for 'running' state
			if inspect.State.Running && !inspect.State.Restarting {
				// Give it a small 5s grace period as a safety buffer
				time.Sleep(5 * time.Second)
				return nil
			}
		}

		time.Sleep(2 * time.Second)
	}

	return fmt.Errorf("rotation timed out after %v without health confirmation", timeout)
}
