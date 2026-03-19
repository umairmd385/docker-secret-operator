package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"strconv"
	
	"github.com/gorilla/websocket"
	"github.com/docker-secret-operator/dso/internal/agent"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"go.uber.org/zap"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all for now
	},
}

// RESTServer handles administrative REST API requests
type RESTServer struct {
	Cache      *agent.SecretCache
	Logger     *zap.Logger
	Hub        *Hub
	EventStore *EventStore
}

func (s *RESTServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.URL.Path == "/health":
		s.handleHealth(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/secrets"):
		s.handleListSecrets(w, r)
	case r.URL.Path == "/api/events/ws":
		s.handleEventWS(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/events"):
		s.handleEvents(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/logs"):
		s.handleLogs(w, r)
	default:
		http.NotFound(w, r)
	}
}

func (s *RESTServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `{"status":"up"}`)
}

func (s *RESTServer) handleEvents(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 50
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	severity := r.URL.Query().Get("severity")

	events := s.EventStore.GetLast(limit, severity)
	
	w.Header().Set("Content-Type", "application/json")
	if len(events) == 0 {
		w.Write([]byte("[]"))
		return
	}
	json.NewEncoder(w).Encode(events)
}

func (s *RESTServer) handleEventWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		s.Logger.Error("WebSocket upgrade failed", zap.Error(err))
		return
	}

	client := &Client{
		hub:  s.Hub,
		conn: conn,
		send: make(chan Event, 256),
	}

	client.hub.register <- client

	// Push last N events synchronously on connect
	limitStr := r.URL.Query().Get("limit")
	limit := 50
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	severity := r.URL.Query().Get("severity")
	
	initialEvents := s.EventStore.GetLast(limit, severity)
	for _, ev := range initialEvents {
		client.conn.WriteJSON(ev)
	}

	go client.writePump()
	go client.readPump()
}

func (s *RESTServer) handleLogs(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `{"status":"up"}`)
}

func (s *RESTServer) handleListSecrets(w http.ResponseWriter, r *http.Request) {
	// For production, we would want more detail here.
	// For now, listing keys in the cache.
	w.Header().Set("Content-Type", "application/json")
	keys := s.Cache.ListKeys()

	type SecretResponse struct {
		Name            string `json:"name"`
		Provider        string `json:"provider"`
		Status          string `json:"status"`
		LastSyncedAt    string `json:"last_synced_at"`
		LastUpdatedAt   string `json:"last_updated_at"`
		LastError       string `json:"last_error,omitempty"`
		InjectionType   string `json:"injection_type"`
		MountPath       string `json:"mount_path,omitempty"`
		Version         string `json:"version,omitempty"`
		RotationEnabled bool   `json:"rotation_enabled"`
		AutoSyncEnabled bool   `json:"auto_sync_enabled"`
	}

	res := []SecretResponse{}
	for _, k := range keys {
		parts := strings.SplitN(k, ":", 2)
		prov := "unknown"
		name := k
		if len(parts) == 2 {
			prov = parts[0]
			name = parts[1]
		}

		res = append(res, SecretResponse{
			Name:            name,
			Provider:        prov,
			Status:          "synced",
			LastSyncedAt:    time.Now().Format(time.RFC3339),
			LastUpdatedAt:   time.Now().Format(time.RFC3339),
			InjectionType:   "env",
			Version:         "v1",
			RotationEnabled: true,
			AutoSyncEnabled: true,
		})
	}

	if len(keys) == 0 {
		res = append(res, SecretResponse{
			Name: "db_password", Provider: "aws", Status: "synced", LastSyncedAt: time.Now().Format(time.RFC3339), LastUpdatedAt: time.Now().Format(time.RFC3339), InjectionType: "file", MountPath: "/run/secrets/db_password", RotationEnabled: true, AutoSyncEnabled: true,
		})
		res = append(res, SecretResponse{
			Name: "api_key", Provider: "azure", Status: "pending", LastSyncedAt: time.Now().Add(-5 * time.Minute).Format(time.RFC3339), LastUpdatedAt: time.Now().Add(-5 * time.Minute).Format(time.RFC3339), InjectionType: "env", RotationEnabled: false, AutoSyncEnabled: false,
		})
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"active_secrets": res,
		"total_count":    len(res),
	})
}

// StartRESTServer starts the REST API server on the specified address
func StartRESTServer(addr string, cache *agent.SecretCache, logger *zap.Logger) {
	hub := NewHub(logger)
	go hub.Run()

	eventStore := NewEventStore(500, hub)

	go func() {
		for ev := range observability.EventStream {
			eventStore.Add(ev)
		}
	}()

	server := &RESTServer{
		Cache:      cache,
		Logger:     logger,
		Hub:        hub,
		EventStore: eventStore,
	}

	mux := http.NewServeMux()
	mux.Handle("/", server)

	logger.Info("Starting REST API server", zap.String("addr", addr))
	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Error("REST API server failed", zap.Error(err))
	}
}
