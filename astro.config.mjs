// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse publique du site. Sur GitHub, elle est fournie automatiquement par le déploiement
// (https://maximedvo.github.io aujourd'hui, https://flashup-pro.be une fois le domaine branché).
const SITE_URL = process.env.SITE_URL || 'https://maximedvo.github.io';

export default defineConfig({
  site: SITE_URL,
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
        "connect-src 'self' https://formsubmit.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://formsubmit.co",
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
