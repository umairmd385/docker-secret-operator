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
