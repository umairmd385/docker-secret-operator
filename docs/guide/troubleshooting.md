# Troubleshooting Guide

When errors happen, DSO is designed to fail securely rather than mask problems. This guide covers the most common issues and how to resolve them.

## Common Issues

### 1. Installation Failures

**Symptom:** `docker plugin install` hangs or returns `permission denied`.

**Resolution:**
- Ensure the Docker daemon is running (`systemctl status docker`).
- The installation must be executed by a user in the `docker` group, or via `sudo`.
- For the alternative shell-script install, ensure `curl` is installed and you are executing it with `sudo bash`.

---

### 2. Provider Authentication Errors

**Symptom:** You see errors like `failed fetching secret from aws: AccessDeniedException`.

**Resolution:**
The DSO provider cannot authenticate with your cloud provider.
- **AWS:** Verify the instance profile has `secretsmanager:GetSecretValue` permissions for the specific secret ARN.
- **Vault:** Check if the passed `vault_token` in `dso.yaml` has expired or lacks the correct policy.
- **Azure:** Ensure the Managed Identity attached to the VM has "Key Vault Secrets User" permissions.

Diagnostic command:
```bash
# Test connectivity manually
docker dso test --provider aws
```

---

### 3. Secret Not Found

**Symptom:** `vault secret myapp/db not found` or similar.

**Resolution:**
The authentication succeeded, but the secret name or path is incorrect.
- Ensure the spelling matches exactly.
- **Azure:** Key Vault paths use hyphens (`-`), not underscores (`_`).
- **Vault:** Ensure you are querying the correct mount path. KV v2 engines require `data/` in API calls (handled automatically if the mount path is correct).

---

### 4. Container Fails to Start

**Symptom:** Container exits immediately with `Missing required environment variable DB_PASSWORD`.

**Resolution:**
- Verify your `docker-compose.yml`. Did you set `DB_PASSWORD=` instead of just declaring `- DB_PASSWORD`? Setting an empty value overrides DSO's injection.
- Run `docker dso inspect <container-id>` to see if DSO injected the expected values. 

---

### 5. Rotation Not Working

**Symptom:** The secret changes in Vault, but the container doesn't get updated.

**Resolution:**
- Ensure `rotation: true` is set for the secret mapping in `dso.yaml`.
- Ensure the `agent.watch.mode` is set correctly. If using polling, check `polling_interval`.
- Look for debouncer messages. If the secret was updated multiple times rapidly, DSO debounces the changes for 30 seconds before acting.
- If using `reload_strategy: signal`, verify the container application actually implements a `SIGHUP` reload routine.

---

### 6. Permission Denied Errors

**Symptom:** Error reading `/var/run/dso.sock`.

**Resolution:**
The CLI plugin cannot communicate with the agent daemon.
Check the DSO daemon status:
```bash
systemctl status dso
journalctl -u dso -f
```
Ensure the socket file exists and is writable by the docker group.

## Diagnostic Commands

DSO includes several built-in commands to help you identify problems.

```bash
# Verify the dso.yaml syntax and configuration schema is valid
docker dso validate

# Inspect exactly what environments are exported to a running container
docker dso inspect <container-id>

# Run a dry-run composed deployment to see what will happen
docker dso up --dry-run
```
