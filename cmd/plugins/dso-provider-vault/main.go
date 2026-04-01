package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"github.com/hashicorp/go-plugin"
	vault "github.com/hashicorp/vault/api"
)

type VaultProvider struct {
	client *vault.Client
	mount  string
}

func (p *VaultProvider) Init(config map[string]string) error {
	vaultAddr := config["address"]
	if vaultAddr == "" {
		vaultAddr = "http://127.0.0.1:8200"
	}

	vaultToken := config["token"]
	if vaultToken == "" {
		return fmt.Errorf("vault token is required")
	}

	p.mount = config["mount"]
	if p.mount == "" {
		p.mount = "secret"
	}

	cfg := vault.DefaultConfig()
	cfg.Address = vaultAddr

	client, err := vault.NewClient(cfg)
	if err != nil {
		return fmt.Errorf("failed to create vault client: %w", err)
	}

	client.SetToken(vaultToken)
	p.client = client

	return nil
}

func (p *VaultProvider) GetSecret(name string) (map[string]string, error) {
	// Support ?version= kv v2 version pinning
	version := ""
	cleanName := name
	if strings.Contains(name, "?version=") {
		parts := strings.SplitN(name, "?version=", 2)
		cleanName = parts[0]
		version = parts[1]
	}

	// Vault KV v2 uses 'data' in the path
	path := fmt.Sprintf("%s/data/%s", p.mount, cleanName)

	var secret *vault.Secret
	var err error
	if version != "" {
		secret, err = p.client.Logical().ReadWithData(path, map[string][]string{"version": {version}})
	} else {
		secret, err = p.client.Logical().Read(path)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to read vault secret %s: %w", name, err)
	}

	if secret == nil {
		return nil, fmt.Errorf("vault secret %s not found", name)
	}

	data, ok := secret.Data["data"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid vault secret format for %s", name)
	}

	result := make(map[string]string)
	for k, v := range data {
		result[k] = fmt.Sprintf("%v", v)
	}

	return result, nil
}

func (p *VaultProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		ticker := time.NewTicker(interval)
		for range ticker.C {
			data, err := p.GetSecret(name)
			var errMsg string
			if err != nil {
				errMsg = err.Error()
			}
			ch <- api.SecretUpdate{Name: name, Data: data, Error: errMsg}
		}
	}()
	return ch, nil
}

func main() {
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: provider.Handshake,
		Plugins: map[string]plugin.Plugin{
			"provider": &provider.SecretProviderPlugin{Impl: &VaultProvider{}},
		},
	})
}
