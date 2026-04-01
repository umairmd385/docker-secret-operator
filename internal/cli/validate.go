package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/spf13/cobra"
)

func NewValidateCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "validate",
		Short: "Validate the dso configuration file",
		Run: func(cmd *cobra.Command, args []string) {
			cfgPath := ResolveConfig()
			_, err := config.LoadConfig(cfgPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "❌ Validation failed for %s: %v\n", cfgPath, err)
				os.Exit(1)
			}
			fmt.Printf("✅ Configuration %s is valid.\n", cfgPath)
		},
	}
}
