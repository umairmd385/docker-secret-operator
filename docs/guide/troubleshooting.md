# Troubleshooting

## Plugin not found after install

```bash
# Verify the plugin is installed and enabled
docker plugin ls
```

If the plugin shows `false` under ENABLED, run:

```bash
docker plugin enable dso
```

---

## Secrets not injecting (empty env vars)

1. Check your `dso.yaml` secret `name` matches the exact path/name in your provider.
2. Verify your credentials are set correctly (check `AWS_ACCESS_KEY_ID`, etc.).
3. Run `docker dso status` to see if the DSO agent is active and connected.

---

## Permission denied errors

Ensure the IAM role / service principal has the correct `read` / `GetSecretValue` permissions for your specific secret ARN or Key Vault.

> [!TIP]
> Run with `DSO_LOG_LEVEL=debug` to see the full request/response cycle:
> ```bash
> DSO_LOG_LEVEL=debug docker dso up -d
> ```

---

## Container starts before secrets are ready

Add a `depends_on` healthcheck in your `docker-compose.yml` or use DSO's built-in `--wait` flag:

```bash
docker dso up --wait -d
```

---

## Still stuck?

Open an issue on [GitHub](https://github.com/umairmd385/docker-secret-operator/issues) with the output of:

```bash
docker dso version
docker dso status
```
