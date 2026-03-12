package agent

import (
	"fmt"
	"time"

	"github.com/docker-secret-operator/dso/internal/observability"
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

func (r *Rotator) Watch(providerName string, config map[string]string, secretName string, interval time.Duration) error {
	prov, client, err := provider.LoadProvider(providerName, config)
	if err != nil {
		return fmt.Errorf("failed to load provider for rotation %s: %w", providerName, err)
	}

	ch, err := prov.WatchSecret(secretName, interval)
	if err != nil {
		client.Kill()
		return fmt.Errorf("provider does not support watching %s: %w", secretName, err)
	}

	r.Logger.Info("Started secret rotation watcher", zap.String("provider", providerName), zap.String("secret", secretName))

	go func() {
		defer client.Kill()
		cacheKey := fmt.Sprintf("%s:%s", providerName, secretName)
		for update := range ch {
			if update.Error != "" {
				r.Logger.Error("Rotation error", zap.String("secret", secretName), zap.String("error", update.Error))
				observability.SecretRequestsTotal.WithLabelValues(providerName, "error").Inc()
				continue
			}
			
			r.Logger.Info("Secret rotated successfully", zap.String("secret", secretName))
			observability.SecretRequestsTotal.WithLabelValues(providerName, "rotation").Inc()
			r.Cache.Set(cacheKey, update.Data)
		}
	}()

	return nil
}
