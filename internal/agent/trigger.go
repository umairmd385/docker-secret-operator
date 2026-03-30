package agent

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/docker-secret-operator/dso/internal/providers"
	"github.com/docker-secret-operator/dso/internal/watcher"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"go.uber.org/zap"
)

type TriggerEngine struct {
	Cache     *SecretCache
	Store     *providers.SecretStoreManager
	Reloader  *watcher.ReloaderController
	Logger    *zap.Logger
	rotations     sync.Map
	events        sync.Map
	secretHashes  sync.Map
	lastRotations sync.Map
	Server        *AgentServer
}

func NewTriggerEngine(cache *SecretCache, storeManager *providers.SecretStoreManager, rw *watcher.ReloaderController, logger *zap.Logger) *TriggerEngine {
	return &TriggerEngine{
		Cache:    cache,
		Store:    storeManager,
		Reloader: rw,
		Logger:   logger,
	}
}

func (t *TriggerEngine) ExecuteRotation(providerName, secretName string, secretData map[string]string, sec config.SecretMapping) {
	cacheKey := fmt.Sprintf("%s:%s", providerName, secretName)
	newHash := ComputeHash(secretData)

	// 2. Add cooldown window
	if lastRot, ok := t.lastRotations.Load(cacheKey); ok {
		if time.Since(lastRot.(time.Time)) < 30*time.Second {
			t.Logger.Debug("Cooldown active, skipping rotation", zap.String("secret", secretName))
			return
		}
	}

	var oldHash string
	if val, ok := t.secretHashes.Load(cacheKey); ok {
		oldHash = val.(string)
	}

	if oldHash == newHash {
		msg := fmt.Sprintf("\033[1;33m[DSO ROTATION]\033[0m No change detected for %s → skipping", secretName)
		if t.Server != nil {
			t.Server.Emit(msg)
		} else {
			fmt.Println(msg)
		}
		return
	}

	t.secretHashes.Store(cacheKey, newHash)
	t.lastRotations.Store(cacheKey, time.Now())
	t.Cache.Set(cacheKey, secretData)

	msg := fmt.Sprintf("Secret rotated: %s", secretName)
	t.Logger.Info(msg)
	if t.Server != nil {
		t.Server.Emit(msg)
	}

		if sec.Inject == "file" {
			basePath := filepath.Join("/var/run/dso/secrets", secretName)
			if err := os.MkdirAll(basePath, 0700); err != nil {
				t.Logger.Error("Failed to create secret directory", zap.Error(err))
			} else {
				for key, val := range secretData {
					mapKey := key
					if mappedTo, ok := sec.Mappings[key]; ok {
						mapKey = mappedTo
					}
					targetFile := filepath.Join(basePath, mapKey)
					tmpFile := targetFile + ".tmp"
					_ = os.WriteFile(tmpFile, []byte(val), 0400)
					_ = os.Rename(tmpFile, targetFile)
				}

				go func() {
					ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
					defer cancel()
					_ = t.Reloader.TriggerReload(ctx, secretName)
				}()
			}
		} else if sec.Inject == "env" {
			go func() {
				ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
				defer cancel()
				if t.Server != nil {
					t.Server.Emit(fmt.Sprintf("Triggering re-injection for %s", secretName))
				}
				_ = t.Reloader.TriggerReload(ctx, secretName)
			}()
	}
}

func (t *TriggerEngine) StartPolling(providerName string, provConfig map[string]string, sec config.SecretMapping, baseInterval time.Duration) error {
	t.Logger.Info("Initializing secret polling", zap.String("secret", sec.Name))

	go func() {
		cacheKey := fmt.Sprintf("%s:%s", providerName, sec.Name)

		if _, exists := t.rotations.LoadOrStore(cacheKey, true); exists {
			return
		}
		defer t.rotations.Delete(cacheKey)

		backoff := 5 * time.Second
		currentInterval := baseInterval
		maxInterval := baseInterval * 4

		for {
			prov, err := t.Store.GetProvider(providerName, provConfig)
			if err != nil {
				time.Sleep(backoff)
				if backoff < 2*time.Minute {
					backoff *= 2
				}
				continue
			}

			ch, err := prov.WatchSecret(sec.Name, currentInterval)
			if err != nil {
				time.Sleep(backoff)
				if backoff < 2*time.Minute {
					backoff *= 2
				}
				continue
			}

			for update := range ch {
				if update.Error != "" {
					observability.SecretRequestsTotal.WithLabelValues(providerName, "error").Inc()
					continue
				}

				oldData, exists := t.Cache.Get(cacheKey)
				if !exists || ComputeHash(oldData) != ComputeHash(update.Data) {
					currentInterval = baseInterval
				} else {
					if currentInterval < maxInterval {
						currentInterval = time.Duration(float64(currentInterval) * 1.5)
					}
				}

				t.ExecuteRotation(providerName, sec.Name, update.Data, sec)
			}
			time.Sleep(backoff)
		}
	}()

	return nil
}

func (t *TriggerEngine) HandleWebhook(providerName string, provConfig map[string]string, sec config.SecretMapping, timestamp string) error {
	cacheKey := fmt.Sprintf("%s:%s", providerName, sec.Name)

	idempKey := cacheKey + ":" + timestamp
	if _, loaded := t.events.LoadOrStore(idempKey, time.Now()); loaded {
		return nil
	}

	go func() {
		time.Sleep(5 * time.Minute)
		t.events.Delete(idempKey)
	}()

	prov, err := t.Store.GetProvider(providerName, provConfig)
	if err != nil {
		return err
	}

	val, err := prov.GetSecret(sec.Name)
	if err != nil {
		return err
	}

	t.ExecuteRotation(providerName, sec.Name, val, sec)
	return nil
}

