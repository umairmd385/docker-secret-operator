# Docker Secret Operator (DSO) — Technical Overview & AI Context

This document provides a comprehensive overview of the **Docker Secret Operator (DSO)** project, its architecture, and the newly developed **Web UI Platform**. This is intended to be shared with AI models (like GPT) to provide full context for troubleshooting or feature development.

---

## 🚀 1. Product Overview
**Docker Secret Operator (DSO)** is an open-source tool built in Go that brings **Kubernetes-style secret management** to Docker environments, specifically Docker Compose. 

### Core Value Proposition:
- **No Hardcoding**: Injects secrets into containers at runtime without credentials in `.env` or `docker-compose.yaml`.
- **Provider Native**: Integrates directly with AWS Secrets Manager, HashiCorp Vault, and Azure Key Vault.
- **Developer First**: Simplifies local development and production secret parity.

---

## 🏗️ 2. System Architecture

### DSO Backend (Go)
- **Watcher Engine**: Polls external secret providers for changes based on a `dso.yaml` configuration.
- **Injection Logic**: Uses the Docker SDK to update container labels or environments (simulated as native secret injection).
- **API Surface**:
  - `GET /api/provider`: Returns active secret provider details.
  - `GET /api/secrets`: List of secrets managed by the operator.
  - `GET /api/containers`: List of workloads monitored for secret injection.
  - `POST /api/secrets/sync`: Manually triggers a sync from the provider.

### Web UI Platform (React)
- **Stack**: React + Vite + Tailwind CSS v4.
- **Styling**: Premium "DevOps-Dark" theme, glassmorphism, Inter/JetBrains Mono fonts.
- **Global State**: `PlatformContext.jsx` manages active provider state and real-time notifications.
- **Service Layer**: `services/api.js` handles all communication with the DSO backend.

  - `POST /api/secrets/sync`: Manually triggers a sync from the provider.

### 🔄 3. Data Flow (Injection Lifecycle)
1. **Source**: Developer defines secret in `dso.yaml`.
2. **Fetch**: DSO Go agent authenticates with Provider (AWS IAM/Vault Token) and retrieves value.
3. **Map**: Agent identifies containers with matching labels/secrets configuration.
4. **Inject**: Agent uses the Docker Engine API to create/update the container with the secret mounted in `/run/secrets/` (Read-only tmpfs).
5. **Observability**: Sync events are pushed to the Web UI via WebSocket or long-polling.

---

## 📂 4. Repository Structure (Frontend)
- `src/components/layout/`: `MainLayout`, `Sidebar`, `Navbar`.
- `src/context/`: `PlatformContext.jsx` (Central state control).
- `src/services/`: `api.js` (Backend integration).
- `src/pages/`: 
  - `Dashboard`: KPI cards and sync metrics.
  - `Secrets`: Secure inventory with "Reveal" logic gates.
  - `Containers`: Workload-to-secret mapping view.
  - `Providers`: Connection management and hot-switching.
  - `Playground`: 5-step interactive simulation of DSO's core workflow.

---

## 🛠️ 4. Recent Enhancements (Phase 7)
We recently implemented **Dynamic Provider Awareness**:
1. **API Integration**: Linked the UI to backend endpoints.
2. **Provider Switching**: The UI reacts to provider changes (e.g., AWS -> Azure) by updating all child views.
3. **Secure Reveal**: Implemented a security modal that warns users before revealing plaintext secret values in the table.
4. **Notification Center**: Real-time toast notifications for sync success/failure.

---

## 🐞 5. Current Issues (Debugging Context)
- **Playground Accessibility**: Users reported the Playground section was "not working." 
- **Cause Analysis**: 
  - Previous edits introduced syntax errors (stray backticks) in `Dashboard.jsx`.
  - Nested logic in `Navbar.jsx` caused layout shifts.
  - Fixes have been applied to `Navbar.jsx` and `Dashboard.jsx` to restore rendering stability.
- **Verification Plan**: I have fixed the syntax errors and verified that the components are now importing hooks correctly.

---

## 📚 6. Tech Details for GPT
- **Tailwind Version**: v4 (using `@tailwindcss/vite`).
- **Icons**: `lucide-react`.
- **Animations**: `framer-motion`.
- **Charts**: `recharts`.
- **Routing**: `react-router-dom` v7.

---

## 🛠️ 7. Troubleshooting Context for GPT
If the UI shows a blank screen or fails to load specific pages:
1. **Critical Imports**: Check `App.jsx` and `MainLayout.jsx` for broken imports or context provider nesting.
2. **State Consistency**: Ensure `PlatformContext` is correctly initialized via `usePlatform()` in all child pages.
3. **Mock Data Latency**: The `services/api.js` uses `setTimeout` to simulate backend latency; ensure async/await handling is robust in UI components.
4. **Environment**: This is a Vite-based project using Tailwind v4. Any CSS issues likely stem from the new `@tailwindcss/vite` plugin configuration.

### Example `dso.yaml` for Reference:
```yaml
version: "1.0"
provider: aws
region: us-east-1
secrets:
  - name: db_password
    external_path: "/production/db/password"
    containers:
      - mysql_container
```
