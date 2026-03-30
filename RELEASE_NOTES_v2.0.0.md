# 🔹 Release Notes v2.0.0

## Event-Driven Triggers and Rolling Restarts

DSO **v2.0.0** introduces sweeping structural changes bridging the gap between static injection and real runtime responsiveness. 

### ✨ Features
- **Trigger Engine**: We've replaced basic polling with a comprehensive **Hybrid Event-Driven Engine**. You can now trigger secret rotation proactively using standard webhooks (`POST /api/events/secret-update`) without depending entirely on API quotas.
- **Rolling Restarts**: When environment secrets modify dynamically, DSO no longer ignores the change. The new Best-Effort Rolling Restart framework tracks connected containers, duplicates topology under the hood, runs the new configuration, waits for valid Docker health checks, and elegantly replaces the live containers seamlessly with zero downtime!
- **Real-Time Websocket Logging**: Connect natively to `ws://localhost:8080/api/events/ws` to scrape internal update boundaries instantly.
- **File Injection over tmpfs overlays**: You can now define `inject: file`. In this mode, secrets bypass environments entirely and overlay temporary RAM-backed volumes directly inside container boundaries instantly without container restarts.

### 🛠 Improvements
- Optimized API structures with tighter error handling natively inside all provider plugins.
- Dramatically improved config parsing with better defaults safely integrated.
- Removed legacy unauthenticated bounds.
