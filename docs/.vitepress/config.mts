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
            text: 'Getting Started',
            items: [
              { text: 'Introduction', link: '/guide/what-is-dso' },
              { text: 'Installation', link: '/guide/getting-started' },
              { text: 'Concepts', link: '/guide/concepts' }
            ]
          },
          {
            text: 'Providers',
            items: [
              { text: 'AWS', link: '/guide/providers/aws' },
              { text: 'Azure', link: '/guide/providers/azure' },
              { text: 'Huawei', link: '/guide/providers/huawei' },
              { text: 'HashiCorp Vault', link: '/guide/providers/vault' },
              { text: 'Local File', link: '/guide/providers/local' }
            ]
          },
          {
            text: 'Guides',
            items: [
              { text: 'Examples', link: '/guide/examples' },
              { text: 'Security', link: '/guide/security' },
              { text: 'Troubleshooting', link: '/guide/troubleshooting' },
              { text: 'Observability', link: '/guide/observability' },
              { text: 'Architecture', link: '/guide/architecture' }
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
