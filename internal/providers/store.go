package providers

import (
	"fmt"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
	pkgprovider "github.com/docker-secret-operator/dso/pkg/provider"
	"github.com/hashicorp/go-plugin"
	"go.uber.org/zap"
)

type StoreEntry struct {
	Provider api.SecretProvider
	Client   *plugin.Client
}

type SecretStoreManager struct {
	logger *zap.Logger
	store  sync.Map
}

func NewSecretStoreManager(logger *zap.Logger) *SecretStoreManager {
	return &SecretStoreManager{
		logger: logger,
	}
}

// GetProvider retrieves an active connection or initializes a new one with backoff retry
func (s *SecretStoreManager) GetProvider(providerName string, config map[string]string) (api.SecretProvider, error) {
	if val, ok := s.store.Load(providerName); ok {
		entry := val.(*StoreEntry)
		return entry.Provider, nil
	}

	s.logger.Info("Initializing new persistent provider connection", zap.String("provider", providerName))

	var prov api.SecretProvider
	var client *plugin.Client
	var err error

	success := false
	backoff := 2 * time.Second

	for attempt := 1; attempt <= 3; attempt++ {
		prov, client, err = pkgprovider.LoadProvider(providerName, config)
		if err == nil {
			success = true
			break
		}
		s.logger.Warn("Failed to initialize provider, applying backoff",
			zap.String("provider", providerName),
			zap.Error(err),
			zap.Duration("retry", backoff))
		time.Sleep(backoff)
		backoff *= 2
	}

	if !success {
		return nil, fmt.Errorf("provider initialization exhausted retries: %w", err)
	}

	s.store.Store(providerName, &StoreEntry{
		Provider: prov,
		Client:   client,
	})

	return prov, nil
}

// Shutdown cleanly kills all active provider plugin children
func (s *SecretStoreManager) Shutdown() {
	s.store.Range(func(key, value interface{}) bool {
		entry := value.(*StoreEntry)
		entry.Client.Kill()
		return true
	})
}
