package agent

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/observability"
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
	r.Logger.Info("Initializing secret rotation watcher", zap.String("provider", providerName), zap.String("secret", sec.Name))

	go func() {
		cacheKey := fmt.Sprintf("%s:%s", providerName, sec.Name)
		for {
			r.Logger.Info("Connecting to provider watcher", zap.String("provider", providerName), zap.String("secret", sec.Name))
			
			prov, client, err := provider.LoadProvider(providerName, provConfig)
			if err != nil {
				r.Logger.Error("Failed to load provider, retrying in 30s", zap.Error(err))
				time.Sleep(30 * time.Second)
				continue
			}

			ch, err := prov.WatchSecret(sec.Name, interval)
			if err != nil {
				client.Kill()
				r.Logger.Error("Provider watch failed, retrying in 30s", zap.Error(err))
				time.Sleep(30 * time.Second)
				continue
			}

			for update := range ch {
				if update.Error != "" {
					r.Logger.Error("Rotation update error", zap.String("secret", sec.Name), zap.String("error", update.Error))
					observability.SecretRequestsTotal.WithLabelValues(providerName, "error").Inc()
					observability.BackendFailuresTotal.WithLabelValues(providerName, "rotation").Inc()
					continue
				}
				
				r.Logger.Info("Secret rotated successfully", zap.String("secret", sec.Name))
				observability.SecretRequestsTotal.WithLabelValues(providerName, "rotation").Inc()
				r.Cache.Set(cacheKey, update.Data)

				if sec.Inject == "file" {
					basePath := filepath.Join("/var/run/dso/secrets", sec.Name)
					if err := os.MkdirAll(basePath, 0755); err != nil {
						r.Logger.Error("Failed to create secret directory", zap.Error(err))
					} else {
						for key, val := range update.Data {
							mapKey := key
							if mappedTo, ok := sec.Mappings[key]; ok {
								mapKey = mappedTo
							}
							os.WriteFile(filepath.Join(basePath, mapKey), []byte(val), 0644)
						}
						// r.Logger.Info("Flushed rotated secret to volume", zap.String("path", basePath))
					}
				}
			}
			client.Kill()
			r.Logger.Warn("Rotation channel closed, restarting in 10s", zap.String("secret", sec.Name))
			time.Sleep(10 * time.Second)
		}
	}()

	return nil
}
