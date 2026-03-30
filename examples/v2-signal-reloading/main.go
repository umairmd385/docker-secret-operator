package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

type Config struct {
	sync.RWMutex
	APIKey string
}

var globalConfig = &Config{}

func loadSecrets() {
	globalConfig.Lock()
	defer globalConfig.Unlock()

	// Read from the tmpfs volume managed securely by DSO
	data, err := os.ReadFile("/var/run/dso/secrets/prod-api-key")
	if err != nil {
		fmt.Println("Error reading secret:", err)
		return
	}
	globalConfig.APIKey = string(data)
	fmt.Println("Successfully loaded/reloaded secret!")
}

func main() {
	// 1. Initial Load before opening ports
	loadSecrets()

	// 2. Setup Signal Watching dynamically mapped
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGHUP)

	// 3. Listen for DSO signals securely in a background goroutine
	go func() {
		for {
			<-sigs
			fmt.Println("Received SIGHUP from DSO! Rotating secrets in memory...")
			loadSecrets()
		}
	}()

	fmt.Println("Server is running. Waiting for signals...")

	for {
		time.Sleep(10 * time.Second)
		globalConfig.RLock()
		fmt.Printf("[Active] Current API Key: %s\n", globalConfig.APIKey)
		globalConfig.RUnlock()
	}
}
