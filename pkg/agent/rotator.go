package agent

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/docker-secret-operator/dso/internal/observability"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"go.uber.org/zap"
)

type Rotator struct {
	Cache  *SecretCache
	Logger *zap.Logger
}

func NewRotator(cache *SecretCache, logger *zap.Logger) *Rotator {
	return &Rotator{
		Cache:  cache,
		Logger: logger,
	}
}

func (r *Rotator) Watch(providerName string, provConfig map[string]string, sec config.SecretMapping, interval time.Duration) error {
	prov, client, err := provider.LoadProvider(providerName, provConfig)
	if err != nil {
		return fmt.Errorf("failed to load provider for rotation %s: %w", providerName, err)
	}

	ch, err := prov.WatchSecret(sec.Name, interval)
	if err != nil {
		client.Kill()
		return fmt.Errorf("provider does not support watching %s: %w", sec.Name, err)
	}

	r.Logger.Info("Started secret rotation watcher", zap.String("provider", providerName), zap.String("secret", sec.Name))

	go func() {
		defer client.Kill()
		cacheKey := fmt.Sprintf("%s:%s", providerName, sec.Name)
		for update := range ch {
			if update.Error != "" {
				r.Logger.Error("Rotation error", zap.String("secret", sec.Name), zap.String("error", update.Error))
				observability.SecretRequestsTotal.WithLabelValues(providerName, "error").Inc()
				continue
			}
			
			r.Logger.Info("Secret fetched successfully", zap.String("secret", sec.Name))
			observability.SecretRequestsTotal.WithLabelValues(providerName, "rotation").Inc()
			r.Cache.Set(cacheKey, update.Data)

			// Automatic File Syncing if configured
			if sec.Inject == "file" {
				basePath := filepath.Join("/var/run/dso/secrets", sec.Name)
				if err := os.MkdirAll(basePath, 0755); err != nil {
					r.Logger.Error("Failed to create secret directory", zap.Error(err))
				} else {
					for key, val := range update.Data {
						mapKey := key
						// If user explicitly mapped this key to a different filename, use it
						if mappedTo, ok := sec.Mappings[key]; ok {
							mapKey = mappedTo
						}
						os.WriteFile(filepath.Join(basePath, mapKey), []byte(val), 0644)
					}
					r.Logger.Info("Flushed secret to volume", zap.String("path", basePath))
				}
			}
		}
	}()

	return nil
}
