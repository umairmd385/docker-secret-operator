package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"github.com/hashicorp/go-plugin"

	"github.com/huaweicloud/huaweicloud-sdk-go-v3/core/auth/basic"
	csms "github.com/huaweicloud/huaweicloud-sdk-go-v3/services/csms/v1"
	"github.com/huaweicloud/huaweicloud-sdk-go-v3/services/csms/v1/model"
	"github.com/huaweicloud/huaweicloud-sdk-go-v3/services/csms/v1/region"
)

type HuaweiProvider struct {
	client *csms.CsmsClient
}

func (h *HuaweiProvider) Init(config map[string]string) error {
	// Huawei config is handled in main via Env for MVP, but we satisfy the interface
	return nil
}

func (h *HuaweiProvider) GetSecret(name string) (map[string]string, error) {
	req := &model.ShowSecretVersionRequest{
		SecretName: name,
		VersionId:  "latest",
	}

	resp, err := h.client.ShowSecretVersion(req)
	if err != nil {
		return nil, fmt.Errorf("huawei csms error: %w", err)
	}

	if resp.Version == nil || resp.Version.SecretString == nil {
		return nil, fmt.Errorf("huawei csms returned empty secret for %s", name)
	}

	var data map[string]string
	// Attempt JSON unmarshal. If it fails, map the raw string.
	if err := json.Unmarshal([]byte(*resp.Version.SecretString), &data); err != nil {
		return map[string]string{"value": *resp.Version.SecretString}, nil
	}

	return data, nil
}

func (h *HuaweiProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		// send immediately
		val, err := h.GetSecret(name)
		var errMsg string
		if err != nil {
			errMsg = err.Error()
		}
		ch <- api.SecretUpdate{Name: name, Data: val, Error: errMsg}

		ticker := time.NewTicker(interval)
		for range ticker.C {
			val, err := h.GetSecret(name)
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
	ak := os.Getenv("HUAWEI_ACCESS_KEY")
	sk := os.Getenv("HUAWEI_SECRET_KEY")
	reg := os.Getenv("HUAWEI_REGION")

	if reg == "" {
		reg = "ap-southeast-3"
	}

	auth, err := basic.NewCredentialsBuilder().
		WithAk(ak).
		WithSk(sk).
		SafeBuild()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to build huawei credentials: %v\n", err)
		os.Exit(1)
	}

	client := csms.NewCsmsClient(
		csms.CsmsClientBuilder().
			WithRegion(region.ValueOf(reg)).
			WithCredential(auth).
			Build())

	impl := &HuaweiProvider{
		client: client,
	}

	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: provider.Handshake,
		Plugins: map[string]plugin.Plugin{
			"provider": &provider.SecretProviderPlugin{Impl: impl},
		},
	})
}
