import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: "DSO",
    description: "Native secrets for Docker — without Kubernetes",
    base: '/docs/',
    head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
    ignoreDeadLinks: true,
    themeConfig: {
      logo: '/logo/dso-primary-logo.svg',  // Consistent with landing page
      nav: [
        { text: 'Guide', link: '/guide/what-is-dso' },
        { text: 'Concepts', link: '/guide/concepts' },
        { text: 'CLI', link: '/guide/cli' },
        { text: 'Providers', link: '/guide/providers/aws' }
      ],
      sidebar: {
        '/guide/': [
          {
            text: 'Project',
            items: [
              { text: 'Introduction', link: '/guide/what-is-dso' },
              { text: 'Design Principles', link: '/guide/design-principles' },
              { text: 'When Not to Use', link: '/guide/when-not-to-use' }
            ]
          },
          {
            text: 'Architecture',
            items: [
              { text: 'System Architecture', link: '/guide/architecture' },
              { text: 'Core Concepts', link: '/guide/concepts' },
              { text: 'Security Model', link: '/guide/security' }
            ]
          },
          {
            text: 'Operations',
            items: [
              { text: 'Installation', link: '/guide/installation' },
              { text: 'Production Readiness', link: '/guide/production-readiness' },
              { text: 'Configuration', link: '/guide/configuration' },
              { text: 'Observability', link: '/guide/observability' }
            ]
          },
          {
            text: 'CLI Reference',
            items: [
              { text: 'CLI Overview', link: '/guide/cli' },
              { text: 'CLI: Init', link: '/guide/cli-init' },
              { text: 'CLI: Up', link: '/guide/cli-up' },
              { text: 'CLI: Down', link: '/guide/cli-down' },
              { text: 'CLI: Compose', link: '/guide/cli-compose' },
              { text: 'CLI: Secrets', link: '/guide/cli-secret' },
              { text: 'CLI: Management & Diagnostics', link: '/guide/cli-management' },
              { text: 'CLI: System', link: '/guide/cli-system' }
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'Providers', link: '/guide/providers/aws' },
              { text: 'Examples', link: '/guide/examples' },
              { text: 'Troubleshooting', link: '/guide/troubleshooting' }
            ]
          }
        ]
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/umairmd385/docker-secret-operator' }
      ],
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2026-present DSO Team'
      },
      search: { provider: 'local' }
    }
  })
)
