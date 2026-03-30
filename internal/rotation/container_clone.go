package rotation

import (
	"context"
	"fmt"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
)

// ContainerCloner handles the metadata extraction for shadow instances
type ContainerCloner struct {
	cli *client.Client
}

func NewContainerCloner(cli *client.Client) *ContainerCloner {
	return &ContainerCloner{cli: cli}
}

// PrepareShadowConfig extracts and modifies the configuration of an existing container for rolling update
func (cc *ContainerCloner) PrepareShadowConfig(ctx context.Context, containerID string, newEnvs map[string]string) (*container.Config, *container.HostConfig, *network.NetworkingConfig, string, error) {
	inspect, err := cc.cli.ContainerInspect(ctx, containerID)
	if err != nil {
		return nil, nil, nil, "", fmt.Errorf("failed to inspect container: %w", err)
	}

	config := inspect.Config
	hostConfig := inspect.HostConfig
	
	// Create Shadow Name
	originalName := strings.TrimPrefix(inspect.Name, "/")
	shadowName := originalName + "_dso_shadow"

	// Inject new environment variables
	for k, v := range newEnvs {
		found := false
		for i, e := range config.Env {
			if strings.HasPrefix(e, k+"=") {
				config.Env[i] = fmt.Sprintf("%s=%s", k, v)
				found = true
				break
			}
		}
		if !found {
			config.Env = append(config.Env, fmt.Sprintf("%s=%s", k, v))
		}
	}

	// Prepare networking
	networkConfig := &network.NetworkingConfig{
		EndpointsConfig: inspect.NetworkSettings.Networks,
	}

	// Important: We must ensure no port conflicts if it's a fixed port mapping
	// In pure rolling, we normally use a load balancer or internal networks.
	// For standalone dso, we might have to briefly "shadow" without public ports.

	return config, hostConfig, networkConfig, shadowName, nil
}
