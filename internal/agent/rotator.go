package agent

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/docker-secret-operator/dso/pkg/provider"
	"go.uber.org/zap"
)

type Rotator struct {
	Cache     *SecretCache
	Injector  *injector.DockerInjector
	Logger    *zap.Logger
	rotations sync.Map
}

func NewRotator(cache *SecretCache, logger *zap.Logger) *Rotator {
	return &Rotator{
		Cache:    cache,
		Injector: injector.NewDockerInjector(logger),
		Logger:   logger,
	}
}

func (r *Rotator) Watch(providerName string, provConfig map[string]string, sec config.SecretMapping, baseInterval time.Duration) error {
	r.Logger.Info("Initializing secret rotation watcher", zap.String("provider", providerName), zap.String("secret", sec.Name))

	go func() {
		cacheKey := fmt.Sprintf("%s:%s", providerName, sec.Name)
		
		if _, exists := r.rotations.LoadOrStore(cacheKey, true); exists {
			r.Logger.Warn("Rotation explicitly blocked: watch loop presently active uniquely", zap.String("secret", sec.Name))
			return
		}
		defer r.rotations.Delete(cacheKey)

		backoff := 5 * time.Second
		currentInterval := baseInterval
		maxInterval := baseInterval * 4 // Adaptive stretch

		for {
			r.Logger.Info("Connecting to provider watcher cleanly scoped", zap.String("provider", providerName), zap.String("secret", sec.Name))
			
			prov, client, err := provider.LoadProvider(providerName, provConfig)
			if err != nil {
				r.Logger.Error("Failed to load provider gracefully applying backoff", zap.Error(err), zap.Duration("retry", backoff))
				time.Sleep(backoff)
				if backoff < 2*time.Minute {
					backoff *= 2
				}
				continue
			}

			ch, err := prov.WatchSecret(sec.Name, currentInterval)
			if err != nil {
				client.Kill()
				r.Logger.Error("Provider watch connection dropped gracefully applying backoff", zap.Error(err), zap.Duration("retry", backoff))
				time.Sleep(backoff)
				if backoff < 2*time.Minute {
					backoff *= 2
				}
				continue
			}

			for update := range ch {
				if update.Error != "" {
					r.Logger.Error("Rotation update error", zap.String("secret", sec.Name), zap.String("error", update.Error))
					observability.SecretRequestsTotal.WithLabelValues(providerName, "error").Inc()
					observability.BackendFailuresTotal.WithLabelValues(providerName, "rotation").Inc()
					continue
				}

				newHash := ComputeHash(update.Data)
				oldData, exists := r.Cache.Get(cacheKey)
				oldHash := ""
				if exists {
					oldHash = ComputeHash(oldData)
				}

				if !exists || oldHash != newHash {
					r.Logger.Info("Secret rotated successfully, value explicitly changed", zap.String("secret", sec.Name))
					observability.SecretRequestsTotal.WithLabelValues(providerName, "rotation").Inc()
					r.Cache.Set(cacheKey, update.Data)
					
					// Reset adaptive bounds cleanly globally capturing activity
					currentInterval = baseInterval

					if sec.Inject == "file" {
						basePath := filepath.Join("/var/run/dso/secrets", sec.Name)
						if err := os.MkdirAll(basePath, 0755); err != nil {
							r.Logger.Error("Failed to create secret directory natively bounds overstep", zap.Error(err))
						} else {
							for key, val := range update.Data {
								mapKey := key
								if mappedTo, ok := sec.Mappings[key]; ok {
									mapKey = mappedTo
								}
								os.WriteFile(filepath.Join(basePath, mapKey), []byte(val), 0644)
							}
							r.Logger.Info("Flushed rotated secret to volume strictly natively", zap.String("secret", sec.Name))
						}
					} else if sec.Inject == "env" {
						r.Logger.Info("Triggering best-effort rolling restart cleanly mapping to env injection scopes securely", zap.String("secret", sec.Name))
						go r.Injector.ExecuteBestEffortRollingRestart(sec.Name, update.Data)
					}
				} else {
					// Adaptive Polling Strategy: Increase explicitly polling bounds when payloads uniquely stall.
					if currentInterval < maxInterval {
						currentInterval = time.Duration(float64(currentInterval) * 1.5)
					}
				}
			}
			client.Kill()
			r.Logger.Warn("Rotation channel implicitly closed natively gracefully applying backoff", zap.String("secret", sec.Name), zap.Duration("retry", backoff))
			time.Sleep(backoff)
			if backoff < 2*time.Minute {
				backoff *= 2
			}
		}
	}()

	return nil
}
