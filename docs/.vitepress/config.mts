import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DSO",
  description: "Native secrets for Docker — without Kubernetes",
  base: '/docs/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/images/dso-logo.png',
    nav: [
      { text: 'Guide', link: '/guide/what-is-dso' },
      { text: 'CLI', link: '/guide/cli' },
      { text: 'Providers', link: '/guide/providers/' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is DSO?', link: '/guide/what-is-dso' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'dso.yaml Schema', link: '/guide/configuration' }
        ]
      },
      {
        text: 'Providers',
        items: [
          { text: 'AWS Secrets Manager', link: '/guide/providers/aws' },
          { text: 'Azure Key Vault', link: '/guide/providers/azure' },
          { text: 'HashiCorp Vault', link: '/guide/providers/vault' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI Commands', link: '/guide/cli' },
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

    search: {
      provider: 'local'
    }
  },
  dark: true
})
