package agent

import (
	"fmt"
	"net"
	"net/rpc"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/internal/observability"
	"github.com/docker-secret-operator/dso/pkg/api"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"go.uber.org/zap"
)

type AgentServer struct {
	Cache  *SecretCache
	Logger *zap.Logger
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
	prov, client, err := provider.LoadProvider(req.Provider, req.Config)
	if err != nil {
		observability.SecretRequestsTotal.WithLabelValues(req.Provider, "error").Inc()
		resp.Error = err.Error()
		return err
	}
	defer client.Kill()

	data, err := prov.GetSecret(req.Secret)
	if err != nil {
		observability.SecretRequestsTotal.WithLabelValues(req.Provider, "error").Inc()
		resp.Error = err.Error()
		return err
	}

	observability.SecretRequestsTotal.WithLabelValues(req.Provider, "success").Inc()

	s.Cache.Set(cacheKey, data)
	resp.Data = data
	return nil
}

func StartSocketServer(socketPath string, logger *zap.Logger, cacheTTLSecs int) error {
	server := &AgentServer{
		Cache:  NewSecretCache(time.Duration(cacheTTLSecs) * time.Second),
		Logger: logger,
	}

	rpc.RegisterName("Agent", server)

	// Remove old socket if exists
	if _, err := os.Stat(socketPath); err == nil {
		os.Remove(socketPath)
	}

	logger.Info("Starting local Unix socket", zap.String("path", socketPath))
	listener, err := net.Listen("unix", socketPath)
	if err != nil {
		return fmt.Errorf("failed to listen on socket %s: %w", socketPath, err)
	}
	defer listener.Close()

	// Ensure permissive permissions so containers mounted can read it
	os.Chmod(socketPath, 0660) // Changed to 0660 for better security (must share GID)

	for {
		conn, err := listener.Accept()
		if err != nil {
			logger.Error("Socket accept error", zap.Error(err))
			continue
		}
		go rpc.ServeConn(conn)
	}
}
