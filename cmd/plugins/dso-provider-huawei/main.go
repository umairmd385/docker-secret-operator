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

// Init receives config from dso.yaml and builds the CSMS client.
// Credential priority:
//  1. dso.yaml config keys: access_key, secret_key
//  2. Environment variables: HUAWEI_ACCESS_KEY, HUAWEI_SECRET_KEY
//
// Region priority:
//  1. dso.yaml config key: region
//  2. Environment variable: HUAWEI_REGION
//  3. Default: ap-southeast-3
func (h *HuaweiProvider) Init(cfg map[string]string) error {
	// Resolve region: dso.yaml > env var > default
	reg := cfg["region"]
	if reg == "" {
		reg = os.Getenv("HUAWEI_REGION")
	}
	if reg == "" {
		reg = "ap-southeast-3"
	}

	// Resolve credentials: dso.yaml keys > env vars
	// For ECS IAM Agency, set these via /etc/dso/agent.env (EnvironmentFile in systemd)
	ak := cfg["access_key"]
	if ak == "" {
		ak = os.Getenv("HUAWEI_ACCESS_KEY")
	}
	sk := cfg["secret_key"]
	if sk == "" {
		sk = os.Getenv("HUAWEI_SECRET_KEY")
	}
	// SecurityToken is required when using temporary credentials from the
	// ECS metadata service (IAM Agency). Get it with:
	// curl http://169.254.169.254/openstack/latest/securitykey
	secToken := cfg["security_token"]
	if secToken == "" {
		secToken = os.Getenv("HUAWEI_SECURITY_TOKEN")
	}

	credBuilder := basic.NewCredentialsBuilder()
	if ak != "" {
		credBuilder = credBuilder.WithAk(ak)
	}
	if sk != "" {
		credBuilder = credBuilder.WithSk(sk)
	}
	if secToken != "" {
		credBuilder = credBuilder.WithSecurityToken(secToken)
	}
	if pid := cfg["project_id"]; pid != "" {
		credBuilder = credBuilder.WithProjectId(pid)
	}

	auth, err := credBuilder.SafeBuild()
	if err != nil {
		return fmt.Errorf("huawei credentials error: set access_key/secret_key in dso.yaml or HUAWEI_ACCESS_KEY/HUAWEI_SECRET_KEY env vars: %w", err)
	}

	h.client = csms.NewCsmsClient(
		csms.CsmsClientBuilder().
			WithRegion(region.ValueOf(reg)).
			WithCredential(auth).
			Build(),
	)
	return nil
}

func (h *HuaweiProvider) GetSecret(name string) (map[string]string, error) {
	if h.client == nil {
		return nil, fmt.Errorf("huawei provider not initialized — call Init() first")
	}

	req := &model.ShowSecretVersionRequest{
		SecretName: name,
		VersionId:  "latest",
	}

	resp, err := h.client.ShowSecretVersion(req)
	if err != nil {
		return nil, fmt.Errorf("huawei csms GetSecret(%q): %w", name, err)
	}
	if resp.Version == nil || resp.Version.SecretString == nil {
		return nil, fmt.Errorf("huawei csms returned empty secret for %q", name)
	}

	// Try JSON parse first; fall back to {"value": "<raw-string>"}
	var data map[string]string
	if err := json.Unmarshal([]byte(*resp.Version.SecretString), &data); err != nil {
		return map[string]string{"value": *resp.Version.SecretString}, nil
	}
	return data, nil
}

func (h *HuaweiProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		send := func() {
			val, err := h.GetSecret(name)
			errMsg := ""
			if err != nil {
				errMsg = err.Error()
			}
			ch <- api.SecretUpdate{Name: name, Data: val, Error: errMsg}
		}
		send() // send immediately on first call
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for range ticker.C {
			send()
		}
	}()
	return ch, nil
}

func main() {
	// DO NOT do any credential fetching or os.Exit calls here.
	// All initialization happens in Init() after the plugin handshake.
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: provider.Handshake,
		Plugins: map[string]plugin.Plugin{
			"provider": &provider.SecretProviderPlugin{Impl: &HuaweiProvider{}},
		},
	})
}
