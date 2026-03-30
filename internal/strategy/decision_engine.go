package strategy

import (
	"fmt"
	"strings"

	"github.com/docker-secret-operator/dso/internal/analyzer"
)

type StrategyDecision struct {
	Strategy string // rolling | restart
	Reason   string
	Score    int
	Report   string // Formatted report string
}

func DecideStrategy(result analyzer.AnalysisResult) StrategyDecision {
	score := 100
	var reasons []string

	if result.HasFixedPortBinding {
		score -= 50
		reasons = append(reasons, "Fixed port binding prevents parallel containers")
	}
	if result.HasContainerName {
		score -= 20
		reasons = append(reasons, "Explicit container name conflicts with parallel scaling")
	}
	if result.HasRestartAlways {
		score -= 20
		reasons = append(reasons, "Restart policy conflicts with rotation engine")
	}
	if !result.HasHealthCheck {
		score -= 10
		reasons = append(reasons, "Lack of health check prevents safe cutover validation")
	}
	if result.IsStateful {
		score -= 20
		reasons = append(reasons, "Stateful workload detected (risk of data corruption during parallel run)")
	}

	decision := StrategyDecision{
		Score: score,
	}

	if score >= 70 {
		decision.Strategy = "rolling"
	} else {
		decision.Strategy = "restart"
	}

	if len(reasons) > 0 {
		decision.Reason = strings.Join(reasons, "\n- ")
	} else {
		decision.Reason = "Stateless, highly available workload"
	}

	// Format Analysis Report
	portStr := "NO"
	if result.HasFixedPortBinding && len(result.FixedPorts) > 0 {
		portStr = fmt.Sprintf("YES (%s)", strings.Join(result.FixedPorts, ", "))
	}
	restartStr := "NO"
	if result.HasRestartAlways {
		restartStr = "ALWAYS"
	}
	statefulStr := "NO"
	if result.IsStateful {
		statefulStr = "YES"
	}
	healthStr := "NO"
	if result.HasHealthCheck {
		healthStr = "YES"
	}

	analyzerLog := fmt.Sprintf("\033[1;36m[DSO ANALYZER]\033[0m\nContainer: %s\n- Fixed Port: %s\n- Restart Policy: %s\n- Stateful: %s\n- Health Check: %s", 
		result.ContainerName, portStr, restartStr, statefulStr, healthStr)

	strategyLog := fmt.Sprintf("\033[1;36m[DSO STRATEGY]\033[0m\nSelected: %s\nScore: %d\nReason:\n- %s", 
		decision.Strategy, decision.Score, decision.Reason)

	decision.Report = analyzerLog + "\n\n" + strategyLog

	return decision
}
