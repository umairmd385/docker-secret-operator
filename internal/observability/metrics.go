package observability

import (
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

var (
	SecretRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "dso_secret_requests_total",
			Help: "Total number of secret requests received by the agent",
		},
		[]string{"provider", "status"},
	)
	SecretCacheHitsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "dso_secret_cache_hits_total",
			Help: "Total number of secret cache hits",
		},
		[]string{"secret"},
	)
	SecretCacheMissesTotal = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "dso_secret_cache_misses_total",
			Help: "Total number of secret cache misses",
		},
	)
)

func StartMetricsServer(addr string, logger *zap.Logger) {
	http.Handle("/metrics", promhttp.Handler())
	logger.Info("Starting Prometheus metrics server", zap.String("addr", addr))
	if err := http.ListenAndServe(addr, nil); err != nil {
		logger.Error("Metrics server failed", zap.Error(err))
	}
}
