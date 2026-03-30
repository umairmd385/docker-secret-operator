package cli

import (
	"fmt"
	"github.com/spf13/cobra"
)

func NewMetadataCmd() *cobra.Command {
	return &cobra.Command{
		Use:    "docker-cli-plugin-metadata",
		Short:  "Return Docker CLI plugin metadata",
		Hidden: true,
		Run: func(cmd *cobra.Command, args []string) {
			metadata := `{
  "SchemaVersion": "0.1.0",
  "Vendor": "Umair",
  "Version": "v3.0.0",
  "ShortDescription": "Docker Secret Operator CLI"
}`
			fmt.Println(metadata)
		},
	}
}
