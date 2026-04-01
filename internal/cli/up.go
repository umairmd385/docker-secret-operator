package cli

import (
	"fmt"
	"os"
	"strings"

	"github.com/docker-secret-operator/dso/internal/core"
	"github.com/spf13/cobra"
)

func NewUpCmd() *cobra.Command {
	return &cobra.Command{
		Use:                "up [args...]",
		Short:              "Native Docker Compose integration with dynamic secrets",
		DisableFlagParsing: true,
		Run: func(cmd *cobra.Command, args []string) {
			composeFile := ""
			configPath := extractConfigFromArgs(os.Args)
			if configPath == "" {
				configPath = ResolveConfig()
			}

			var dockerArgs []string
			skip := false
			dryRun := false
			for i, arg := range args {
				if skip {
					skip = false
					continue
				}
				if arg == "-f" || arg == "--file" || arg == "-cf" {
					if i+1 < len(args) {
						composeFile = args[i+1]
					}
					skip = true
					continue
				}
				if strings.HasPrefix(arg, "--file=") || strings.HasPrefix(arg, "-cf=") {
					composeFile = strings.TrimPrefix(strings.TrimPrefix(arg, "--file="), "-cf=")
					continue
				}
				if arg == "--config" || arg == "-c" {
					skip = true
					continue
				}
				if strings.HasPrefix(arg, "--config=") {
					continue
				}
				if arg == "--dry-run" {
					dryRun = true
					continue
				}
				dockerArgs = append(dockerArgs, arg)
			}

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
			err := core.RunComposeUpWithEnv(composeFile, dockerArgs, configPath, dryRun)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error running up: %v\n", err)
				os.Exit(1)
			}
		},
	}
}
