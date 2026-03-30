package analyzer

import (
	"strings"

	"github.com/docker/docker/api/types"
)

type AnalysisResult struct {
	ContainerName       string
	HasFixedPortBinding bool
	HasContainerName    bool
	HasRestartAlways    bool
	IsStateful          bool
	SupportsScaling     bool
	HasHealthCheck      bool
	NetworkMode         string
	FixedPorts          []string
}

func AnalyzeContainer(container types.ContainerJSON) AnalysisResult {
	res := AnalysisResult{
		ContainerName: strings.TrimPrefix(container.Name, "/"),
		NetworkMode:   string(container.HostConfig.NetworkMode),
		FixedPorts:    []string{},
	}

	// 1. Container Name
	if container.Name != "" {
		res.HasContainerName = true
	}

	// 2. Restart Policy
	if container.HostConfig.RestartPolicy.Name == "always" {
		res.HasRestartAlways = true
	}

	// 3. Health Check
	if container.Config.Healthcheck != nil && len(container.Config.Healthcheck.Test) > 0 {
		res.HasHealthCheck = true
	}

	// 4. Fixed Port Binding
	for _, bindings := range container.HostConfig.PortBindings {
		for _, binding := range bindings {
			if binding.HostPort != "" && binding.HostPort != "0" {
				res.HasFixedPortBinding = true
				res.FixedPorts = append(res.FixedPorts, binding.HostPort)
				break
			}
		}
	}

	// 5. Stateful Detection (MySQL, Postgres, Mongo or /var/lib/* mounts)
	img := strings.ToLower(container.Config.Image)
	if strings.Contains(img, "mysql") || strings.Contains(img, "postgres") || strings.Contains(img, "mongo") {
		res.IsStateful = true
	} else if container.Mounts != nil {
		for _, m := range container.Mounts {
			if strings.HasPrefix(m.Destination, "/var/lib/") {
				res.IsStateful = true
				break
			}
		}
	}

	// 6. Scaling capability
	res.SupportsScaling = !res.HasContainerName && !res.HasFixedPortBinding

	return res
}
