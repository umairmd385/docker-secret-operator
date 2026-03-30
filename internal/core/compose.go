package core

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"gopkg.in/yaml.v3"
)

type ComposeFile struct {
	Version  string                 `yaml:"version,omitempty"`
	Services map[string]interface{} `yaml:"services,omitempty"`
	Secrets  map[string]interface{} `yaml:"secrets,omitempty"`
	Other    map[string]interface{} `yaml:",inline"`
}

// RunComposeUpWithEnv parses the compose file, fetches DSO custom secrets for file overrides, merges them with dso.yaml ENV configurations, and dynamically runs docker compose.
func RunComposeUpWithEnv(filename string, extraArgs []string, configPath string) error {
	envMap := make(map[string]string)

	cfg, err := config.LoadConfig(configPath)
	if err == nil {
		socketPath := "/var/run/dso.sock"
		if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
			socketPath = custom
		}
		if client, err := injector.NewAgentClient(socketPath); err == nil {
			if injectedEnvs, err := client.FetchAllEnvs(cfg); err == nil {
				for k, v := range injectedEnvs {
					envMap[k] = v
				}
			}
		}
	}

	for _, e := range os.Environ() {
		parts := strings.SplitN(e, "=", 2)
		if len(parts) == 2 {
			envMap[parts[0]] = parts[1]
		}
	}

	var finalEnvs []string
	for k, v := range envMap {
		finalEnvs = append(finalEnvs, fmt.Sprintf("%s=%s", k, v))
	}

	data, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("failed to read %s: %w", filename, err)
	}

	var parsed ComposeFile
	if err := yaml.Unmarshal(data, &parsed); err != nil {
		return fmt.Errorf("failed to parse compose file: %w", err)
	}

	// We need a securely mounted tmpfs ideally, but for now we use a restricted temp dir.
	// In production, users should ensure /tmp is tmpfs or we use /dev/shm.
	secDir, err := os.MkdirTemp("", "dso-secrets-*")
	if err != nil {
		return fmt.Errorf("failed to create secure temp dir: %w", err)
	}
	// Best effort to clean up, though syscall.Exec will replace our process so defer won't run.
	// We'll let the OS clean it up eventually, or we run docker compose synchronously and then cleanup.

	_ = os.Chmod(secDir, 0700)

	hasDsoSecrets := false

	for secretName, secretConfigRaw := range parsed.Secrets {
		secretConfig, ok := secretConfigRaw.(map[string]interface{})
		if !ok {
			continue
		}

		if dsoUriRaw, exists := secretConfig["dso"]; exists {
			hasDsoSecrets = true
			dsoUri := fmt.Sprintf("%v", dsoUriRaw)

			// Simple URI parsing, e.g., aws-sm://prod/db/password
			parts := strings.SplitN(dsoUri, "://", 2)
			if len(parts) != 2 {
				return fmt.Errorf("invalid dso URI format: %s", dsoUri)
			}
			providerName := parts[0]
			secretPath := parts[1]

			// Fetch the secret securely
			val, err := fetchSecretDirectly(providerName, secretPath)
			if err != nil {
				return fmt.Errorf("failed to fetch secret %s from %s: %w", secretPath, providerName, err)
			}

			// Write to temp file
			tempFilePath := filepath.Join(secDir, secretName)
			err = os.WriteFile(tempFilePath, []byte(val), 0600)
			if err != nil {
				return fmt.Errorf("failed to write temporary secret file: %w", err)
			}

			// Modify the compose struct: replace "dso: uri" with "file: path"
			delete(secretConfig, "dso")
			secretConfig["file"] = tempFilePath
			parsed.Secrets[secretName] = secretConfig
		}
	}

	// Step 2: Inject rotation management labels into all services
	absPath, _ := filepath.Abs(filename)
	for name, svcRaw := range parsed.Services {
		svc, ok := svcRaw.(map[string]interface{})
		if !ok {
			continue
		}

		labels := make(map[string]interface{})
		if existingLabels, ok := svc["labels"].(map[string]interface{}); ok {
			labels = existingLabels
		} else if existingLabels, ok := svc["labels"].([]interface{}); ok {
			// Convert slice labels to map if needed
			for _, l := range existingLabels {
				parts := strings.SplitN(fmt.Sprintf("%v", l), "=", 2)
				if len(parts) == 2 {
					labels[parts[0]] = parts[1]
				} else {
					labels[parts[0]] = ""
				}
			}
		}

		labels["dso.reloader"] = "true"
		labels["dso.compose.path"] = absPath
		
		// Map secrets into label for affinity
		var used []string
		if cfg != nil {
			for _, s := range cfg.Secrets {
				used = append(used, s.Name)
			}
		}
		if len(used) > 0 {
			labels["dso.secrets"] = strings.Join(used, ",")
		}

		svc["labels"] = labels
		parsed.Services[name] = svc
	}

	if !hasDsoSecrets {
		// Just run docker compose normally
		return execDockerCompose(filename, extraArgs, finalEnvs)
	}

	// Write the transformed compose file
	transformedFilename := filepath.Join(secDir, "docker-compose.dso-transformed.yml")
	transformedData, err := yaml.Marshal(&parsed)
	if err != nil {
		return fmt.Errorf("failed to marshal transformed compose file: %w", err)
	}

	err = os.WriteFile(transformedFilename, transformedData, 0600)
	if err != nil {
		return fmt.Errorf("failed to write transformed compose file: %w", err)
	}

	// Run docker compose synchronously to allow cleanup after
	fmt.Printf("DSO injected %s securely. Starting docker compose...\n", filename)
	cmd := exec.Command("docker", append([]string{"compose", "-f", transformedFilename, "up"}, extraArgs...)...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = finalEnvs

	err = cmd.Run()

	// Cleanup secrets from memory explicitly
	_ = os.RemoveAll(secDir)

	return err
}

// fetchSecretDirectly uses the existing agent or a direct provider call to fetch a secret string.
func fetchSecretDirectly(provider, secretPath string) (string, error) {
	socketPath := "/var/run/dso.sock"
	if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
		socketPath = custom
	}

	client, err := injector.NewAgentClient(socketPath)
	if err != nil {
		return "", fmt.Errorf("agent connection failed: %w", err)
	}

	// We'll pass empty config map to rely on agent's default provider config
	data, err := client.FetchSecret(provider, map[string]string{}, secretPath)
	if err != nil {
		return "", err
	}

	// If it's a JSON secret, we just stringify the whole JSON or extract a default key.
	// For standard Docker secrets, passing a single string is expected.
	// If the user mapped it, they might want a specific key.
	// If the provider returns "value" (like Azure), we extract it natively.
	if len(data) == 1 {
		for _, v := range data {
			return v, nil
		}
	}

	// Dump full JSON string if multiple keys
	// This is standard practice for mounting JSON into docker secrets.
	// We'll quickly marshal it back.
	bytes, _ := json.Marshal(data)
	return string(bytes), nil
}

func execDockerCompose(filename string, extraArgs []string, finalEnvs []string) error {
	args := append([]string{"compose", "-f", filename, "up"}, extraArgs...)
	cmd := exec.Command("docker", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = finalEnvs
	return cmd.Run()
}
