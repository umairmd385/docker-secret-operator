package main

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/spf13/cobra"
)

var cfgFile string

var rootCmd = &cobra.Command{
	Use:   "dso",
	Short: "Docker Secret Operator (DSO) CLI",
	Long:  `dso fetches and injects secrets into containers dynamically.`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		observability.NewLogger("info", false)
	},
}

func init() {
	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "dso.yaml", "config file (default is dso.yaml)")
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
