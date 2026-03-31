# Troubleshooting

## Installation Issues

### `docker: 'dso' is not a docker command`

The plugin binary is not in the correct location.

```bash
# Verify the plugin exists
ls -la ~/.docker/cli-plugins/docker-dso

# If missing, reinstall
curl -fsSL https://raw.githubusercontent.com/umairmd385/docker-secret-operator/main/install.sh | sudo bash

# Verify Docker recognizes it
docker plugin ls   # (This shows moby plugins, not CLI plugins)
docker dso --help  # Should show DSO commands
```

### `Error: No docker-compose.yml found`

DSO couldn't find a Compose file in the current directory.

```bash
# Make sure you're in the right directory
ls docker-compose.yml docker-compose.yaml

# Or specify explicitly
docker dso up -f /path/to/docker-compose.yml -d
```

---

## Authentication Failures

### AWS: `NoCredentialProviders: no valid providers`

DSO can't find AWS credentials.

```bash
# Check if credentials are configured
aws sts get-caller-identity

# If using an EC2 instance, verify the instance profile is attached
aws sts get-caller-identity --no-sign-request
# Should return the instance role ARN

# If using environment variables, confirm they're set
echo $AWS_ACCESS_KEY_ID
echo $AWS_DEFAULT_REGION
```

Required IAM permission:
```json
{
  "Effect": "Allow",
  "Action": ["secretsmanager:GetSecretValue"],
  "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:myapp/*"
}
```

### Azure: `Authentication failed / 401 Unauthorized`

```bash
# Check your Azure login
az account show

# Verify the Managed Identity can access the vault
az keyvault secret show \
  --vault-name my-keyvault \
  --name MYSQL-ROOT-PASSWORD

# List all secrets to verify names
az keyvault secret list --vault-name my-keyvault --query "[].name" -o table
```

**Common mistake**: Azure secret names cannot contain underscores. Use hyphens (`MYSQL-ROOT-PASSWORD`, not `MYSQL_ROOT_PASSWORD`).

### HashiCorp Vault: `403 permission denied`

```bash
# Test vault connectivity
vault status

# Test your token has the right policy
vault token lookup

# Test the specific path
vault kv get secret/myapp/db
```

---

## Secret Injection Issues

### Container starts but env vars are empty

1. **Check the mapping key**: For AWS, verify the JSON field names match your `mappings`:
   ```bash
   aws secretsmanager get-secret-value --secret-id myapp/db \
     --query SecretString --output text
   # Output: {"DB_PASSWORD":"secret","DB_USER":"myapp"}
   # Keys must match the left side of mappings:
   #   DB_PASSWORD: DB_PASSWORD  ← left side must match JSON key
   ```

2. **For Azure**: The mapping key must always be `value`:
   ```yaml
   mappings:
     value: DB_PASSWORD   # Azure strings wrap as {"value": "..."}
   ```

3. **Verify the secret name**: Use `docker dso fetch`:
   ```bash
   docker dso fetch myapp/db
   ```

### Secret keys visible via `docker exec env` but wrong value

The container received the mapping key name, not the value. This usually means your provider secret stores a different field name than what you mapped.

```bash
# Debug: check what the provider actually returns
docker dso fetch myapp/db
# The keys shown are what's available for mapping
```

---

## Rotation Issues

### Rotation not triggering

Ensure `rotation: true` is set on the secret in `dso.yaml`:
```yaml
secrets:
  - name: myapp/db
    inject: env
    rotation: true   # ← this must be true
```

### Rolling rotation fails — containers restart instead

Check the Strategy Engine score by running `docker dso watch` while a rotation occurs. If the score is below 70, DSO falls back to restart.

Common causes:
- **Fixed host port** (`80:80` in compose file) → score -50
- **No healthcheck** defined → score -10  
- **Stateful workload** (MySQL/Postgres image or `/var/lib/` mount) → score -20

Fix: Add a health check and remove fixed ports for services that need rolling rotation.

### `health_check_timeout` exceeded

The new container didn't pass its health check in time. Options:
1. Increase `health_check_timeout` in `dso.yaml`
2. Fix the health check endpoint in your app
3. Increase `start_period` in your Compose file's `healthcheck`

---

## Performance Issues

### Slow secret fetches at startup

Enable caching:
```yaml
agent:
  cache: true
  refresh_interval: 5m
```

Secret values are fetched once on first use, then served from memory for subsequent requests.

### Provider rate limits

If you see `429 Too Many Requests` from AWS/Azure, increase your polling interval:
```yaml
agent:
  watch:
    polling_interval: 15m   # increase from 5m to 15m
```

---

## Getting Help

If you're stuck after trying the above:

1. Enable debug logging: `DSO_LOG_LEVEL=debug docker dso up -d`
2. Capture the output: `docker dso up -d 2>&1 | tee dso-debug.log`
3. Open an issue with the log: [GitHub Issues](https://github.com/umairmd385/docker-secret-operator/issues)

Include:
- `docker dso --version` output
- Your `dso.yaml` (with secrets/ARNs redacted)
- The full error message
