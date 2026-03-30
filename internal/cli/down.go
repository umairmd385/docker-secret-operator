package cli

import (
	"fmt"
	"os"
	"os/exec"
	"github.com/spf13/cobra"
)

func NewDownCmd() *cobra.Command {
	return &cobra.Command{
		Use:                "down [args...]",
		Short:              "Stop and remove containers, networks, images, and volumes",
		DisableFlagParsing: true,
		Run: func(cmd *cobra.Command, args []string) {
			dockerPath, err := exec.LookPath("docker")
			if err != nil {
				fmt.Fprintln(os.Stderr, "docker executable not found in PATH")
				os.Exit(1)
			}

			fullArgs := append([]string{"compose", "down"}, args...)
			
			child := exec.Command(dockerPath, fullArgs...)
			child.Stdout = os.Stdout
			child.Stderr = os.Stderr
			child.Stdin = os.Stdin
			
			if err := child.Run(); err != nil {
				fmt.Fprintf(os.Stderr, "Error running down: %v\n", err)
				os.Exit(1)
			}
		},
	}
}
