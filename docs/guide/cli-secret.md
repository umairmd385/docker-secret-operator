# CLI: Secret

The `secret` command allows you to manage secrets within your **Local Mode** vault.

## Subcommands

### 1. `secret set`
Adds or updates a secret in the local vault.

#### Usage
```bash
docker dso secret set <KEY> <VALUE>
```

#### Example
```bash
docker dso secret set DB_PASSWORD my-super-secret-pass
```

---

### 2. `secret get`
Retrieves a secret value (masked by default).

#### Usage
```bash
docker dso secret get <KEY>
```

#### Flags
| Flag | Description |
| :--- | :--- |
| `--reveal` | Show the plaintext value |

---

### 3. `secret list`
Lists all keys currently stored in the vault.

#### Usage
```bash
docker dso secret list
```

---

### 4. `secret rm`
Removes a secret from the vault.

#### Usage
```bash
docker dso secret rm <KEY>
```

---

### 5. `env import`
Bulk-import secrets from a `.env` file into the vault.

#### Usage
```bash
docker dso env import <file> [project]
```

#### Description
Parses a standard `.env` file (KEY=VALUE format) and imports all secrets into the vault under a specified project namespace.

#### Examples
```bash
# Import into default project
docker dso env import .env.local

# Import into specific project
docker dso env import .env.prod myapp
```

#### Input Format
```env
# Comments are ignored
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=mysecretpass
API_KEY=sk-1234567890abcdef
```

#### Output
```
[INFO] Importing secrets from .env.local...
[OK] Successfully imported 4 secrets

Imported secrets:
  ✓ db_host
  ✓ db_user
  ✓ db_password
  ✓ api_key

Project: default
Total secrets: 15 (4 new)
```

👉 **Learn more**: [CLI: Management](/guide/cli-management#env-import)
