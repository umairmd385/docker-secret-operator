package main

import (
	"context"
	"flag"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/internal/agent"
	"github.com/docker-secret-operator/dso/internal/providers"
	"github.com/docker-secret-operator/dso/internal/server"
	"github.com/docker-secret-operator/dso/internal/watcher"
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

	// Start persistent SecretStore
	storeManager := providers.NewSecretStoreManager(logger)
	defer storeManager.Shutdown()

	reloaderCtrl, err := watcher.NewReloaderController(logger)
	if err != nil {
		logger.Fatal("Failed to initialize ReloaderController", zap.Error(err))
	}

	// Start event loop
	ctx := context.Background()
	reloaderCtrl.StartEventLoop(ctx)

	var triggerEngine *agent.TriggerEngine
	var parsedConfig *config.Config

	if *cfgFile != "" {
		cfg, err := config.LoadConfig(*cfgFile)
		if err != nil {
			logger.Fatal("Failed reading config", zap.Error(err))
		}

		parsedConfig = cfg
		triggerEngine = agent.NewTriggerEngine(cache, storeManager, reloaderCtrl, logger)

		interval := 2 * time.Minute
		if cfg.Agent.Watch.PollingInterval != "" {
			if parsed, err := time.ParseDuration(cfg.Agent.Watch.PollingInterval); err == nil {
				interval = parsed
			}
		}

		for _, sec := range cfg.Secrets {
			mode := cfg.Agent.Watch.Mode
			if mode == "" || mode == "polling" || mode == "hybrid" {
				if err := triggerEngine.StartPolling(cfg.Provider, cfg.Config, sec, interval); err != nil {
					logger.Error("Failed to start polling", zap.String("secret", sec.Name), zap.Error(err))
				}
			}
		}
	}

	go observability.StartMetricsServer(":9090", logger)

	// Start the Docker Secret Driver
	go func() {
		if err := agent.StartDriverServer(driverSocket, cache, storeManager, logger); err != nil {
			logger.Error("Driver server failed", zap.Error(err))
		}
	}()

	// Start the administrative API
	apiAddr := ":8080"
	if custom := os.Getenv("DSO_API_ADDR"); custom != "" {
		apiAddr = custom
	}
	go server.StartRESTServer(apiAddr, cache, triggerEngine, parsedConfig, logger)

	// Start the internal RPC server
	srv, err := agent.StartSocketServer(socketPath, cache, storeManager, logger)
	if err != nil {
		logger.Fatal("Agent failed to start socket server", zap.Error(err))
	}

	// Connect the events!
	if triggerEngine != nil {
		triggerEngine.Server = srv
	}
	reloaderCtrl.Server = srv

	// Block forever
	select {}
}
