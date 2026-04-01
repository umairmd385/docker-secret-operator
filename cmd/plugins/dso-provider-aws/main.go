package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"github.com/hashicorp/go-plugin"
)

type AWSProvider struct {
	client *secretsmanager.Client
}

func (p *AWSProvider) Init(cfg map[string]string) error {
	opts := []func(*config.LoadOptions) error{}

	// If region is specified in dso.yaml, override it
	if region, ok := cfg["region"]; ok && region != "" {
		opts = append(opts, config.WithRegion(region))
	}

	awsCfg, err := config.LoadDefaultConfig(context.TODO(), opts...)
	if err != nil {
		return fmt.Errorf("failed to load AWS default config: %w", err)
	}

	p.client = secretsmanager.NewFromConfig(awsCfg)
	return nil
}

func (p *AWSProvider) GetSecret(name string) (map[string]string, error) {
	if p.client == nil {
		return nil, fmt.Errorf("aws provider not initialized")
	}

	input := &secretsmanager.GetSecretValueInput{
		SecretId: &name,
	}

	result, err := p.client.GetSecretValue(context.TODO(), input)
	if err != nil {
		return nil, fmt.Errorf("failed fetching secret from aws: %w", err)
	}

	if result.SecretString == nil {
		return nil, fmt.Errorf("aws secret %s has no string value", name)
	}

	var data map[string]string
	// attempt JSON decode. If fail, assume raw string map
	if err := json.Unmarshal([]byte(*result.SecretString), &data); err != nil {
		data = map[string]string{"value": *result.SecretString}
	}

	// Fetch tags
	descInput := &secretsmanager.DescribeSecretInput{SecretId: &name}
	descResult, err := p.client.DescribeSecret(context.TODO(), descInput)
	if err == nil && descResult.Tags != nil {
		for _, tag := range descResult.Tags {
			if tag.Key != nil && tag.Value != nil {
				data["_TAG_"+*tag.Key] = *tag.Value
			}
		}
	}

	return data, nil
}

func (p *AWSProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		// send immediately
		val, err := p.GetSecret(name)
		var errMsg string
		if err != nil {
			errMsg = err.Error()
		}
		ch <- api.SecretUpdate{Name: name, Data: val, Error: errMsg}

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
			"provider": &provider.SecretProviderPlugin{Impl: &AWSProvider{}},
		},
	})
}
