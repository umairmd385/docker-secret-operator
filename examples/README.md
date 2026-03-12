# DSO Examples

This directory contains standalone end-to-end examples highlighting the capabilities of the **Docker Secret Operator (DSO)** across different cloud environments.

## Running an Example
Navigate into any example directory and run the stack using the `dso` wrapper.

```bash
cd aws-docker-compose

# Intercept compose up, retrieve secrets, and inject!
dso compose up -d
```

## Available Scenarios
- **aws-compose**: Demonstrates `inject: env` with an AWS Secrets Manager JSON payload being mapped to an Alpine Node container.
- **azure-compose**: Demonstrates the `inject: file` logic, generating an invisible `tmpfs` volume payload linked to Azure Key Vault inside a Python container.
- **huawei-compose**: Demonstrates standard single-key extraction using Huawei CSMS feeding into a Redis database environment instance.
