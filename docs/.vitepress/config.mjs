import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Console Apps Documentation',
  description: 'Modern documentation for our console application ecosystem',
  base: '/',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Applications', link: '/apps/' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Architecture', link: '/architecture' }
    ],

    sidebar: {
      '/apps/': [
        {
          text: 'Console Applications',
          items: [
            { text: 'Overview', link: '/apps/' },
            { text: 'Data Ingestion Apps',
              collapsed: false,
              items: [
                { text: 'File Importer', link: '/apps/file-importer' },
                { text: 'API Collector', link: '/apps/api-collector' },
                { text: 'Database Extractor', link: '/apps/db-extractor' }
              ]
            },
            { text: 'Processing Apps',
              collapsed: false,
              items: [
                { text: 'Data Transformer', link: '/apps/data-transformer' },
                { text: 'Validator', link: '/apps/validator' },
                { text: 'Enricher', link: '/apps/enricher' }
              ]
            },
            { text: 'Output Apps',
              collapsed: false,
              items: [
                { text: 'Report Generator', link: '/apps/report-generator' },
                { text: 'File Exporter', link: '/apps/file-exporter' },
                { text: 'Notification Service', link: '/apps/notification-service' }
              ]
            }
          ]
        }
      ],
      '/integrations/': [
        {
          text: 'Integration Patterns',
          items: [
            { text: 'Overview', link: '/integrations/' },
            { text: 'File-based Integration', link: '/integrations/file-based' },
            { text: 'Database Integration', link: '/integrations/database' },
            { text: 'API Integration', link: '/integrations/api' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/awesome-doc' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2025 Console Apps Team'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
