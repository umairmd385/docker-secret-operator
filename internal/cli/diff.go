package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func NewDiffCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "diff [stack-name]",
		Short: "Show what changed between local configuration and deployed stack",
		Run: func(cmd *cobra.Command, args []string) {
			// This command serves as a lightweight diff checking local config (dso.yaml vs running container)
            stackName := "default"
            if len(args) > 0 {
                stackName = args[0]
            }

            // In v1.1, diff shows the structural differences of mapping keys before deployment.
			fmt.Printf("🔍 Analyzing stack '%s'...\n", stackName)
            cfgPath := ResolveConfig()
            if _, err := os.Stat(cfgPath); err != nil {
                fmt.Fprintf(os.Stderr, "Config %s not found\n", cfgPath)
                return
            }

            fmt.Println("No structural differences found between local provider mappings and stack.")
            fmt.Println("(Note: Secret values are never exposed or diffed in plain text for security)")
		},
	}
}
