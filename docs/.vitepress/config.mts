import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
  title: "DSO — Docker Secret Operator",
  description: "Native Kubernetes-grade secret management for Docker. Inject secrets from AWS, Azure, Vault directly into containers at runtime.",
  base: '/docs/',
  themeConfig: {
    logo: '/assets/images/dso-logo.png',
    siteTitle: 'DSO Docs',
    nav: [
      { text: 'Guide', link: '/guide/what-is-dso' },
      { text: 'Concepts', link: '/guide/concepts' },
      { text: 'CLI', link: '/guide/cli' },
      { text: 'Providers', link: '/guide/providers/aws' },
      {
        text: 'v3.0.0',
        items: [
          { text: 'Release Notes', link: 'https://github.com/umairmd385/docker-secret-operator/releases' },
          { text: 'Changelog', link: 'https://github.com/umairmd385/docker-secret-operator/blob/main/CHANGELOG.md' }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is DSO?', link: '/guide/what-is-dso' },
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Concepts', link: '/guide/concepts' },
          { text: 'Architecture', link: '/guide/architecture' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'dso.yaml Reference', link: '/guide/configuration' },
          { text: 'Best Practices', link: '/guide/best-practices' }
        ]
      },
      {
        text: 'Providers',
        items: [
          { text: 'AWS Secrets Manager', link: '/guide/providers/aws' },
          { text: 'Azure Key Vault', link: '/guide/providers/azure' },
          { text: 'HashiCorp Vault', link: '/guide/providers/vault' },
          { text: 'Local Files (Dev)', link: '/guide/providers/local' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI Commands', link: '/guide/cli' },
          { text: 'Security Model', link: '/guide/security' },
          { text: 'Observability', link: '/guide/observability' },
          { text: 'Compliance', link: '/guide/compliance' },
          { text: 'Examples', link: '/guide/examples' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/umairmd385/docker-secret-operator' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present DSO Team'
    },
    search: { provider: 'local' },
    editLink: {
      pattern: 'https://github.com/umairmd385/docker-secret-operator/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
)
