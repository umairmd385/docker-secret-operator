# CLI Reference

All DSO commands are exposed as subcommands of the native Docker CLI via `docker dso`.

## Commands

### `docker dso up`
Start all services defined in `docker-compose.yml` with secrets injected.

```bash
docker dso up -d
```

| Flag | Default | Description |
|------|---------|-------------|
| `-d` | `false` | Run in detached (background) mode |
| `-f` | `dso.yaml` | Path to the DSO config file |
| `--env-file` | `.env` | Override environment file |

---

### `docker dso down`
Stop services and securely purge all in-memory secret data.

```bash
docker dso down
```

---

### `docker dso compose`
Run any Docker Compose subcommand with DSO secret injection.

```bash
docker dso compose up -d
docker dso compose logs -f
docker dso compose ps
```

---

### `docker dso rotate`
Force an immediate secret re-fetch and re-injection without restarting containers.

```bash
docker dso rotate
```

---

### `docker dso status`
Show the current status of the DSO agent and active secret leases.

```bash
docker dso status
```

---

### `docker dso version`
Print the installed DSO plugin version.

```bash
docker dso version
```
