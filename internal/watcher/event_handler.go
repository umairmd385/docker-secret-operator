package watcher

import (
	"fmt"
	"strings"
	"time"

	"github.com/docker/docker/api/types/events"
)

// ProcessEvent formats and logs a docker event message properly.
func ProcessEvent(msg events.Message, debug bool) {
	timestamp := time.Now().Format("15:04:05")
	event := strings.ToUpper(string(msg.Action))
	name := msg.Actor.Attributes["name"]
	if name == "" {
		name = msg.Actor.ID[:12]
	}

	// Output format: [DSO WATCH] [TIMESTAMP] EVENT → container_name
	fmt.Printf("\033[1;36m[DSO WATCH]\033[0m [%s] \033[1;1m%s\033[0m → %s\n", timestamp, event, name)

	if debug {
		fmt.Printf("   [DEBUG] ID: %s, From: %s, Action: %v\n", msg.Actor.ID[:12], msg.From, msg.Action)
		for k, v := range msg.Actor.Attributes {
			if k != "name" {
				fmt.Printf("           %s: %s\n", k, v)
			}
		}
	}
}
