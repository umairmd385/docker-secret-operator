package cli

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/docker/docker/client"
	"github.com/spf13/cobra"
)

func NewInspectCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "inspect [container-id]",
		Short: "Inspect injected secrets for a running container",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			containerID := args[0]
			cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to connect to Docker daemon: %v\n", err)
				os.Exit(1)
			}
			
			containerInfo, err := cli.ContainerInspect(context.Background(), containerID)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to inspect container %s: %v\n", containerID, err)
				os.Exit(1)
			}

			fmt.Printf("Container Environment Variables for %s (%s):\n", containerInfo.Name, containerID[:12])
			found := false
			for _, envVar := range containerInfo.Config.Env {
				parts := strings.SplitN(envVar, "=", 2)
				if len(parts) == 2 {
                    if isSensitiveMaybe(parts[0]) {
                        fmt.Printf("  %s=******** (Masked)\n", parts[0])
                    } else {
                        fmt.Printf("  %s\n", envVar)
                    }
                    found = true
				}
			}
			if !found {
				fmt.Println("  None found.")
			}
            
            fmt.Println("\nMounted Secret Files (/run/secrets):")
            // A basic check to see if /run/secrets is mapped or if tmpfs handles it.
            // Usually, dso.reloader labels and mount paths dictate this
            hasSecrets := false
            for _, mount := range containerInfo.Mounts {
                if strings.Contains(mount.Destination, "secrets") {
                    fmt.Printf("  Mount: %s -> %s\n", mount.Source, mount.Destination)
                    hasSecrets = true
                }
            }
            if !hasSecrets {
                fmt.Println("  No dedicated secret mounts found.")
            }
		},
	}
}

func isSensitiveMaybe(key string) bool {
    lower := strings.ToLower(key)
    return strings.Contains(lower, "pass") || strings.Contains(lower, "secret") || strings.Contains(lower, "key") || strings.Contains(lower, "token") || strings.Contains(lower, "auth") || strings.Contains(lower, "cred")
}
