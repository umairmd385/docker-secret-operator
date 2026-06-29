import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Web Dashboard - Quick Start

## The Simplest Way

\`\`\`bash
dso ui
\`\`\`

That's it. Dashboard starts on \`http://127.0.0.1:8472/dashboard\`

## Common Scenarios

### Scenario 1: Default Setup

\`\`\`bash
# Terminal 1: Start agent
dso up

# Terminal 2: Start dashboard
dso ui

# Terminal 3: Open browser
curl http://127.0.0.1:8472/dashboard
\`\`\`

**Output:**
\`\`\`
🚀 Dashboard starting on http://127.0.0.1:8472/dashboard
📊 API server: http://127.0.0.1:8471
Press Ctrl+C to stop
\`\`\`

### Scenario 2: Custom Port

\`\`\`bash
dso ui --port 3000
# Dashboard on http://127.0.0.1:3000/dashboard
\`\`\`

### Scenario 3: Different API Server

\`\`\`bash
dso ui --api http://192.168.1.10:8471
# Connects to API on different host
\`\`\`

### Scenario 4: Multiple Dashboards

\`\`\`bash
# Terminal 1
dso ui --port 8472  # Dashboard on :8472

# Terminal 2
dso ui --port 3000  # Dashboard on :3000
\`\`\`

Both dashboards can connect to same API.

## Features

### Dashboard Tabs

- **Dashboard** - Status overview, secrets count, events
- **Secrets** - Secrets table with status and last rotation
- **Events** - Real-time event stream (WebSocket)
- **Audit Log** - Activity history with CSV export
- **Settings** - Configuration (coming soon)

### Real-time Updates

- Agent status updates every 5 seconds
- Events stream in real-time via WebSocket
- Automatic reconnection if connection drops

### API Integration

Automatically proxies all API calls:
- \`/api/secrets\` - List and query secrets
- \`/api/events\` - Event history
- \`/api/events/ws\` - Real-time WebSocket stream
- \`/api/logs\` - Audit logs
- \`/api/health\` - Agent health status

## Stop the Dashboard

Press \`Ctrl+C\` in the terminal where \`dso ui\` is running

\`\`\`
⏹️  Shutting down dashboard...
✅ Dashboard stopped
\`\`\`

## Troubleshooting

### "Port already in use"

\`\`\`bash
dso ui --port 3000
\`\`\`

### "API not responding"

Check agent is running:
\`\`\`bash
curl http://127.0.0.1:8471/health
# Should return: {"status":"up"}
\`\`\`

If agent not running:
\`\`\`bash
dso up
\`\`\`

### "Dashboard shows blank page"

Check browser console (F12 → Console tab) for errors

Verify API is responding:
\`\`\`bash
curl http://127.0.0.1:8471/api/secrets
\`\`\`

### "Events not updating"

WebSocket may be blocked. Try:
\`\`\`bash
wscat -c ws://127.0.0.1:8471/api/events/ws
\`\`\`

If this fails, check network proxy/firewall.

## Deployment

### Docker

\`\`\`bash
# Build
docker build -t dso:latest .

# Run
docker run -p 8471:8471 -p 8472:8472 dso:latest
# Agent API on :8471
# Dashboard on :8472
\`\`\`

### Kubernetes

\`\`\`yaml
containers:
- name: dso
  image: dso:latest
  ports:
  - containerPort: 8471  # API
  - containerPort: 8472  # Dashboard
  command: ["sh", "-c", "dso up & dso ui &"]
\`\`\`

### Docker Compose

\`\`\`yaml
services:
  dso:
    image: dso:latest
    ports:
      - "8471:8471"  # API
      - "8472:8472"  # Dashboard
    command: sh -c "dso up & dso ui &"
\`\`\`

## Advanced Options

\`\`\`bash
dso ui --help
\`\`\`

Shows all available options:
\`\`\`
--port <int>      Listen port (default: 8472)
--api <url>        API server (default: http://127.0.0.1:8471)
--open-browser    Try to open in browser
\`\`\`

## CLI Integration with \`dso up\`

Coming in Phase 2: Automatically start dashboard when agent starts

\`\`\`bash
dso up --with-dashboard       # Future: start dashboard automatically
\`\`\`

## Performance

- Dashboard loads in <1 second
- API requests: <5ms latency
- WebSocket events: Real-time (<1ms latency)
- Memory: ~10MB
- CPU: <1% idle

## Next Steps

- **Monitor secrets** - Check rotation status in Secrets tab
- **Watch events** - Real-time updates in Events tab
- **Export logs** - Download audit trail as CSV
- **Phase 2** - Manual rotation, charts, advanced settings

## Help

For detailed documentation, see:
- \`docs/WEB_UI_INTEGRATION.md\` - Complete integration guide
- \`internal/webui/README.md\` - Technical documentation

---

**Version:** 1.0  
**Date:** June 3, 2026
`;

export const metadata: Metadata = {
  title: "DSO Web Dashboard - Quick Start",
  description: "Documentation for DSO Web Dashboard - Quick Start",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
