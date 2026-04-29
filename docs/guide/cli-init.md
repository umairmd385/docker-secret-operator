# CLI: Init

The `init` command initializes a local, encrypted vault for DSO. This is the foundation of **Local Mode**.

## Usage

```bash
docker dso init [flags]
```

## Description

Running `init` will:
1. Create the `~/.dso/` directory if it doesn't exist.
2. Prompt for a master password (or use `DSO_MASTER_PASSWORD` env).
3. Generate a new AES-256-GCM encrypted vault file at `~/.dso/vault.enc`.

> [!IMPORTANT]
> Keep your master password safe. If lost, the data in `vault.enc` cannot be recovered.

## Flags

| Flag | Description |
| :--- | :--- |
| `--path` | Custom path for the vault file (default: `~/.dso/vault.enc`) |
| `--force` | Overwrite existing vault file |

## Examples

Initialize with default settings:
```bash
docker dso init
```

Initialize with a specific path:
```bash
docker dso init --path ./my-project.vault
```
