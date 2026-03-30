package watcher

import (
	"sync"
	"time"
)

// EventDebouncer tracks recently processed docker events to ignore rapid duplicates
type EventDebouncer struct {
	events sync.Map
	window time.Duration
}

func NewEventDebouncer(window time.Duration) *EventDebouncer {
	return &EventDebouncer{
		window: window,
	}
}

// CheckAndRecord returns true if the event has NOT been seen in the window (i.e. is fresh)
func (ed *EventDebouncer) CheckAndRecord(eventID string) bool {
	now := time.Now()
	val, loaded := ed.events.LoadOrStore(eventID, now)
	if loaded {
		lastTime := val.(time.Time)
		if now.Sub(lastTime) < ed.window {
			// update the timestamp for sliding window
			ed.events.Store(eventID, now)
			return false // Debounced / Duplicate recorded
		}
		// past window, accept it
		ed.events.Store(eventID, now)
		return true
	}

	// Janitor to clear memory after window passes
	go func() {
		time.Sleep(ed.window * 2)
		ed.events.Delete(eventID)
	}()

	return true
}
