package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type AgentConfig struct {
	Cache           bool   `yaml:"cache"`
	RefreshInterval string `yaml:"refresh_interval"`
}

type SecretMapping struct {
	Name     string            `yaml:"name"`
	Inject   string            `yaml:"inject"` // "file", "env", "socket"
	Path     string            `yaml:"path,omitempty"`
	Mappings map[string]string `yaml:"mappings"`
}

type Config struct {
	Provider string            `yaml:"provider"`
	Config   map[string]string `yaml:"config,omitempty"`
	Region   string            `yaml:"region,omitempty"`
	Agent    AgentConfig       `yaml:"agent"`
	Secrets  []SecretMapping   `yaml:"secrets"`
}

func LoadConfig(cfgFile string) (*Config, error) {
	if cfgFile == "" {
		cfgFile = "dso.yaml"
	}

	data, err := os.ReadFile(cfgFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file %s: %w", cfgFile, err)
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("failed to parse yaml config: %w", err)
	}

	return &cfg, nil
}
