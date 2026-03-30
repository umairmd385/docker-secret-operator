package server

import (
	"encoding/json"
	"os"
	"sync"
)

type Event map[string]interface{}

type EventStore struct {
	mu      sync.RWMutex
	events  []Event
	limit   int
	hub     *Hub
	logFile *os.File
}

func NewEventStore(limit int, hub *Hub) *EventStore {
	store := &EventStore{
		events: make([]Event, 0, limit),
		limit:  limit,
		hub:    hub,
	}

	os.MkdirAll("/var/run/dso", 0755)
	f, err := os.OpenFile("/var/run/dso/events.jsonl", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err == nil {
		store.logFile = f
	}

	return store
}

func (s *EventStore) Add(e Event) {
	s.mu.Lock()
	s.events = append(s.events, e)
	if len(s.events) > s.limit {
		s.events = s.events[len(s.events)-s.limit:]
	}

	if s.logFile != nil {
		if b, err := json.Marshal(e); err == nil {
			b = append(b, '\n')
			s.logFile.Write(b)
			s.logFile.Sync()
		}
	}
	s.mu.Unlock()

	if s.hub != nil {
		s.hub.broadcast <- e
	}
}

func (s *EventStore) GetLast(limit int, severityFilter string) []Event {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []Event
	for _, ev := range s.events {
		if severityFilter != "" {
			if stat, ok := ev["status"].(string); ok && stat != severityFilter {
				continue // Skip if filtering by severity/status and it doesn't match
			}
		}
		matched = append(matched, ev)
	}

	l := len(matched)
	if limit > l || limit <= 0 {
		limit = l
	}

	res := make([]Event, limit)
	copy(res, matched[l-limit:])
	return res
}
