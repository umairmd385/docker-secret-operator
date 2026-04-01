package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/spf13/cobra"
)

var CfgFile string

func ResolveConfig() string {
	// Priority: Local -> Global
	if _, err := os.Stat("dso.yaml"); err == nil {
		return "dso.yaml"
	}
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
			_, _ = observability.NewLogger("info", false)
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
	cmd.AddCommand(NewDownCmd())
	cmd.AddCommand(NewWatchCmd())
	cmd.AddCommand(NewVersionCmd())
	cmd.AddCommand(NewValidateCmd())
	cmd.AddCommand(NewExportCmd())
	cmd.AddCommand(NewInspectCmd())
	cmd.AddCommand(NewDiffCmd())

	return cmd
}

func Execute() {
	rootCmd := NewRootCmd()

	// Docker CLI plugin fix: strip the plugin name if it's passed as the first argument
	// (Required when called via 'docker dso ...')
	if len(os.Args) > 1 && os.Args[1] == "dso" {
		os.Args = append(os.Args[:1], os.Args[2:]...)
	}

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
