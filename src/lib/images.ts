import type { ImageMetadata } from 'astro';

/**
 * Toutes les images envoyées depuis l'administration sont stockées dans
 * src/assets/uploads/ et référencées par leur chemin (« /src/assets/uploads/... »).
 * Astro les optimise automatiquement (redimensionnement, WebP, chargement différé).
 */
const uploads = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

export function resolveImage(path?: string | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const clean = path.trim();
  const key = clean.startsWith('/') ? clean : `/${clean}`;
  return uploads[key]?.default;
}
