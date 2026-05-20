// docs/.vitepress/config.mts
import { defineConfig } from "file:///sessions/serene-wonderful-keller/mnt/docker-secret-operator/node_modules/vitepress/dist/node/index.js";
import { withMermaid } from "file:///sessions/serene-wonderful-keller/mnt/docker-secret-operator/node_modules/vitepress-plugin-mermaid/dist/vitepress-plugin-mermaid.es.mjs";
var config_default = withMermaid(
  defineConfig({
    title: "DSO",
    description: "Native secrets for Docker \u2014 without Kubernetes",
    base: "/docs/",
    head: [["link", { rel: "icon", href: "/favicon.svg" }]],
    ignoreDeadLinks: true,
    themeConfig: {
      logo: "/logo/dso-primary-logo.svg",
      // Consistent with landing page
      nav: [
        { text: "Guide", link: "/guide/what-is-dso" },
        { text: "Concepts", link: "/guide/concepts" },
        { text: "CLI", link: "/guide/cli" },
        { text: "Providers", link: "/guide/providers/aws" }
      ],
      sidebar: {
        "/guide/": [
          {
            text: "Project",
            items: [
              { text: "Introduction", link: "/guide/what-is-dso" },
              { text: "Design Principles", link: "/guide/design-principles" },
              { text: "When Not to Use", link: "/guide/when-not-to-use" }
            ]
          },
          {
            text: "Architecture",
            items: [
              { text: "System Architecture", link: "/guide/architecture" },
              { text: "Core Concepts", link: "/guide/concepts" },
              { text: "Security Model", link: "/guide/security" }
            ]
          },
          {
            text: "Operations",
            items: [
              { text: "Installation", link: "/guide/installation" },
              { text: "Production Readiness", link: "/guide/production-readiness" },
              { text: "Configuration", link: "/guide/configuration" },
              { text: "Observability", link: "/guide/observability" }
            ]
          },
          {
            text: "CLI Reference",
            items: [
              { text: "CLI Overview", link: "/guide/cli" },
              { text: "CLI: Init", link: "/guide/cli-init" },
              { text: "CLI: Up", link: "/guide/cli-up" },
              { text: "CLI: Down", link: "/guide/cli-down" },
              { text: "CLI: Compose", link: "/guide/cli-compose" },
              { text: "CLI: Secrets", link: "/guide/cli-secret" },
              { text: "CLI: Management & Diagnostics", link: "/guide/cli-management" },
              { text: "CLI: System", link: "/guide/cli-system" }
            ]
          },
          {
            text: "Reference",
            items: [
              { text: "Providers", link: "/guide/providers/aws" },
              { text: "Examples", link: "/guide/examples" },
              { text: "Troubleshooting", link: "/guide/troubleshooting" }
            ]
          }
        ]
      },
      socialLinks: [
        { icon: "github", link: "https://github.com/umairmd385/docker-secret-operator" }
      ],
      footer: {
        message: "Released under the MIT License.",
        copyright: "Copyright \xA9 2026-present DSO Team"
      },
      search: { provider: "local" }
    }
  })
);
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLXdvbmRlcmZ1bC1rZWxsZXIvbW50L2RvY2tlci1zZWNyZXQtb3BlcmF0b3IvZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLXdvbmRlcmZ1bC1rZWxsZXIvbW50L2RvY2tlci1zZWNyZXQtb3BlcmF0b3IvZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3NlcmVuZS13b25kZXJmdWwta2VsbGVyL21udC9kb2NrZXItc2VjcmV0LW9wZXJhdG9yL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuaW1wb3J0IHsgd2l0aE1lcm1haWQgfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLW1lcm1haWQnXG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhNZXJtYWlkKFxuICBkZWZpbmVDb25maWcoe1xuICAgIHRpdGxlOiBcIkRTT1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIk5hdGl2ZSBzZWNyZXRzIGZvciBEb2NrZXIgXHUyMDE0IHdpdGhvdXQgS3ViZXJuZXRlc1wiLFxuICAgIGJhc2U6ICcvZG9jcy8nLFxuICAgIGhlYWQ6IFtbJ2xpbmsnLCB7IHJlbDogJ2ljb24nLCBocmVmOiAnL2Zhdmljb24uc3ZnJyB9XV0sXG4gICAgaWdub3JlRGVhZExpbmtzOiB0cnVlLFxuICAgIHRoZW1lQ29uZmlnOiB7XG4gICAgICBsb2dvOiAnL2xvZ28vZHNvLXByaW1hcnktbG9nby5zdmcnLCAgLy8gQ29uc2lzdGVudCB3aXRoIGxhbmRpbmcgcGFnZVxuICAgICAgbmF2OiBbXG4gICAgICAgIHsgdGV4dDogJ0d1aWRlJywgbGluazogJy9ndWlkZS93aGF0LWlzLWRzbycgfSxcbiAgICAgICAgeyB0ZXh0OiAnQ29uY2VwdHMnLCBsaW5rOiAnL2d1aWRlL2NvbmNlcHRzJyB9LFxuICAgICAgICB7IHRleHQ6ICdDTEknLCBsaW5rOiAnL2d1aWRlL2NsaScgfSxcbiAgICAgICAgeyB0ZXh0OiAnUHJvdmlkZXJzJywgbGluazogJy9ndWlkZS9wcm92aWRlcnMvYXdzJyB9XG4gICAgICBdLFxuICAgICAgc2lkZWJhcjoge1xuICAgICAgICAnL2d1aWRlLyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnUHJvamVjdCcsXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICB7IHRleHQ6ICdJbnRyb2R1Y3Rpb24nLCBsaW5rOiAnL2d1aWRlL3doYXQtaXMtZHNvJyB9LFxuICAgICAgICAgICAgICB7IHRleHQ6ICdEZXNpZ24gUHJpbmNpcGxlcycsIGxpbms6ICcvZ3VpZGUvZGVzaWduLXByaW5jaXBsZXMnIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1doZW4gTm90IHRvIFVzZScsIGxpbms6ICcvZ3VpZGUvd2hlbi1ub3QtdG8tdXNlJyB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnQXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1N5c3RlbSBBcmNoaXRlY3R1cmUnLCBsaW5rOiAnL2d1aWRlL2FyY2hpdGVjdHVyZScgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ29yZSBDb25jZXB0cycsIGxpbms6ICcvZ3VpZGUvY29uY2VwdHMnIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1NlY3VyaXR5IE1vZGVsJywgbGluazogJy9ndWlkZS9zZWN1cml0eScgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ09wZXJhdGlvbnMnLFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnSW5zdGFsbGF0aW9uJywgbGluazogJy9ndWlkZS9pbnN0YWxsYXRpb24nIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1Byb2R1Y3Rpb24gUmVhZGluZXNzJywgbGluazogJy9ndWlkZS9wcm9kdWN0aW9uLXJlYWRpbmVzcycgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ29uZmlndXJhdGlvbicsIGxpbms6ICcvZ3VpZGUvY29uZmlndXJhdGlvbicgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnT2JzZXJ2YWJpbGl0eScsIGxpbms6ICcvZ3VpZGUvb2JzZXJ2YWJpbGl0eScgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0NMSSBSZWZlcmVuY2UnLFxuICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ0xJIE92ZXJ2aWV3JywgbGluazogJy9ndWlkZS9jbGknIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0NMSTogSW5pdCcsIGxpbms6ICcvZ3VpZGUvY2xpLWluaXQnIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0NMSTogVXAnLCBsaW5rOiAnL2d1aWRlL2NsaS11cCcgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ0xJOiBEb3duJywgbGluazogJy9ndWlkZS9jbGktZG93bicgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ0xJOiBDb21wb3NlJywgbGluazogJy9ndWlkZS9jbGktY29tcG9zZScgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnQ0xJOiBTZWNyZXRzJywgbGluazogJy9ndWlkZS9jbGktc2VjcmV0JyB9LFxuICAgICAgICAgICAgICB7IHRleHQ6ICdDTEk6IE1hbmFnZW1lbnQgJiBEaWFnbm9zdGljcycsIGxpbms6ICcvZ3VpZGUvY2xpLW1hbmFnZW1lbnQnIH0sXG4gICAgICAgICAgICAgIHsgdGV4dDogJ0NMSTogU3lzdGVtJywgbGluazogJy9ndWlkZS9jbGktc3lzdGVtJyB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnUmVmZXJlbmNlJyxcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1Byb3ZpZGVycycsIGxpbms6ICcvZ3VpZGUvcHJvdmlkZXJzL2F3cycgfSxcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnRXhhbXBsZXMnLCBsaW5rOiAnL2d1aWRlL2V4YW1wbGVzJyB9LFxuICAgICAgICAgICAgICB7IHRleHQ6ICdUcm91Ymxlc2hvb3RpbmcnLCBsaW5rOiAnL2d1aWRlL3Ryb3VibGVzaG9vdGluZycgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vdW1haXJtZDM4NS9kb2NrZXItc2VjcmV0LW9wZXJhdG9yJyB9XG4gICAgICBdLFxuICAgICAgZm9vdGVyOiB7XG4gICAgICAgIG1lc3NhZ2U6ICdSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuJyxcbiAgICAgICAgY29weXJpZ2h0OiAnQ29weXJpZ2h0IFx1MDBBOSAyMDI2LXByZXNlbnQgRFNPIFRlYW0nXG4gICAgICB9LFxuICAgICAgc2VhcmNoOiB7IHByb3ZpZGVyOiAnbG9jYWwnIH1cbiAgICB9XG4gIH0pXG4pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThZLFNBQVMsb0JBQW9CO0FBQzNhLFNBQVMsbUJBQW1CO0FBRTVCLElBQU8saUJBQVE7QUFBQSxF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
