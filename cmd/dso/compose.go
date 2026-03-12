package main

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"

	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/injector"
	"github.com/spf13/cobra"
)

var composeCmd = &cobra.Command{
	Use:   "compose [args...]",
	Short: "Wrapper around docker compose that injects secrets",
	Run: func(cmd *cobra.Command, args []string) {
		cfg, err := config.LoadConfig(cfgFile)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
			os.Exit(1)
		}

		socketPath := "/var/run/dso.sock"
		if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
			socketPath = custom
		}

		client, err := injector.NewAgentClient(socketPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Agent connection failed. Is dso-agent running? Error: %v\n", err)
			os.Exit(1)
		}

		injectedEnvs, err := client.FetchAllEnvs(cfg)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error fetching secrets: %v\n", err)
			os.Exit(1)
		}

		// Prepare ENV slice
		envMap := make(map[string]string)
		for _, e := range os.Environ() {
			k, v := splitEnv(e)
			envMap[k] = v
		}
		// Overlay secrets
		for k, v := range injectedEnvs {
			envMap[k] = v
		}

		var finalEnvs []string
		for k, v := range envMap {
			finalEnvs = append(finalEnvs, fmt.Sprintf("%s=%s", k, v))
		}

		// Look for docker
		dockerPath, err := exec.LookPath("docker")
		if err != nil {
			fmt.Fprintln(os.Stderr, "docker executable not found")
			os.Exit(1)
		}

		// Prepare args: docker compose [args...]
		dockerArgs := append([]string{"docker", "compose"}, args...)
		
		if err := syscall.Exec(dockerPath, dockerArgs, finalEnvs); err != nil {
			fmt.Fprintf(os.Stderr, "Exec failed: %v\n", err)
			os.Exit(1)
		}
	},
}

func splitEnv(e string) (string, string) {
	for i := 0; i < len(e); i++ {
		if e[i] == '=' {
			return e[:i], e[i+1:]
		}
	}
	return e, ""
}

func init() {
	rootCmd.AddCommand(composeCmd)
}
