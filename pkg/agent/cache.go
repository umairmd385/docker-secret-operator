package agent

import (
	"sync"
	"time"
)

type CacheItem struct {
	Data      map[string]string
	ExpiresAt time.Time
}

type SecretCache struct {
	mu    sync.RWMutex
	items map[string]CacheItem
	ttl   time.Duration
}

func NewSecretCache(ttl time.Duration) *SecretCache {
	return &SecretCache{
		items: make(map[string]CacheItem),
		ttl:   ttl,
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
		ExpiresAt: time.Now().Add(c.ttl),
	}
}

func (c *SecretCache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.items, key)
}
