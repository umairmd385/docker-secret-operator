package main

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/spf13/cobra"
)

var cfgFile string

// resolveConfig returns the config path to use at command runtime:
// 1. Explicit --config flag value (if user specified it)
// 2. /etc/dso/dso.yaml (system-wide install)
// 3. ./dso.yaml (local development fallback)
func resolveConfig() string {
	// If user explicitly provided a non-default path, honour it
	if cfgFile != "" && cfgFile != "dso.yaml" {
		return cfgFile
	}
	// Auto-detect system-wide config first
	if _, err := os.Stat("/etc/dso/dso.yaml"); err == nil {
		return "/etc/dso/dso.yaml"
	}
	// Fall back to local dso.yaml in working directory
	return "dso.yaml"
}

var rootCmd = &cobra.Command{
	Use:   "dso",
	Short: "Docker Secret Operator (DSO) CLI",
	Long:  `dso fetches and injects secrets into containers dynamically.`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		observability.NewLogger("info", false)
	},
}

func init() {
	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "dso.yaml", "config file (default: /etc/dso/dso.yaml or ./dso.yaml)")
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
