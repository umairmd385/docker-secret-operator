package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/spf13/cobra"
)

func NewExportCmd() *cobra.Command {
	var format, output string
	cmd := &cobra.Command{
		Use:   "export",
		Short: "Export injected secrets for local CI or testing",
		Run: func(cmd *cobra.Command, args []string) {
			cfgPath := ResolveConfig()
			cfg, err := config.LoadConfig(cfgPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Config load failed: %v\n", err)
				os.Exit(1)
			}

            socketPath := "/var/run/dso.sock"
		    if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
			    socketPath = custom
		    }

			client, err := injector.NewAgentClient(socketPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Agent connection failed. Is dso-agent running? error: %v\n", err)
				os.Exit(1)
			}

			injectedEnvs, err := client.FetchAllEnvs(cfg)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Injection failed: %v\n", err)
				os.Exit(1)
			}

            f, err := os.Create(output)
            if err != nil {
                 fmt.Fprintf(os.Stderr, "Failed to create output file %s: %v\n", output, err)
                 os.Exit(1)
            }
            defer f.Close()

            fmt.Fprintln(os.Stderr, "⚠️ WARNING: You are exporting secrets to local disk. Ensure this file is gitignored!")

            for k, v := range injectedEnvs {
                if format == "env" {
                    fmt.Fprintf(f, "%s=%s\n", k, v)
                }
            }
            fmt.Printf("Secrets successfully exported to %s format at: %s\n", format, output)
		},
	}
	cmd.Flags().StringVarP(&format, "format", "f", "env", "Output format (env)")
	cmd.Flags().StringVarP(&output, "output", "o", ".env.local", "Output file destination")
	return cmd
}
