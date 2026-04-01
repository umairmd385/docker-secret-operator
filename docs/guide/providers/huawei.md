# Huawei Cloud CSMS

For teams running on Huawei Cloud using Cloud Secret Management Service (CSMS).

## Configuration

```yaml
# dso.yaml - Huawei Provider
provider: huawei
config:
  region: cn-north-4
  # Use IAM credentials or environment variables

secrets:
  - name: my-cloud-secret
    inject: env
    rotation: true
    mappings:
      API_KEY: secret-value
      API_SECRET: secret-value
```

## Prerequisites
- A Huawei Cloud account with CSMS enabled
- Secret already created in your target region
- A ECS Agency or IAM account with appropriate permissions

## Authentication

Huawei Cloud uses ECS Agency by default if running on an ECS instance. Alternatively, set credentials via environment variables:

```bash
export HUAWEI_ACCESS_KEY_ID=...
export HUAWEI_SECRET_ACCESS_KEY=...
```
