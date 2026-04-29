# CLI Reference

DSO is implemented as a native Docker CLI plugin. All interactions are performed via the `docker dso` command space.

---

## Command: `init`
Initializes a local, AES-256-GCM encrypted vault.

```bash
docker dso init
```

**Mechanics:**
- Creates `~/.dso/vault.enc`.
- Generates a local master key (not stored in plaintext).
- **Mode**: Sets the local environment to **Local Mode**.

---

## Command: `secret`
Manages secrets within the local vault.

```bash
docker dso secret set DB_PASSWORD mysecret
docker dso secret get DB_PASSWORD --reveal
docker dso secret list
```

---

## Command: `system`
Manages the DSO system state and plugins.

### `system setup`
Installs the cloud-mode agent and downloads verified provider plugins.

```bash
# Selective install
docker dso system setup --providers aws,vault
```

### `system doctor`
Performs a comprehensive diagnostic check of the DSO environment.

```bash
docker dso system doctor
```

---

## Command: `up`
Synchronizes secrets and initializes a Docker Compose stack.

```bash
docker dso up -d
```

**Mechanics:**
1.  **Detection**: Automatically detects if it should run in **Local** or **Cloud** mode.
2.  **Resolution**: Fetches secrets from the local vault or the configured cloud provider.
3.  **Injection**: Streams secrets directly into memory-backed filesystems (`tmpfs`).

---

## Next Steps
- **[System Architecture](/guide/architecture)**: Learn how the Dual-Mode engine works.
- **[Installation](/guide/installation)**: How to set up DSO for your platform.
- **[Configuration Reference](/guide/configuration)**: Detailed `dso.yaml` schema.
