package cli

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"github.com/docker-secret-operator/dso/internal/injector"
	"github.com/docker-secret-operator/dso/pkg/config"
	"github.com/docker-secret-operator/dso/pkg/observability"
	"github.com/spf13/cobra"
)

var CfgFile string

func ResolveConfig() string {
	// Priority: Local -> Global
	if _, err := os.Stat("dso.yaml"); err == nil {
		return "dso.yaml"
	}
	if CfgFile != "" && CfgFile != "dso.yaml" {
		return CfgFile
	}
	if _, err := os.Stat("/etc/dso/dso.yaml"); err == nil {
		return "/etc/dso/dso.yaml"
	}
	return "dso.yaml"
}

func RunComposeUpWithEnv(filename string, extraArgs []string, configPath string) error {
	envMap := make(map[string]string)
	for _, e := range os.Environ() {
		parts := strings.SplitN(e, "=", 2)
		if len(parts) == 2 {
			envMap[parts[0]] = parts[1]
		}
	}

	cfg, err := config.LoadConfig(configPath)
	if err == nil {
		socketPath := "/var/run/dso.sock"
		if custom := os.Getenv("DSO_SOCKET_PATH"); custom != "" {
			socketPath = custom
		}
		client, err := injector.NewAgentClient(socketPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Warning: Agent connection failed (%v). Proceeding without dynamic env injection.\n", err)
		} else {
			injectedEnvs, err := client.FetchAllEnvs(cfg)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error: Injection failed: %v\n", err)
				os.Exit(1)
			}
			for k, v := range injectedEnvs {
				envMap[k] = v
			}
		}
	} else if configPath != "dso.yaml" || (configPath == "dso.yaml" && !os.IsNotExist(err)) {
		fmt.Fprintf(os.Stderr, "Warning: Config load error (%v). Proceeding with host environment.\n", err)
	}

	var finalEnvs []string
	for k, v := range envMap {
		finalEnvs = append(finalEnvs, fmt.Sprintf("%s=%s", k, v))
	}

	dockerPath, err := exec.LookPath("docker")
	if err != nil {
		return fmt.Errorf("docker not found in PATH")
	}

	fullArgs := append([]string{"docker", "compose", "-f", filename, "up"}, extraArgs...)
	fmt.Printf("DSO injected %s securely. Replacing process with docker compose...\n", filename)
	return syscall.Exec(dockerPath, fullArgs, finalEnvs)
}

func NewRootCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "dso",
		Short: "Docker Secret Operator (DSO) CLI",
		Long:  `dso fetches and injects secrets into containers dynamically.`,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			_, _ = observability.NewLogger("info", false)
		},
	}

	cmd.PersistentFlags().StringVarP(&CfgFile, "config", "c", "dso.yaml", "config file (default: /etc/dso/dso.yaml or ./dso.yaml)")

	cmd.AddCommand(NewMetadataCmd())
	cmd.AddCommand(NewComposeCmd())
	cmd.AddCommand(NewFetchCmd())
	cmd.AddCommand(NewInitCmd())
	cmd.AddCommand(NewApplyCmd())
	cmd.AddCommand(NewInjectCmd())
	cmd.AddCommand(NewSyncCmd())
	cmd.AddCommand(NewUpCmd())
	cmd.AddCommand(NewDownCmd())
	cmd.AddCommand(NewVersionCmd())

	return cmd
}

func Execute() {
	rootCmd := NewRootCmd()

	// Docker CLI plugin fix: strip the plugin name if it's passed as the first argument
	// (Required when called via 'docker dso ...')
	if len(os.Args) > 1 && os.Args[1] == "dso" {
		os.Args = append(os.Args[:1], os.Args[2:]...)
	}

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
