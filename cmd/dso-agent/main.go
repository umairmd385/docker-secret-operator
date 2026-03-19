package main

import (
	"flag"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/internal/agent"
	"github.com/docker-secret-operator/dso/internal/server"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"go.uber.org/zap"
)

func main() {
	logger, _ := observability.NewLogger("info", true)
	defer logger.Sync()

	cfgFile := flag.String("config", "", "Path to dso.yaml config file")
	socketPath := "/var/run/dso.sock"
	driverSocket := "/var/run/dso-driver.sock"

	if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
		socketPath = custom
	}
	if custom := os.Getenv("DSO_DRIVER_SOCKET"); custom != "" {
		driverSocket = custom
	}
	flag.Parse()

	logger.Info("Starting dso-agent...")

	// Initialize the shared cache
	cache := agent.NewSecretCache(300 * time.Second)

	// Start Rotator if config is provided
	if *cfgFile != "" {
		cfg, err := config.LoadConfig(*cfgFile)
		if err != nil {
			logger.Fatal("Failed reading config", zap.Error(err))
		}
		
		rotator := agent.NewRotator(cache, logger)
		
		interval := 2 * time.Minute
		if cfg.Agent.RefreshInterval != "" {
			parsed, err := time.ParseDuration(cfg.Agent.RefreshInterval)
			if err == nil {
				interval = parsed
			}
		}

		for _, sec := range cfg.Secrets {
			if err := rotator.Watch(cfg.Provider, cfg.Config, sec, interval); err != nil {
				logger.Error("Failed to start watching secret", zap.String("secret", sec.Name), zap.Error(err))
			}
		}
	}

	go observability.StartMetricsServer(":9090", logger)

	// Start the Docker Secret Driver HTTP server in the background
	go func() {
		if err := agent.StartDriverServer(driverSocket, cache, logger); err != nil {
			logger.Error("Driver server failed", zap.Error(err))
		}
	}()

	// Start the administrative REST API (background)
	apiAddr := ":8081"
	if custom := os.Getenv("DSO_API_ADDR"); custom != "" {
		apiAddr = custom
	}
	go server.StartRESTServer(apiAddr, cache, logger)

	// Start the internal RPC server (main thread)
	if err := agent.StartSocketServer(socketPath, cache, logger); err != nil {
		logger.Fatal("Agent stopped with error", zap.Error(err))
	}
}
