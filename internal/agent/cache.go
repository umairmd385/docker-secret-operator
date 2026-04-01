package agent

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"sync"
	"time"
)

type CacheItem struct {
	Data      map[string]string
	Hash      string
	ExpiresAt time.Time
}

// ComputeHash generates a secure SHA-256 hash of the input data
func ComputeHash(data map[string]string) string {
	b, _ := json.Marshal(data)
	hash := sha256.Sum256(b)
	return hex.EncodeToString(hash[:])
}

type SecretCache struct {
	mu    sync.RWMutex
	items map[string]CacheItem
	ttl   time.Duration
}

func NewSecretCache(ttl time.Duration) *SecretCache {
	c := &SecretCache{
		items: make(map[string]CacheItem),
		ttl:   ttl,
	}

	if data, err := os.ReadFile("/var/run/dso/state.json"); err == nil {
		var state map[string]CacheItem
		if err := json.Unmarshal(data, &state); err == nil {
			c.items = state
		}
	}

	return c
}

func (c *SecretCache) saveToDisk() {
	if b, err := json.Marshal(c.items); err == nil {
		os.MkdirAll("/var/run/dso", 0755)
		os.WriteFile("/var/run/dso/state.json", b, 0644)
	}
}

func (c *SecretCache) Get(key string) (map[string]string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.items[key]
	if !exists {
		return nil, false
	}

	if time.Now().After(item.ExpiresAt) {
		return nil, false
	}

	return item.Data, true
}

func (c *SecretCache) Set(key string, data map[string]string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = CacheItem{
		Data:      data,
		Hash:      ComputeHash(data),
		ExpiresAt: time.Now().Add(c.ttl),
	}

	c.saveToDisk()
}

func (c *SecretCache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.items, key)
	c.saveToDisk()
}

// ListKeys returns all keys currently in the cache
func (c *SecretCache) ListKeys() []string {
	c.mu.RLock()
	defer c.mu.RUnlock()

	keys := make([]string, 0, len(c.items))
	for k := range c.items {
		keys = append(keys, k)
	}
	return keys
}
