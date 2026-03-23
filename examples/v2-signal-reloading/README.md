# Zero-Downtime Signal Reloading (SIGHUP)

This example demonstrates how to use DSO's `signal` strategy to achieve **Zero-Downtime** secret rotation. 

Instead of rebuilding or restarting the Docker container (which drops traffic), DSO uses the Docker Engine API to send a `SIGHUP` signal to your container whenever a secret file is modified on disk. Your application catches this signal and re-reads the configuration file directly from the `.file` tmpfs mount!

## Prerequisites

1. DSO must be running and connected to your cloud provider.
2. The secrets must be injected via `inject: file` in your `dso.yaml`.

## The Setup

Notice in `docker-compose.yml` that we use two explicit Docker labels:
```yaml
labels:
  - "dso.reloader=true"
  - "dso.update.strategy=signal"
```

When DSO rotates the file payload, it runs a filter against the local Docker Daemon to find matching containers and natively executes a `ContainerKill(SIGHUP)` exactly targeting the workload without any interruptions.

## Application Code

Look at the provided examples to see how to capture this exact kernel signal!
- `main.go` -> Native Go `os/signal` watcher
- `python_example.py` -> Native Python `signal` watcher
