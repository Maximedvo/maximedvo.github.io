// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://flashup-pro.be',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/contact/merci'),
      changefreq: 'monthly',
    }),
  ],
  security: {
    // Politique de sécurité du contenu (CSP) : Astro calcule les empreintes
    // des scripts et styles internes et les injecte dans chaque page.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://*.googleusercontent.com https://www.googletagmanager.com https://*.google-analytics.com",
        "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
});
