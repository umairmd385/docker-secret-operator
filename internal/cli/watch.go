package cli

import (
	"fmt"
	"os"
	"time"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/spf13/cobra"
)

func NewWatchCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "watch",
		Short: "Real-time monitor of secret rotations and container lifecycles",
		Run: func(cmd *cobra.Command, args []string) {
			socketPath := "/var/run/dso.sock"
			if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
				socketPath = custom
			}

			client, err := injector.NewAgentClient(socketPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error: Could not connect to DSO Agent: %v\n", err)
				os.Exit(1)
			}

			fmt.Println("\033[1;36mDSO Watcher Active\033[0m - Monitoring container lifecycle events...")
			fmt.Println("-------------------------------------------------------------------")

			seen := make(map[string]bool)

			for {
				resp, err := client.GetEvents()
				if err != nil {
					fmt.Fprintf(os.Stderr, "Connection lost: %v. Retrying...\n", err)
					time.Sleep(2 * time.Second)
					client, _ = injector.NewAgentClient(socketPath)
					continue
				}

				// Sort and display new events
				for _, msg := range resp.Data {
					if !seen[msg] {
						fmt.Printf("📡 %s\n", msg)
						seen[msg] = true
					}
				}

				time.Sleep(1 * time.Second)
			}
		},
	}
}
