# CLI: System

The `system` command suite manages the DSO environment, including plugin installation and diagnostics. This is primarily used for **Cloud Mode**.

## Subcommands

### 1. `system setup`
Installs or updates DSO providers (plugins) on the host.

#### Usage
```bash
docker dso system setup [flags]
```

#### Flags
| Flag | Description |
| :--- | :--- |
| `--providers` | Comma-separated list of providers to install (e.g., `aws,azure,vault,huawei`) |
| `--all` | Install all available providers |
| `--no-verify` | Skip SHA256 integrity checks (not recommended) |

#### Example
```bash
docker dso system setup --providers aws,azure
```

---

### 2. `system doctor`
Performs a comprehensive diagnostic check of the DSO installation.

#### Usage
```bash
docker dso system doctor
```

#### Checks Performed
- **Binary Integrity**: Verifies the DSO plugin hash.
- **Mode Detection**: Identifies if the system is in Local or Cloud mode.
- **Vault Status**: Checks accessibility of the local vault.
- **Plugin Health**: Verifies connectivity for each installed provider.
- **Systemd Status**: Checks if the DSO agent daemon is running (Cloud Mode).

#### Example
```bash
docker dso system doctor
```
