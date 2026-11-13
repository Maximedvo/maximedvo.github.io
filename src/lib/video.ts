/**
 * Vidéo « Comment je travaille », modifiable dans l'administration (« Vidéo »).
 * Sources possibles, par ordre de priorité :
 *  1. un lien YouTube (lecture intégrée, chargée seulement au clic, via youtube-nocookie.com) ;
 *  2. un autre lien (Instagram, TikTok, Facebook…) : bouton qui ouvre la vidéo sur la plateforme ;
 *  3. un fichier vidéo envoyé depuis l'administration (MP4 conseillé).
 */
import type { ImageMetadata } from 'astro';
import raw from '../data/video.json';
import { resolveImage } from './images';
import { site } from './site';

type Raw = {
  afficher?: boolean;
  surtitre?: string;
  titre?: string;
  texte?: string;
  lien?: string;
  fichier?: string;
  format?: string;
  affiche?: string;
};
const data = raw as Raw;
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Fichiers vidéo rangés dans src/assets/uploads (copiés par Vite avec une adresse versionnée). */
const assetVideos = import.meta.glob<string>('/src/assets/uploads/**/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Identifiant YouTube (11 caractères) et format « Shorts » à partir de n'importe quel lien YouTube. */
function parseYouTube(url: string): { id: string; short: boolean } | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id: string | null = null;
  let short = false;
  if (host === 'youtu.be') id = u.pathname.split('/')[1] ?? null;
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, first, second] = u.pathname.split('/');
    if (first === 'watch') id = u.searchParams.get('v');
    else if (first === 'shorts') {
      id = second ?? null;
      short = true;
    } else if (first === 'embed' || first === 'live' || first === 'v') id = second ?? null;
  }
  return id && /^[\w-]{11}$/.test(id) ? { id, short } : null;
}

function platformOf(url: string): string {
  try {
    const h = new URL(url).hostname;
    if (h.includes('instagram')) return 'Instagram';
    if (h.includes('tiktok')) return 'TikTok';
    if (h.includes('facebook') || h.includes('fb.watch')) return 'Facebook';
    if (h.includes('vimeo')) return 'Vimeo';
  } catch {
    /* lien invalide */
  }
  return '';
}

function fileUrl(path: string): { src: string; type: string } | null {
  if (!path) return null;
  const key = path.startsWith('/') ? path : `/${path}`;
  const ext = key.split('.').pop()?.toLowerCase() ?? '';
  const type = ext === 'webm' ? 'video/webm' : ext === 'mov' ? 'video/quicktime' : 'video/mp4';
  if (key.startsWith('/src/')) {
    const src = assetVideos[key];
    return src ? { src, type } : null;
  }
  // fichier rangé dans public/ : servi tel quel (« /uploads/videos/… »)
  return { src: key.replace(/^\/public\//, '/'), type };
}

/** Image d'aperçu : optimisée si elle est dans src/assets, sinon utilisée telle quelle. */
function posterOf(path: string): ImageMetadata | string | undefined {
  if (!path) return undefined;
  return resolveImage(path) ?? (path.startsWith('/src/') ? undefined : path.replace(/^\/public\//, '/'));
}

const lien = text(data.lien);
const yt = lien ? parseYouTube(lien) : null;
const file = fileUrl(text(data.fichier));

type Kind = 'youtube' | 'link' | 'file' | 'placeholder';
const kind: Kind | null = yt ? 'youtube' : lien && /^https?:\/\//.test(lien) ? 'link' : file ? 'file' : site.showPlaceholders ? 'placeholder' : null;

export const video = {
  surtitre: text(data.surtitre) || 'En vidéo',
  titre: text(data.titre) || 'Comment je travaille.',
  texte: text(data.texte),
  kind,
  youtubeId: yt?.id ?? '',
  link: lien,
  platform: platformOf(lien),
  file,
  poster: posterOf(text(data.affiche)),
  vertical: yt?.short === true || data.format === 'vertical',
  /** La section s'affiche si une vidéo est renseignée, ou en emplacement provisoire. */
  visible: data.afficher !== false && kind !== null,
};
