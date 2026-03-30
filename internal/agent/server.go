package agent

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/rpc"
	"os"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/internal/providers"
	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"go.uber.org/zap"
)

type AgentServer struct {
	Cache  *SecretCache
	Store  *providers.SecretStoreManager
	Logger *zap.Logger
	Events []string // Simple in-memory event log for 'watch'
	mu     sync.Mutex
}

func (s *AgentServer) Emit(msg string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Events = append(s.Events, fmt.Sprintf("[%s] %s", time.Now().Format("15:04:05"), msg))
	if len(s.Events) > 100 {
		s.Events = s.Events[1:]
	}
}

func (s *AgentServer) GetEvents(req *api.AgentRequest, resp *api.AgentResponse) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Logger.Debug("Streaming events to watcher")
	resp.Data = map[string]string{}
	for i, e := range s.Events {
		resp.Data[fmt.Sprintf("%d", i)] = e
	}
	return nil
}

func (s *AgentServer) GetSecret(req *api.AgentRequest, resp *api.AgentResponse) error {
	cacheKey := fmt.Sprintf("%s:%s", req.Provider, req.Secret)

	// fast path cache
	if data, found := s.Cache.Get(cacheKey); found {
		s.Logger.Debug("Cache hit", zap.String("secret", req.Secret))
		observability.SecretCacheHitsTotal.WithLabelValues(req.Secret).Inc()
		observability.SecretRequestsTotal.WithLabelValues(req.Provider, "success").Inc()
		resp.Data = data
		return nil
	}

	observability.SecretCacheMissesTotal.Inc()
	s.Logger.Info("Fetching secret from provider", zap.String("provider", req.Provider), zap.String("secret", req.Secret))

	// slow path provider lookup
	timer := observability.SecretFetchLatency.WithLabelValues(req.Provider)
	start := time.Now()
	prov, err := s.Store.GetProvider(req.Provider, req.Config)
	if err != nil {
		observability.SecretRequestsTotal.WithLabelValues(req.Provider, "error").Inc()
		observability.BackendFailuresTotal.WithLabelValues(req.Provider, "load_fail").Inc()
		resp.Error = err.Error()
		return err
	}

	data, err := prov.GetSecret(req.Secret)
	timer.Observe(time.Since(start).Seconds())
	if err != nil {
		observability.SecretRequestsTotal.WithLabelValues(req.Provider, "error").Inc()
		observability.BackendFailuresTotal.WithLabelValues(req.Provider, "fetch_fail").Inc()
		resp.Error = err.Error()
		return err
	}

	observability.SecretRequestsTotal.WithLabelValues(req.Provider, "success").Inc()

	s.Cache.Set(cacheKey, data)
	resp.Data = data
	return nil
}

func StartSocketServer(socketPath string, cache *SecretCache, store *providers.SecretStoreManager, logger *zap.Logger) (*AgentServer, error) {
	server := &AgentServer{
		Cache:  cache,
		Store:  store,
		Logger: logger,
	}

	_ = rpc.RegisterName("Agent", server)

	// Remove old socket if exists
	if _, err := os.Stat(socketPath); err == nil {
		_ = os.Remove(socketPath)
	}

	logger.Info("Starting local Unix socket", zap.String("path", socketPath))
	listener, err := net.Listen("unix", socketPath)
	if err != nil {
		return nil, fmt.Errorf("failed to listen on socket %s: %w", socketPath, err)
	}

	// Ensure permissive permissions so containers mounted can read it
	_ = os.Chmod(socketPath, 0666)

	go func() {
		defer listener.Close()
		for {
			conn, err := listener.Accept()
			if err != nil {
				logger.Error("Socket accept error", zap.Error(err))
				continue
			}
			go rpc.ServeConn(conn)
		}
	}()

	return server, nil
}

// ServeHTTP handles Docker V2 Secret Driver requests (POST /SecretDriver.Get)
func (s *AgentServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost || r.URL.Path != "/SecretDriver.Get" {
		http.NotFound(w, r)
		return
	}

	var req api.DockerV2SecretRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.Logger.Error("Failed to decode driver request", zap.Error(err))
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s.Logger.Info("Docker Driver request", zap.String("name", req.Name))

	// Attempt to get from cache or default provider
	fetchReq := &api.AgentRequest{Secret: req.Name}
	fetchResp := &api.AgentResponse{}

	err := s.GetSecret(fetchReq, fetchResp)

	resp := api.DockerV2SecretResponse{}
	if err != nil || fetchResp.Error != "" {
		errorMsg := "secret not found"
		if err != nil {
			errorMsg = err.Error()
		} else if fetchResp.Error != "" {
			errorMsg = fetchResp.Error
		}
		resp.Err = errorMsg
	} else {
		valBytes, _ := json.Marshal(fetchResp.Data)
		resp.Value = valBytes
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}

func StartDriverServer(socketPath string, cache *SecretCache, store *providers.SecretStoreManager, logger *zap.Logger) error {
	server := &AgentServer{
		Cache:  cache,
		Store:  store,
		Logger: logger,
	}

	if _, err := os.Stat(socketPath); err == nil {
		_ = os.Remove(socketPath)
	}

	logger.Info("Starting Docker Secret Driver socket", zap.String("path", socketPath))
	listener, err := net.Listen("unix", socketPath)
	if err != nil {
		return fmt.Errorf("failed to listen on driver socket %s: %w", socketPath, err)
	}

	_ = os.Chmod(socketPath, 0666)
	return http.Serve(listener, server)
}
