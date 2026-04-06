import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: "DSO",
    description: "Native secrets for Docker — without Kubernetes",
    base: '/docs/',
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    themeConfig: {
      logo: '/assets/images/logo-transparent.png',  // Ensure this has transparent background
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
              { text: 'Installation', link: '/guide/getting-started' },
              { text: 'Production Readiness', link: '/guide/production-readiness' },
              { text: 'Configuration', link: '/guide/configuration' },
              { text: 'Observability', link: '/guide/observability' }
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'CLI Reference', link: '/guide/cli' },
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
        copyright: 'Copyright © 2024-present DSO Team'
      },
      search: { provider: 'local' }
    }
  })
)
