package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/internal/core"
	"github.com/spf13/cobra"
)

func NewUpCmd() *cobra.Command {
	var composeFile string

	cmd := &cobra.Command{
		Use:   "up",
		Short: "Native Docker Compose integration with dynamic secrets",
		Run: func(cmd *cobra.Command, args []string) {
			if composeFile == "" {
				if _, err := os.Stat("docker-compose.yml"); err == nil {
					composeFile = "docker-compose.yml"
				} else if _, err := os.Stat("docker-compose.yaml"); err == nil {
					composeFile = "docker-compose.yaml"
				} else {
					fmt.Fprintln(os.Stderr, "Error: No docker-compose.yml found.")
					os.Exit(1)
				}
			}

			// Core compose logic: parse, fetch secrets, rewrite and execute
			err := core.RunComposeUp(composeFile, args)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error running up: %v\n", err)
				os.Exit(1)
			}
		},
	}

	cmd.Flags().StringVarP(&composeFile, "file", "f", "", "Specify an alternate compose file")
	return cmd
}
