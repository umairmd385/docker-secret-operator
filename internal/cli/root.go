package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/spf13/cobra"
)

var CfgFile string

func ResolveConfig() string {
	if CfgFile != "" && CfgFile != "dso.yaml" {
		return CfgFile
	}
	if _, err := os.Stat("/etc/dso/dso.yaml"); err == nil {
		return "/etc/dso/dso.yaml"
	}
	return "dso.yaml"
}

func NewRootCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "dso",
		Short: "Docker Secret Operator (DSO) CLI",
		Long:  `dso fetches and injects secrets into containers dynamically.`,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			observability.NewLogger("info", false)
		},
	}

	cmd.PersistentFlags().StringVarP(&CfgFile, "config", "c", "dso.yaml", "config file (default: /etc/dso/dso.yaml or ./dso.yaml)")

	cmd.AddCommand(NewMetadataCmd())
	cmd.AddCommand(NewComposeCmd())
	cmd.AddCommand(NewFetchCmd())
	cmd.AddCommand(NewInitCmd())
	cmd.AddCommand(NewApplyCmd())
	cmd.AddCommand(NewInjectCmd())
	cmd.AddCommand(NewSyncCmd())
	cmd.AddCommand(NewUpCmd())
	cmd.AddCommand(NewVersionCmd())

	return cmd
}

func Execute() {
	if err := NewRootCmd().Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
