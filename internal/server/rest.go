package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/docker-secret-operator/dso/internal/agent"
	"go.uber.org/zap"
)

// RESTServer handles administrative REST API requests
type RESTServer struct {
	Cache  *agent.SecretCache
	Logger *zap.Logger
}

func (s *RESTServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/health":
		s.handleHealth(w, r)
	case "/secrets":
		s.handleListSecrets(w, r)
	default:
		http.NotFound(w, r)
	}
}

func (s *RESTServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `{"status":"up"}`)
}

func (s *RESTServer) handleListSecrets(w http.ResponseWriter, r *http.Request) {
	// For production, we would want more detail here.
	// For now, listing keys in the cache.
	w.Header().Set("Content-Type", "application/json")
	keys := s.Cache.ListKeys()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"active_secrets": keys,
		"total_count":    len(keys),
	})
}

// StartRESTServer starts the REST API server on the specified address
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
