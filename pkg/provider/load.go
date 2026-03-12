package provider

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/hashicorp/go-plugin"
)

// LoadProvider dynamically executes the provider binary and dispenses the RPC client
func LoadProvider(providerName string, providerConfig map[string]string) (api.SecretProvider, *plugin.Client, error) {
	pluginDir := os.Getenv("DSO_PLUGIN_DIR")
	if pluginDir == "" {
		pluginDir = "/usr/local/lib/dso/plugins"
	}
	pluginName := fmt.Sprintf("dso-provider-%s", providerName)
	pluginPath := filepath.Join(pluginDir, pluginName)

	// In a complete production scenario, here is where one would implement
	// SecureConfig: &plugin.SecureConfig{Checksum: providedSha256}
	// to cryptographically verify the plugin binary before execution.

	client := plugin.NewClient(&plugin.ClientConfig{
		HandshakeConfig: Handshake,
		Plugins:         PluginMap,
		Cmd:             exec.Command(pluginPath),
	})

	rpcClient, err := client.Client()
	if err != nil {
		client.Kill()
		return nil, client, fmt.Errorf("failed to start provider plugin client %s: %w", pluginName, err)
	}

	raw, err := rpcClient.Dispense("provider")
	if err != nil {
		client.Kill()
		return nil, client, fmt.Errorf("failed to dispense provider plugin %s: %w", pluginName, err)
	}

	prov := raw.(api.SecretProvider)

	// Inject the dynamic YAML configuration map
	if providerConfig != nil {
		if err := prov.Init(providerConfig); err != nil {
			client.Kill()
			return nil, client, fmt.Errorf("provider %s failed to initialize: %w", pluginName, err)
		}
	}

	return prov, client, nil
}
