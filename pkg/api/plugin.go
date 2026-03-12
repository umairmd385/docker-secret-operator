package api

import (
	"encoding/gob"
	"time"
)

func init() {
	gob.Register(SecretUpdate{})
}

type SecretUpdate struct {
	Name  string
	Data  map[string]string
	Error string
}

type SecretProvider interface {
	Init(config map[string]string) error
	GetSecret(name string) (map[string]string, error)
	WatchSecret(name string, interval time.Duration) (<-chan SecretUpdate, error)
}
