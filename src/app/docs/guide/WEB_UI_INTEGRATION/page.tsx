import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";

const content = `# DSO Web Dashboard Integration (Phase 1.5)

**Status:** Production-Ready  
**Date:** June 3, 2026  
**Visibility:** Built-in, embedded in DSO binary  

---

## Overview

The DSO Web Dashboard is a production-ready web-based interface for monitoring and managing the DSO agent. It is fully embedded in the DSO binary with no runtime dependencies.

### Key Features

- **Responsive Dashboard** - Real-time agent status, secrets overview, and event streams
- **Secret Management** - View configured secrets, providers, status, and rotation history
- **Real-time Events** - Live WebSocket stream of rotation events and system activities
- **Audit Logging** - Searchable audit log with CSV export
- **Zero Runtime Dependencies** - No Node.js required; embedded static assets
- **Reverse Proxy** - Automatic proxying to DSO REST API on :8471
- **Configurable Port** - Default :8472, fully customizable
- **Built-in WebSocket Support** - Real-time event streaming with automatic reconnection

---

## Architecture

### Component Structure

\`\`\`
DSO Binary
├── dso ui command (CLI)
│   └── internal/webui/server.go
│       ├── Embedded UI assets (Next.js static export)
│       ├── HTTP server on :8472
│       ├── Reverse proxy to API on :8471
│       └── WebSocket proxy for /api/events/ws
└── REST API on :8471
    └── /health, /api/secrets, /api/events/ws, /api/logs
\`\`\`

### How It Works

#### 1. **Static Asset Embedding**

The Next.js application is built to static HTML/CSS/JS using \`output: 'export'\` in the build configuration. These assets are embedded in the Go binary using the \`go:embed\` directive:

\`\`\`go
//go:embed out/*
var Assets embed.FS
\`\`\`

**Build Process:**
\`\`\`bash
# In web/ directory
npm run build   # Compiles TypeScript
# Next.js automatically exports to out/ (via output: 'export' config)
# Assets are included in the binary at build time
\`\`\`

#### 2. **HTTP Server**

The \`internal/webui/server.go\` creates an HTTP server with three main handlers:

**a) Static File Serving**
- Serves HTML, CSS, JS, and assets from embedded filesystem
- Falls back to index.html for SPA routing (enables /dashboard, /secrets routes)
- Sets appropriate cache headers for static assets

**b) API Reverse Proxy**
- Intercepts requests to \`/api/*\` 
- Forwards them to the DSO REST API on :8471
- Preserves headers, cookies, and request body
- Handles 404 responses appropriately

**c) WebSocket Proxy**
- Upgrades connections on \`/api/events/ws\`
- Establishes a backend WebSocket to the REST API
- Bidirectionally proxies messages
- Handles disconnections and reconnections

#### 3. **Port Configuration**

\`\`\`
Dashboard:  :8472 (default, configurable)
API:        :8471 (fixed, used by agent)

Both on same host (127.0.0.1 or 0.0.0.0 depending on binding)
\`\`\`

### Request Flow

\`\`\`
Browser (http://127.0.0.1:8472)
    ↓
Webui Server (static files + reverse proxy)
    ├→ GET /dashboard          → index.html fallback
    ├→ GET /api/secrets        → Proxy to API :8471
    ├→ GET /api/events/ws      → WebSocket proxy
    └→ POST /api/secrets/*/rotate → Proxy to API :8471
    ↓
DSO REST API (:8471)
    └→ Delegates to agent
\`\`\`

---

## Building the Dashboard

### Prerequisites

Node.js 18+ (for build only, not required at runtime)

### Build Steps

\`\`\`bash
cd /path/to/dso/web

# Install dependencies
npm install

# Build (TypeScript compilation + Next.js static export)
npm run build

# Output: out/ directory with static assets
ls -la out/
# dashboard.html, secrets.html, events.html, etc.
# _next/static/ (bundled JS/CSS)
\`\`\`

### Output Structure

\`\`\`
out/
├── dashboard.html        (15 KB)
├── secrets.html          (13 KB)
├── events.html           (13 KB)
├── audit.html            (13 KB)
├── settings.html         (14 KB)
├── index.html            (5 KB)
├── 404.html              (14 KB)
└── _next/
    └── static/
        ├── chunks/       (React runtime + app JS)
        └── media/        (Icons, fonts)

Total: ~1.2 MB
\`\`\`

---

## CLI Usage

### Starting the Dashboard

\`\`\`bash
# Default: port 8472
dso ui

# Custom port
dso ui --port 3000

# Use different API server
dso ui --api http://192.168.1.10:8471

# Open browser automatically (if available)
dso ui --open-browser
\`\`\`

### Output

\`\`\`
🚀 Dashboard starting on http://127.0.0.1:8472/dashboard
📊 API server: http://127.0.0.1:8471
Press Ctrl+C to stop
\`\`\`

### Access

Open browser and navigate to: http://127.0.0.1:8472/dashboard

---

## API Integration

### Endpoints Used

The dashboard proxies these API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| \`/health\` | GET | Agent status (UP/DOWN, version, uptime) |
| \`/api/secrets\` | GET | List configured secrets |
| \`/api/secrets/:name\` | GET | Get secret details |
| \`/api/secrets/:name/rotate\` | POST | Trigger manual rotation |
| \`/api/events\` | GET | Event history |
| \`/api/events/ws\` | WS | Real-time event stream |
| \`/api/logs\` | GET | Audit logs |

### Request Headers

The webui proxy adds these headers to preserve origin information:

\`\`\`
X-Forwarded-For:   <client IP>
X-Forwarded-Proto: <http|https>
\`\`\`

### Authentication

If the API requires authentication (DSO_AUTH_TOKEN):

1. User provides token via login form (future: Phase 2)
2. Token stored in browser localStorage
3. All API requests include: \`Authorization: Bearer <token>\`
4. On 401 response, user redirected to /login

Currently, token is stored in localStorage for persistence.

---

## Reverse Proxy Details

### Static File Serving

Files are served with appropriate cache headers:

\`\`\`
_next/static/chunks/*  → Cache-Control: public, immutable, max-age=31536000 (1 year)
*.html                 → Cache-Control: public, must-revalidate, max-age=0
*.js, *.css            → Cache-Control: public, max-age=3600 (1 hour)
Other assets           → Cache-Control: public, max-age=86400 (1 day)
\`\`\`

### CORS Handling

The reverse proxy adds CORS headers to all responses:

\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

This allows the frontend to make cross-origin requests to the API.

### WebSocket Proxying

For \`/api/events/ws\`:

1. Client connects to \`ws://127.0.0.1:8472/api/events/ws\`
2. Server upgrades connection
3. Server connects to \`ws://127.0.0.1:8471/api/events/ws\`
4. Messages bidirectionally proxied

The frontend handles reconnection logic with exponential backoff.

---

## File Structure

### Go Packages

\`\`\`
internal/webui/
├── embed.go              # Asset embedding via go:embed
├── server.go             # HTTP server, static serving
├── proxy.go              # Reverse proxy logic
├── server_test.go        # Unit tests
└── README.md             # Package documentation

internal/cli/
├── ui.go                 # \`dso ui\` command
└── root.go               # (Modified to add UI command)
\`\`\`

### Size Impact

\`\`\`
Web assets: ~1.2 MB
Go code:   ~50 KB
Total:     ~1.25 MB (adds ~1% to binary size)
\`\`\`

---

## Configuration

### Environment Variables

None required. Configuration via CLI flags:

\`\`\`bash
dso ui [OPTIONS]

Options:
  --port <int>       Listen port (default: 8472)
  --api <url>        API server address (default: http://127.0.0.1:8471)
  --open-browser     Open dashboard in default browser
  -h, --help         Show help
\`\`\`

### Port Validation

The CLI checks port availability before starting:

\`\`\`
\$ dso ui --port 8080
Port 8080 is already in use
\`\`\`

---

## Security Considerations

### Same-Origin Policy

The dashboard and API run on the same host but different ports (8472 vs 8471).

**CORS Headers:** The proxy adds CORS headers, allowing cross-port requests.

**WebSocket Origin Check:** Server accepts WebSocket connections from any origin (same-host only, enforced by browser).

### HTTPS Support

If running behind HTTPS proxy:

1. Client connects to \`https://host/dashboard\`
2. Dashboard detects protocol and uses \`wss://\` for WebSocket
3. Proxy must handle SSL/TLS termination
4. Add to proxy configuration:
   \`\`\`
   X-Forwarded-Proto: https
   \`\`\`

### Token Storage

Current implementation (Phase 1):
- Token stored in browser localStorage
- No HTTP-only cookies (frontend needs access)
- Token removed on 401 response
- No automatic refresh (stateless)

Future (Phase 2+):
- HTTP-only cookies for token storage
- Automatic token refresh
- CSRF token validation
- Rate limiting on API endpoints

---

## Monitoring & Debugging

### Logs

Dashboard logs to stdout with \`info\` level:

\`\`\`
2026-06-03T20:30:45.123Z  INFO  Starting dashboard server
  addr=:8472
  api_target=http://127.0.0.1:8471
\`\`\`

Enable debug logging:

\`\`\`bash
DSO_LOG_LEVEL=debug dso ui
\`\`\`

### Health Check

Check if dashboard is running:

\`\`\`bash
curl http://127.0.0.1:8472/dashboard
# Returns HTML (200 OK)

curl http://127.0.0.1:8472/api/health
# Returns: {"status":"up"}
\`\`\`

### Network Troubleshooting

\`\`\`bash
# Check if ports are in use
lsof -i :8472
lsof -i :8471

# Test API connectivity from dashboard host
curl http://127.0.0.1:8471/health

# Test WebSocket
wscat -c ws://127.0.0.1:8471/api/events/ws
\`\`\`

---

## Graceful Shutdown

The dashboard server handles SIGTERM and SIGINT:

\`\`\`bash
dso ui
# Press Ctrl+C (or send SIGTERM)

⏹️  Shutting down dashboard...
✅ Dashboard stopped
\`\`\`

Graceful shutdown:
1. Stops accepting new connections
2. Waits up to 5 seconds for existing connections to close
3. Closes all WebSocket connections
4. Exits

---

## Testing

### Unit Tests

\`\`\`bash
cd dso
go test ./internal/webui -v
\`\`\`

Tests cover:
- Server creation and configuration
- Static file serving
- Reverse proxy functionality
- Cache header setting
- Port availability checking
- Client IP extraction
- Content type detection

### Integration Testing

\`\`\`bash
# Terminal 1: Start API (with agent running)
dso up

# Terminal 2: Start dashboard
dso ui

# Terminal 3: Test endpoints
curl http://127.0.0.1:8472/dashboard
curl http://127.0.0.1:8472/api/secrets
wscat -c ws://127.0.0.1:8472/api/events/ws
\`\`\`

---

## Deployment

### Docker

\`\`\`dockerfile
FROM golang:1.23 as builder
WORKDIR /app
COPY . .

# Build Next.js assets first
WORKDIR /app/web
RUN npm install && npm run build

# Build Go binary
WORKDIR /app
RUN go build -o dso ./cmd/dso

FROM alpine:latest
COPY --from=builder /app/dso /usr/local/bin/dso
EXPOSE 8471 8472
CMD ["dso", "up"]
\`\`\`

### Kubernetes

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: dso-agent
spec:
  containers:
  - name: dso
    image: dso:latest
    ports:
    - containerPort: 8471  # REST API
    - containerPort: 8472  # Dashboard
    env:
    - name: DSO_LOG_LEVEL
      value: "info"
    - name: DSO_BIND_ADDR
      value: "0.0.0.0:8471"
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "512Mi"
        cpu: "500m"
\`\`\`

---

## Troubleshooting

### Dashboard Won't Start

**Error: "Port 8472 is already in use"**
\`\`\`bash
# Find process using port
lsof -i :8472

# Use different port
dso ui --port 3000
\`\`\`

**Error: "Failed to connect to API"**
\`\`\`bash
# Check API is running
curl http://127.0.0.1:8471/health

# Specify correct API address
dso ui --api http://192.168.1.10:8471
\`\`\`

### API Calls Failing

**404 errors from /api/ endpoints**
- Verify agent is running with \`dso status\`
- Check API is actually listening: \`netstat -tlnp | grep 8471\`
- Ensure proxy is forwarding: check logs with \`DSO_LOG_LEVEL=debug dso ui\`

**401 Unauthorized**
- Set authentication token if required: \`export DSO_AUTH_TOKEN=<token>\`
- Verify token is valid: \`curl -H "Authorization: Bearer <token>" http://127.0.0.1:8471/api/secrets\`

### WebSocket Connection Issues

**"Connecting..." message persists**
- Check network connectivity: \`curl http://127.0.0.1:8471/api/events/ws\` (should fail gracefully)
- Check browser console for errors (DevTools → Console)
- Verify API is actually sending events

### Performance

**Dashboard slow to load**
- Check network latency: \`ping 127.0.0.1\`
- Profile API responses: \`curl -w "Time: %{time_total}s\n" http://127.0.0.1:8471/api/secrets\`
- Check browser DevTools → Network tab for slow requests

---

## Future Enhancements (Phase 2+)

### Short-term (Phase 2)

- [ ] Manual secret rotation trigger
- [ ] Error boundaries for crash handling
- [ ] Mobile responsive design
- [ ] Unit tests (Jest)
- [ ] Component tests (React Testing Library)
- [ ] Charts and analytics (rotation history, success rates)
- [ ] Settings UI (theme, refresh intervals)
- [ ] Dark mode support

### Medium-term (Phase 3)

- [ ] User authentication (login page)
- [ ] Role-based access control
- [ ] Audit trail filtering and export
- [ ] Secret search and advanced filtering
- [ ] Provider latency metrics
- [ ] Integration with external dashboards

### Long-term (Phase 4+)

- [ ] Multi-agent dashboard
- [ ] Distributed tracing
- [ ] Custom dashboards/widgets
- [ ] API rate limiting
- [ ] Webhook management UI
- [ ] Advanced scheduling for rotations

---

## Architecture Decisions

### Why Embedded Static Assets?

- **No runtime dependencies:** No Node.js needed to run DSO
- **Single binary:** Dashboard included in distributed binary
- **Fast startup:** No npm install, no build step on deployment
- **Security:** No external CDNs or downloads
- **Versioning:** Dashboard versioned with agent

### Why Reverse Proxy?

- **Simplicity:** No API design changes needed
- **Security:** Dashboard and API on same host, easier to secure
- **Flexibility:** Can move API to different port without dashboard changes
- **Debugging:** Can inspect proxied requests in logs

### Why WebSocket?

- **Real-time:** Events stream to dashboard instantly
- **Efficiency:** No polling, minimal bandwidth
- **Browser support:** Native WebSocket API in all modern browsers
- **Fallback:** Can degrade to polling if WebSocket fails

---

## References

- **Next.js 14 Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Go embed Package:** https://pkg.go.dev/embed
- **HTTP Reverse Proxy:** https://pkg.go.dev/net/http/httputil
- **WebSocket Protocol:** https://tools.ietf.org/html/rfc6455
- **Gorilla WebSocket:** https://github.com/gorilla/websocket

---

## Support

For issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review [logs with debug enabled](#monitoring--debugging)
3. Check DSO GitHub issues
4. Review DSO documentation

---

**Document Version:** 1.0  
**Last Updated:** June 3, 2026  
**Maintained By:** DSO Team
`;

export const metadata: Metadata = {
  title: "DSO Web Dashboard Integration (Phase 1.5)",
  description: "Documentation for DSO Web Dashboard Integration (Phase 1.5)",
};

export default function Page() {
  return <MarkdownRenderer content={content} />;
}
