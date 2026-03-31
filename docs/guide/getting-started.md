# Getting Started

Follow this 3-step guide to secure your first Docker container with DSO.

## 1. Install the DSO Plugin

Download and activate the DSO agent globally across your Docker engine.

```bash:Terminal
$ docker plugin install dso
```

Once installed, check that the plugin is running:

```bash:Terminal
$ docker plugin ls
ID             NAME   DESCRIPTION               ENABLED
987654321abc   dso    Docker Secret Operator    true
```

---

## 2. Configure `dso.yaml`

Create a file named `dso.yaml` in your project root. This file defines where your secrets live and how they should be delivered to your app.

```yaml:dso.yaml
provider: aws  # AWS Secrets Manager
region: us-west-2
secrets:
  - name: my-app-db-password
    inject: env
    as: DB_PASSWORD
  - name: my-app-api-key
    inject: env
    as: API_KEY
```

> [!TIP]
> Each provider (AWS, Azure, Vault, etc.) has its own specific configuration fields. See the [Providers Section](/guide/providers/aws) for more details.

---

## 3. Run with `docker dso`

Launch your Docker Compose stack using the `docker dso up` command. DSO will automatically fetch your secrets and inject them before starting your services.

```bash:Terminal
$ docker dso up -d
```

### ✔️ Verify Secret Injection

Once your container is running, verify that the environment variables are correctly injected:

```bash:Terminal
$ docker exec my-app-container env | grep DB_PASSWORD
DB_PASSWORD=********
```

---

## 🏗️ Clean Up

To stop and remove your containers, use the standard `docker dso down` command. This will also securely purge any secret data from the plugin's memory.

```bash:Terminal
$ docker dso down
```

---

### **🚀 Re-Injection & Hot-Reload**

Want to update your secrets without restarting? DSO supports hot-reload — simply run `docker dso rotate` to force a re-fetch.
