package main

import (
	"os"

	"github.com/docker-secret-operator/dso/internal/observability"
	"github.com/docker-secret-operator/dso/pkg/agent"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	socketPath := "/var/run/dso.sock"
	if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
		socketPath = custom
	}

	logger.Info("Starting dso-agent...")

	go observability.StartMetricsServer(":9090", logger)

	if err := agent.StartSocketServer(socketPath, logger, 300); err != nil {
		logger.Fatal("Agent stopped with error", zap.Error(err))
	}
}
