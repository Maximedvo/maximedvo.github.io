import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? '/').replace(/\/$/, '');
  return new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin/', 'Disallow: /contact/merci/', '', `Sitemap: ${base}/sitemap-index.xml`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
