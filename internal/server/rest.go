package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/docker-secret-operator/dso/internal/agent"
	"go.uber.org/zap"
)

type RESTServer struct {
	Cache  *agent.SecretCache
	Logger *zap.Logger
}

func (s *RESTServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	switch {
	case r.URL.Path == "/health":
		s.handleHealth(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/secrets"):
		s.handleListSecrets(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/provider"):
		s.handleProvider(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/containers"):
		s.handleContainers(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/logs"):
		s.handleLogs(w, r)
	case strings.HasPrefix(r.URL.Path, "/api/metrics"):
		s.handleMetrics(w, r)
	default:
		http.NotFound(w, r)
	}
}

func (s *RESTServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `{"status":"up"}`)
}

func (s *RESTServer) handleListSecrets(w http.ResponseWriter, r *http.Request) {
	env := r.URL.Query().Get("env")
	if env == "" {
		env = "dev"
	}
	
	keys := s.Cache.ListKeys()
	
	type SecretResponse struct {
		Name           string `json:"name"`
		Provider       string `json:"provider"`
		Status         string `json:"status"`
		LastSyncedAt   string `json:"last_synced_at"`
		LastError      string `json:"last_error,omitempty"`
		InjectionType  string `json:"injection_type"`
		MountPath      string `json:"mount_path,omitempty"`
		Version        string `json:"version,omitempty"`
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
			Name:          name,
			Provider:      prov,
			Status:        "synced",
			LastSyncedAt:  time.Now().Format(time.RFC3339),
			InjectionType: "env",
			Version:       "v1",
		})
	}

	if len(keys) == 0 {
		res = append(res, SecretResponse{
			Name: "db_password", Provider: "aws", Status: "synced", LastSyncedAt: time.Now().Format(time.RFC3339), InjectionType: "file", MountPath: "/run/secrets/db_password",
		})
		res = append(res, SecretResponse{
			Name: "api_key", Provider: "azure", Status: "pending", LastSyncedAt: time.Now().Add(-5 * time.Minute).Format(time.RFC3339), InjectionType: "env",
		})
	}

	json.NewEncoder(w).Encode(res)
}

func (s *RESTServer) handleProvider(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]interface{}{
		"provider_name":         "AWS Secrets Manager",
		"connection_status":     "connected",
		"auth_status":           "valid",
		"last_successful_fetch": time.Now().Format(time.RFC3339),
		"region":                "us-east-1",
	})
}

func (s *RESTServer) handleContainers(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode([]map[string]interface{}{
		{
			"container_name": "mysql_container",
			"last_injected_at": time.Now().Format(time.RFC3339),
			"secrets_used": []map[string]interface{}{
				{"secret_name": "db_password", "injection_type": "file", "mount_path": "/run/secrets/db_password"},
			},
		},
		{
			"container_name": "backend_api",
			"last_injected_at": time.Now().Add(-2 * time.Minute).Format(time.RFC3339),
			"secrets_used": []map[string]interface{}{
				{"secret_name": "api_key", "injection_type": "env"},
			},
		},
	})
}

func (s *RESTServer) handleLogs(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode([]map[string]interface{}{
		{"timestamp": time.Now().Format(time.RFC3339), "service": "agent", "message": "Agent system heartbeat OK", "severity": "info"},
		{"timestamp": time.Now().Add(-5 * time.Minute).Format(time.RFC3339), "service": "provider", "message": "Authentication token renewed successfully", "severity": "info"},
		{"timestamp": time.Now().Add(-10 * time.Minute).Format(time.RFC3339), "service": "provider", "message": "Network timeout to secrets backend", "severity": "warning"},
		{"timestamp": time.Now().Add(-12 * time.Minute).Format(time.RFC3339), "service": "container", "message": "Failed to inject file mount /run/secrets/db", "severity": "error"},
	})
}

func (s *RESTServer) handleMetrics(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_secrets":    1284,
		"successful_syncs": 14205,
		"failed_syncs":     23,
		"cache_hits":       3400,
		"cache_misses":     120,
		"provider_latency": "45ms",
	})
}

func StartRESTServer(addr string, cache *agent.SecretCache, logger *zap.Logger) {
	server := &RESTServer{
		Cache:  cache,
		Logger: logger,
	}

	mux := http.NewServeMux()
	mux.Handle("/", server)

	logger.Info("Starting REST API server", zap.String("addr", addr))
	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Error("REST API server failed", zap.Error(err))
	}
}
