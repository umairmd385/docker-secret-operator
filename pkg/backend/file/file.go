package file

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/docker-secret-operator/dso/pkg/api"
)

type FileProvider struct {
	basePath string
}

func (p *FileProvider) Init(config map[string]string) error {
	p.basePath = config["path"]
	if p.basePath == "" {
		p.basePath = "/etc/dso/secrets"
	}
	return nil
}

func (p *FileProvider) GetSecret(name string) (map[string]string, error) {
	path := filepath.Join(p.basePath, name)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		path = path + ".json"
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read secret file %s: %w", path, err)
	}

	var data map[string]string
	if err := json.Unmarshal(content, &data); err != nil {
		// If not JSON, return as single value
		return map[string]string{"value": string(content)}, nil
	}

	return data, nil
}

func (p *FileProvider) WatchSecret(name string, interval time.Duration) (<-chan api.SecretUpdate, error) {
	ch := make(chan api.SecretUpdate)
	go func() {
		ticker := time.NewTicker(interval)
		for range ticker.C {
			data, err := p.GetSecret(name)
			var errMsg string
			if err != nil {
				errMsg = err.Error()
			}
			ch <- api.SecretUpdate{Name: name, Data: data, Error: errMsg}
		}
	}()
	return ch, nil
}
