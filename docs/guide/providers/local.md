# Native Vault (Local Mode)

DSO v3.2 introduces the **Native Vault**, a built-in, AES-256-GCM encrypted store that allows you to manage secrets locally without any cloud dependencies or internet connection.

## Why Use This?

- **Zero Dependency**: Run DSO in air-gapped environments or local dev without cloud accounts.
- **Fast**: Local encryption/decryption with near-zero latency.
- **Secure**: Secrets are encrypted on disk at `~/.dso/vault.enc` and only decrypted in-memory.

---

## 1. Initialize the Vault

Before using Local Mode, you must initialize your vault. This creates the encrypted storage and your local master key.

```bash
docker dso init
```

---

## 2. Managing Secrets

Use the `secret` command namespace to add, get, or list secrets in your local vault.

```bash
# Add a secret
docker dso secret set DB_PASSWORD my-super-secret-pass

# List keys
docker dso secret list

# Get value (revealed)
docker dso secret get DB_PASSWORD --reveal
```

---

## 3. Configuration (`dso.yaml`)

To inject secrets from the local vault, you don't need to specify a `provider`. DSO defaults to **Local Mode** if no cloud provider is active.

```yaml
# dso.yaml
secrets:
  - name: DB_PASSWORD
    inject: env
```

---

## 4. Run the Stack

Start your Docker Compose stack normally. DSO will automatically unlock your local vault and inject the mapped secrets.

```bash
docker dso up -d
```

---

## Comparison: Local Vault vs. Cloud Providers

| Feature | Native Vault | Cloud Providers (AWS/Azure/Vault) |
| :--- | :--- | :--- |
| **Connectivity** | Offline-only | Requires Internet/IAM |
| **Trust Source** | Your machine (`~/.dso`) | Enterprise Secret Manager |
| **Target Use** | Development / Edge | Production / Scaling Stacks |
| **Setup** | `dso init` | `dso system setup` |
