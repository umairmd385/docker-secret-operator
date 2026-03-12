package main

import (
	"flag"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/internal/observability"
	"github.com/docker-secret-operator/dso/pkg/agent"
	"github.com/docker-secret-operator/dso/pkg/config"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	cfgFile := flag.String("config", "", "Path to dso.yaml config file")
	flag.Parse()

	socketPath := "/var/run/dso.sock"
	if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
		socketPath = custom
	}

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

	if err := agent.StartSocketServer(socketPath, cache, logger); err != nil {
		logger.Fatal("Agent stopped with error", zap.Error(err))
	}
}
