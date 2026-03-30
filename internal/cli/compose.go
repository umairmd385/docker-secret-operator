package cli

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/spf13/cobra"
)

func extractConfigFromArgs(osArgs []string) string {
	for i, arg := range osArgs {
		if arg == "--config" || arg == "-c" {
			if i+1 < len(osArgs) {
				return osArgs[i+1]
			}
		}
		if strings.HasPrefix(arg, "--config=") {
			return strings.TrimPrefix(arg, "--config=")
		}
	}
	return ""
}

func splitEnv(e string) (string, string) {
	for i := 0; i < len(e); i++ {
		if e[i] == '=' {
			return e[:i], e[i+1:]
		}
	}
	return e, ""
}

func NewComposeCmd() *cobra.Command {
	return &cobra.Command{
		Use:                "compose [args...]",
		Short:              "Wrapper around docker compose that injects secrets",
		DisableFlagParsing: true,
		Run: func(cmd *cobra.Command, args []string) {
			configPath := extractConfigFromArgs(os.Args)
			if configPath == "" {
				configPath = ResolveConfig()
			}

			var dockerArgs []string
			skip := false
			for _, arg := range args {
				if skip {
					skip = false
					continue
				}
				if arg == "--config" || arg == "-c" {
					skip = true
					continue
				}
				if strings.HasPrefix(arg, "--config=") {
					continue
				}
				dockerArgs = append(dockerArgs, arg)
			}

			cfg, err := config.LoadConfig(configPath)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error loading config: %v\nTip: Create /etc/dso/dso.yaml or pass --config /path/to/dso.yaml\n", err)
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

			envMap := make(map[string]string)
			for _, e := range os.Environ() {
				k, v := splitEnv(e)
				envMap[k] = v
			}
			for k, v := range injectedEnvs {
				envMap[k] = v
			}

			var finalEnvs []string
			for k, v := range envMap {
				finalEnvs = append(finalEnvs, fmt.Sprintf("%s=%s", k, v))
			}

			dockerPath, err := exec.LookPath("docker")
			if err != nil {
				fmt.Fprintln(os.Stderr, "docker executable not found in PATH")
				os.Exit(1)
			}

			fullArgs := append([]string{"docker", "compose"}, dockerArgs...)
			if err := syscall.Exec(dockerPath, fullArgs, finalEnvs); err != nil {
				fmt.Fprintf(os.Stderr, "Exec failed: %v\n", err)
				os.Exit(1)
			}
		},
	}
}
