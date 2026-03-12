package env

import (
	"os"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
)

type EnvProvider struct{}

func (p *EnvProvider) Init(config map[string]string) error {
	return nil
}

func (p *EnvProvider) GetSecret(name string) (map[string]string, error) {
	val := os.Getenv(name)
	if val == "" {
		return map[string]string{}, nil
	}
	// Return the environment variable as a single mapping
	return map[string]string{"value": val}, nil
}

func (p *EnvProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		ticker := time.NewTicker(interval)
		for range ticker.C {
			data, _ := p.GetSecret(name)
			ch <- api.SecretUpdate{Name: name, Data: data}
		}
	}()
	return ch, nil
}
