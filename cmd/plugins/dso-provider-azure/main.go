package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"github.com/hashicorp/go-plugin"
)

type AzureProvider struct {
	client *azsecrets.Client
}

func (p *AzureProvider) Init(cfg map[string]string) error {
	vaultURL, ok := cfg["vault_url"]
	if !ok || vaultURL == "" {
		return fmt.Errorf("azure provider requires 'vault_url' in config")
	}

	// DefaultAzureCredential respects az login, env vars, and workload identity
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		return fmt.Errorf("failed to obtain azure credentials: %w", err)
	}

	client, err := azsecrets.NewClient(vaultURL, cred, nil)
	if err != nil {
		return fmt.Errorf("failed to create azure secrets client: %w", err)
	}

	p.client = client
	return nil
}

func (p *AzureProvider) GetSecret(name string) (map[string]string, error) {
	if p.client == nil {
		return nil, fmt.Errorf("azure provider not initialized")
	}

	// Azure Key Vault does not allow underscores in names. Automatically replace if mapping.
	azureName := strings.ReplaceAll(name, "_", "-")

	resp, err := p.client.GetSecret(context.TODO(), azureName, "", nil)
	if err != nil {
		return nil, fmt.Errorf("failed fetching secret from azure: %w", err)
	}

	if resp.Value == nil {
		return nil, fmt.Errorf("azure secret %s has no value", name)
	}

	var data map[string]string
	if err := json.Unmarshal([]byte(*resp.Value), &data); err != nil {
		return map[string]string{"value": *resp.Value}, nil
	}

	return data, nil
}

func (p *AzureProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		ticker := time.NewTicker(interval)
		for range ticker.C {
			val, err := p.GetSecret(name)
			var errMsg string
			if err != nil {
				errMsg = err.Error()
			}
			ch <- api.SecretUpdate{Name: name, Data: val, Error: errMsg}
		}
	}()
	return ch, nil
}

func main() {
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: provider.Handshake,
		Plugins: map[string]plugin.Plugin{
			"provider": &provider.SecretProviderPlugin{Impl: &AzureProvider{}},
		},
	})
}
