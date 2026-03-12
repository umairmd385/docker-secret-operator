# DSO Architecture Review & Improvement Proposals

This document outlines the gaps and missing elements in the current Docker Secret Operator (DSO) implementation, preparing it for full-scale production readiness.

## 1. Architectural Issues and Missing Elements

### A. File-Based Secret Injection (tmpfs Mounts)
- **Current State**: The `injector` package (`pkg/injector/injector.go`) primarily supports mapping secrets into environment variables (`sec.Inject == "env"`).
- **Missing Element**: If `inject: file` is specified in `dso.yaml`, the system currently ignores it. 
- **Required Fix**: When `dso compose up` runs, the injector needs to dynamically allocate a temporary directory, write the secret to a `tmpfs` volume, and append a volume bind-mount argument (`-v /tmp/dso-secret:/run/secrets/api:ro`) into the Docker command execution string. Environment variables can be seen via `docker inspect`, making file-based `tmpfs` mounts the safest Docker option.

### B. Secret Rotation Delivery to Containers
- **Current State**: The `Rotator` successfully polls external APIs via `WatchSecret` and updates the internal `SecretCache`.
- **Missing Element**: Running containers do not receive the rotated secrets. Environment variables in running Docker processes are immutable.
- **Required Fix**: 
  - For `file` injected secrets: The agent should overwrite the underlying `tmpfs` file, which automatically updates inside the container.
  - For `env` injected secrets: The agent needs an optional mechanism to send a `SIGHUP` signal to the target container or trigger a restart command via the Docker Engine API.

## 2. Improvements for the Plugin System and Configuration

### A. Cryptographic Plugin Trust
- **Current State**: The `LoadProvider` mechanism in `pkg/provider/load.go` trusts any executable residing in `$DSO_PLUGIN_DIR` named `dso-provider-<name>`. 
- **Improvement**: Implement `plugin.SecureConfig` within the HashiCorp `go-plugin` client instantiation. The agent should compute the `SHA256` of the binary on disk and match it against a predefined trusted config (`dso-plugins-sha256.json`) prior to RPC connection.

### B. Multi-Region / Multiple Instances of the Same Provider
- **Current State**: `dso.yaml` assumes a single active provider for the entire operation (`provider: aws`).
- **Improvement**: Allow multiple cloud providers to exist simultaneously in the YAML array structure. E.g., App A draws from Huawei APAC, while App B draws from AWS US-East. The configuration structure should migrate to:
  ```yaml
  providers:
    - name: my-aws
      type: aws
      config:
        region: us-east-1
    - name: my-azure
      type: azure
      config:
        vault_url: "https://my.vault..."
  ```
