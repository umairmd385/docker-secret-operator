# DSO Examples

This directory contains standalone end-to-end examples highlighting the capabilities of the **Docker Secret Operator (DSO)** across different cloud environments.

## Running an Example
Navigate into any example directory and run the stack using the `docker dso` plugin.

```bash
cd aws-compose

# Native plugin execution: retrieve secrets & boot!
docker dso up -d
```

## Available Scenarios
- **aws-compose**: Demonstrates `inject: env` with an AWS Secrets Manager JSON payload being mapped to an Alpine Node container.
- **azure-compose**: Demonstrates the `inject: file` logic, generating an invisible `tmpfs` volume payload linked to Azure Key Vault inside a Python container.
- **huawei-compose**: Demonstrates standard single-key extraction using Huawei CSMS feeding into a Redis database environment instance.
- **v2-rotation-rolling-restart**: Showcases DSO v2.0.0 features: **Continuous Watcher**, **Best-Effort Rolling Restarts**, and **Dynamic File Overwriting**.
- **docker-swarm**: Highlights the native Docker V2 Secret Driver integration for Swarm clusters.
- **production-compose**: A production-ready blueprint with DSO running as a sidecar container inside the compose stack.
