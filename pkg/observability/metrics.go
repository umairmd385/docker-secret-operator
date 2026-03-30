package observability

import (
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

var (
	// SecretRequestsTotal tracks total fetch attempts per provider and status
	SecretRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "dso_secret_requests_total",
			Help: "Total number of secret requests received by the agent",
		},
		[]string{"provider", "status"},
	)

	// SecretFetchLatency tracks the time taken to fetch secrets from backends
	SecretFetchLatency = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "dso_secret_fetch_latency_seconds",
			Help:    "Latency of secret fetches from providers",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"provider"},
	)

	// SecretCacheHitsTotal tracks cache efficiency
	SecretCacheHitsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "dso_secret_cache_hits_total",
			Help: "Total number of secret cache hits",
		},
		[]string{"secret"},
	)

	// SecretCacheMissesTotal tracks cache misses
	SecretCacheMissesTotal = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "dso_secret_cache_misses_total",
			Help: "Total number of secret cache misses",
		},
	)

	// BackendFailuresTotal tracks errors per provider
	BackendFailuresTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "dso_backend_failures_total",
			Help: "Total number of provider-specific errors",
		},
		[]string{"provider", "error_type"},
	)
)

// StartMetricsServer starts the Prometheus exporter
func StartMetricsServer(addr string, logger *zap.Logger) {
	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.Handler())

	logger.Info("Starting Prometheus metrics server", zap.String("addr", addr))

	server := &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Error("Metrics server failed", zap.Error(err))
	}
}
