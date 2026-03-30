package cli

import (
	"fmt"
	"os"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/spf13/cobra"
)

func NewFetchCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "fetch [secret-name]",
		Short: "Manually fetch a secret and display it",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			cfg, err := config.LoadConfig(ResolveConfig())
			if err != nil {
				fmt.Printf("Error loading config: %v\nTip: Create /etc/dso/dso.yaml or pass --config /path/to/dso.yaml\n", err)
				os.Exit(1)
			}

			socketPath := "/var/run/dso.sock"
			if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
				socketPath = custom
			}

			client, err := injector.NewAgentClient(socketPath)
			if err != nil {
				fmt.Printf("Error connecting to agent: %v\n", err)
				os.Exit(1)
			}

			secretName := args[0]
			data, err := client.FetchSecret(cfg.Provider, cfg.Config, secretName)
			if err != nil {
				fmt.Printf("Error fetching secret: %v\n", err)
				os.Exit(1)
			}

			fmt.Printf("Secret: %s\n", secretName)
			for k, v := range data {
				fmt.Printf("  %s: %s\n", k, v)
			}
		},
	}
}
