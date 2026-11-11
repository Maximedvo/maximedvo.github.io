/**
 * Galerie photos : les plus belles photos, sans avant / après obligatoire.
 * Modifiable dans l'administration (« Galerie photos »).
 */
import type { ImageMetadata } from 'astro';
import raw from '../data/galerie.json';
import { resolveImage } from './images';
import { site } from './site';

type Raw = {
  surtitre?: string;
  titre?: string;
  texte?: string;
  afficherAccueil?: boolean;
  photos?: { photo?: string; legende?: string }[];
};
const data = raw as Raw;
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export type GalleryPhoto = { image: ImageMetadata; legende: string; alt: string };

const photos: GalleryPhoto[] = (Array.isArray(data.photos) ? data.photos : [])
  .map((p) => ({ image: resolveImage(p?.photo), legende: text(p?.legende) }))
  .filter((p): p is { image: ImageMetadata; legende: string } => Boolean(p.image))
  .map((p, i) => ({ ...p, alt: p.legende || `Réalisation FlashUp à ${site.city || 'Liège'} — photo ${i + 1}` }));

export const galerie = {
  surtitre: text(data.surtitre) || 'Galerie',
  titre: text(data.titre) || 'Mes plus belles réalisations.',
  texte: text(data.texte),
  surAccueil: data.afficherAccueil !== false,
  photos,
  /** La galerie s'affiche s'il y a des photos, ou des emplacements provisoires en attendant. */
  visible: photos.length > 0 || site.showPlaceholders,
};
