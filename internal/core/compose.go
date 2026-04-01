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
func RunComposeUpWithEnv(filename string, extraArgs []string, configPath string, dryRun bool) error {
	envMap := make(map[string]string)
	for _, e := range os.Environ() {
		parts := strings.SplitN(e, "=", 2)
		if len(parts) == 2 {
			envMap[parts[0]] = parts[1]
		}
	}

	// Resolve config path if empty
	targetConfig := configPath
	if targetConfig == "" {
		if _, err := os.Stat("dso.yaml"); err == nil {
			targetConfig = "dso.yaml"
		} else if _, err := os.Stat("/etc/dso/dso.yaml"); err == nil {
			targetConfig = "/etc/dso/dso.yaml"
		}
	}

	cfg, err := config.LoadConfig(targetConfig)
	if err == nil {
		fmt.Printf("DSO matched config: %s\n", targetConfig)
		socketPath := "/var/run/dso.sock"
		if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
			socketPath = custom
		}
		client, err := injector.NewAgentClient(socketPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Warning: Agent connection failed (%v). Proceeding without dynamic env injection.\n", err)
		} else {
			injectedEnvs, err := client.FetchAllEnvs(cfg)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error: Injection failed: %v\n", err)
				os.Exit(1)
			}
			for k, v := range injectedEnvs {
				envMap[k] = v
			}
		}
	} else if configPath != "" && configPath != "dso.yaml" {
		fmt.Fprintf(os.Stderr, "Warning: Config load error (%v). Proceeding with host environment.\n", err)
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
	secDir, err := os.MkdirTemp("", "dso-secrets-*")
	if err != nil {
		return fmt.Errorf("failed to create secure temp dir: %w", err)
	}
	_ = os.Chmod(secDir, 0700)

	for secretName, secretConfigRaw := range parsed.Secrets {
		secretConfig, ok := secretConfigRaw.(map[string]interface{})
		if !ok {
			continue
		}

		if dsoUriRaw, exists := secretConfig["dso"]; exists {
			dsoUri := fmt.Sprintf("%v", dsoUriRaw)
			parts := strings.SplitN(dsoUri, "://", 2)
			if len(parts) == 2 {
				providerName := parts[0]
				secretPath := parts[1]

				val, err := fetchSecretDirectly(providerName, secretPath)
				if err != nil {
					return fmt.Errorf("failed to fetch secret %s from %s: %w", secretPath, providerName, err)
				}

				tempFilePath := filepath.Join(secDir, secretName)
				_ = os.WriteFile(tempFilePath, []byte(val), 0600)

				delete(secretConfig, "dso")
				secretConfig["file"] = tempFilePath
				parsed.Secrets[secretName] = secretConfig
			}
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

	// Always use the transformed file to ensure labels are injected
	transformedFilename := filepath.Join(secDir, "docker-compose.dso-transformed.yml")
	transformedData, err := yaml.Marshal(&parsed)
	if err == nil {
		_ = os.WriteFile(transformedFilename, transformedData, 0600)
	}

	// Step 3: Run docker compose
	// CRITICAL: We must pass the original project name, otherwise Docker uses the tmp dir name
	// and causes container naming conflicts.
	projectName := filepath.Base(filepath.Dir(absPath))
	args := append([]string{"compose", "-p", projectName, "-f", transformedFilename, "up"}, extraArgs...)
	cmd := exec.Command("docker", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = finalEnvs

	if dryRun {
		fmt.Printf("DRY RUN: DSO would securely inject the following secrets into %s:\n", filename)
		for _, e := range finalEnvs {
			if cfg != nil {
				// Hide actual secret values for safety by checking if the env var matches our config
				parts := strings.SplitN(e, "=", 2)
				if len(parts) == 2 {
					isSecret := false
					for _, s := range cfg.Secrets {
						for _, mapKey := range s.Mappings {
							if mapKey == parts[0] {
								isSecret = true
								break
							}
						}
					}
					if isSecret {
						fmt.Printf("  - %s=******** (masking length %d)\n", parts[0], len(parts[1]))
					}
				}
			}
		}
		for secretName, configRaw := range parsed.Secrets {
			if cfgMap, ok := configRaw.(map[string]interface{}); ok {
				if fileUrl, exists := cfgMap["file"]; exists {
					fmt.Printf("  - file mount: %s -> %v [auto-tmpfs injected]\n", secretName, fileUrl)
				}
			}
		}
		fmt.Println("DRY RUN completed successfully. Use without --dry-run to deploy.")
		_ = os.RemoveAll(secDir)
		return nil
	}

	fmt.Printf("DSO securely injecting secrets for %s...\n", filename)
	err = cmd.Run()

	// Cleanup
	_ = os.RemoveAll(secDir)
	return err
}

func fetchSecretDirectly(provider, secretPath string) (string, error) {
	socketPath := "/var/run/dso.sock"
	if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
		socketPath = custom
	}

	client, err := injector.NewAgentClient(socketPath)
	if err != nil {
		return "", fmt.Errorf("agent connection failed: %w", err)
	}

	data, err := client.FetchSecret(provider, map[string]string{}, secretPath)
	if err != nil {
		return "", err
	}

	if len(data) == 1 {
		for _, v := range data {
			return v, nil
		}
	}

	bytes, _ := json.Marshal(data)
	return string(bytes), nil
}
