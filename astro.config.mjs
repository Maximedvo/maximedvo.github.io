// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse publique du site (domaine branché sur GitHub Pages).
const SITE_URL = process.env.SITE_URL || 'https://flashup-pro.be';

export default defineConfig({
  site: SITE_URL,
  // miniatures des vidéos YouTube, téléchargées et optimisées à la compilation
  image: { domains: ['i.ytimg.com'] },
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
        // vidéo YouTube (chargée seulement quand le visiteur la lance)
        "frame-src https://www.youtube-nocookie.com",
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
