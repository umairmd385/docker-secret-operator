package provider

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/backend/env"
	"github.com/docker-secret-operator/dso/pkg/backend/file"
	"github.com/hashicorp/go-plugin"
)

// validatePluginPath performs security checks on plugin path to prevent command injection (CWE-78)
func validatePluginPath(path string) error {
	// 1. Check if path is absolute
	if !filepath.IsAbs(path) {
		return fmt.Errorf("plugin path must be absolute: %s", path)
	}

	// 2. Verify path is within allowed directory
	allowedDirs := []string{
		"/var/lib/dso/plugins",
		"/usr/local/lib/dso/plugins",
		"/etc/dso/plugins",
	}

	isAllowed := false
	for _, dir := range allowedDirs {
		if strings.HasPrefix(path, dir) {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return fmt.Errorf("plugin must be in allowed directory: %s", path)
	}

	// 3. Check file exists and is not a symlink
	info, err := os.Lstat(path)
	if err != nil {
		return fmt.Errorf("plugin not accessible: %w", err)
	}

	if info.Mode()&os.ModeSymlink != 0 {
		return fmt.Errorf("plugin cannot be a symlink")
	}

	// 4. Verify file is executable
	if info.Mode()&0111 == 0 {
		return fmt.Errorf("plugin must be executable")
	}

	return nil
}

// sanitizeEnv returns a safe environment for plugin execution
func sanitizeEnv() []string {
	return []string{
		"PATH=/usr/local/bin:/usr/bin:/bin",
	}
}

// LoadProvider dynamically executes the provider binary and dispenses the RPC client
func LoadProvider(providerName string, providerConfig map[string]string) (api.SecretProvider, *plugin.Client, error) {
	// 1. Check for native local backends first
	switch providerName {
	case "file":
		prov := &file.FileProvider{}
		if providerConfig == nil {
			providerConfig = make(map[string]string)
		}
		if err := prov.Init(providerConfig); err != nil {
			return nil, nil, fmt.Errorf("local file provider failed to initialize: %w", err)
		}
		return prov, nil, nil
	case "env":
		prov := &env.EnvProvider{}
		return prov, nil, nil
	}

	// 2. Load external plugins
	pluginDir := os.Getenv("DSO_PLUGIN_DIR")
	if pluginDir == "" {
		pluginDir = "/usr/local/lib/dso/plugins"
	}
	pluginName := fmt.Sprintf("dso-provider-%s", providerName)
	pluginPath := filepath.Join(pluginDir, pluginName)

	if err := validatePluginPath(pluginPath); err != nil {
		return nil, nil, fmt.Errorf("security validation for plugin %s failed: %w", pluginName, err)
	}

	cmd := exec.Command(pluginPath)
	cmd.Env = sanitizeEnv()

	client := plugin.NewClient(&plugin.ClientConfig{
		HandshakeConfig: Handshake,
		Plugins:         PluginMap,
		Cmd:             cmd,
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
	if providerConfig == nil {
		providerConfig = make(map[string]string)
	}
	if err := prov.Init(providerConfig); err != nil {
		client.Kill()
		return nil, client, fmt.Errorf("provider %s failed to initialize: %w", pluginName, err)
	}

	return prov, client, nil
}
