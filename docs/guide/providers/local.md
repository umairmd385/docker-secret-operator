# Local Files Provider

The local file provider lets you load secrets from a JSON file on disk. This is intended **only for local development and CI testing** — never use it in production.

## Why Use This?

- Test your DSO configuration without needing cloud credentials
- Run integration tests in CI without AWS/Azure accounts
- Onboard new team members who don't have cloud access yet

## Configure

```yaml
provider: local

config:
  path: /etc/dso/secrets.json    # Path to the JSON secrets file

agent:
  cache: true

secrets:
  - name: myapp/db
    inject: env
    mappings:
      DB_PASSWORD: DB_PASSWORD
      DB_USER: DB_USER
```

## Create the Secrets File

```json
{
  "myapp/db": {
    "DB_PASSWORD": "dev-password-123",
    "DB_USER": "devuser"
  },
  "myapp/api": {
    "API_KEY": "dev-api-key-abc"
  }
}
```

> [!WARNING]
> The local file provider reads secrets from disk in plaintext. It exists solely for development convenience. In production, always use a cloud-backed provider (AWS, Azure, Vault).

## Usage

```bash
# Create your local secrets file
mkdir -p /etc/dso
cat > /etc/dso/secrets.json << 'EOF'
{
  "myapp/db": {
    "DB_PASSWORD": "dev-password-123",
    "DB_USER": "devuser"
  }
}
EOF

# Use local provider in dso.yaml
cp dso.local.yaml /etc/dso/dso.yaml

# Start your stack normally
docker dso up -d
```

## Switching Between Environments

Keep separate config files per environment:

```
/etc/dso/
  dso.dev.yaml     ← provider: local
  dso.staging.yaml ← provider: aws (staging account)
  dso.prod.yaml    ← provider: aws (production account)
```

```bash
# Development
docker dso up --config /etc/dso/dso.dev.yaml -d

# Staging
docker dso up --config /etc/dso/dso.staging.yaml -d
```
