import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES, CATEGORY_KEYS, categoryLabel, type CategoryKey } from './categories';
import { resolveImage } from './images';
import { site } from './site';

export interface Realisation {
  id: string;
  titre: string;
  categorie: CategoryKey;
  categorieLabel: string;
  vehicule: string;
  description: string;
  /** Photo « avant » : si absente, la réalisation s'affiche en photo simple (résultat seul). */
  before?: ImageMetadata;
  /** Photo du résultat (« après »). */
  after?: ImageMetadata;
  photos: ImageMetadata[];
  /** true = comparateur avant / après ; false = photo du résultat seule */
  compare: boolean;
  featured: boolean;
  date?: Date;
  placeholder: boolean;
}

/** Réalisations publiées, mises en avant d'abord puis les plus récentes. */
export async function getRealisations(): Promise<Realisation[]> {
  const entries = await getCollection('realisations', ({ data }) => data.publie !== false);
  return entries
    .map((e) => {
      const before = resolveImage(e.data.avant);
      const after = resolveImage(e.data.apres);
      const compare = Boolean(before && after);
      return {
        id: e.id,
        titre: e.data.titre,
        categorie: e.data.categorie,
        categorieLabel: categoryLabel(e.data.categorie),
        vehicule: e.data.vehicule,
        description: e.data.description,
        before: compare ? before : undefined,
        // une seule photo fournie : elle est affichée comme résultat
        after: after ?? before,
        photos: e.data.photos.map((p) => resolveImage(p)).filter((p): p is ImageMetadata => Boolean(p)),
        compare,
        featured: e.data.miseEnAvant,
        date: e.data.date,
        placeholder: false,
      };
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0);
    });
}

/** Emplacement provisoire clairement identifié (aucune réalisation inventée). */
export function placeholderFor(categorie: CategoryKey, compare = true): Realisation {
  return {
    id: `emplacement-${categorie}-${compare ? 'comparaison' : 'photo'}`,
    titre: 'Réalisation à venir',
    categorie,
    categorieLabel: CATEGORIES[categorie].label,
    vehicule: '',
    description: compare
      ? 'Emplacement provisoire : ajoutez une réalisation avec photos avant / après depuis l’administration.'
      : 'Emplacement provisoire : ajoutez une photo du résultat depuis l’administration.',
    photos: [],
    compare,
    featured: false,
    placeholder: true,
  };
}

/**
 * Affiche des emplacements provisoires tant qu'aucune vraie réalisation n'existe
 * (uniquement si l'option « afficher les emplacements provisoires » est active).
 * Dès la première vraie réalisation, seules les vraies sont affichées.
 * Alterne comparateurs avant / après et photos « après » seules.
 */
export function withPlaceholders(items: Realisation[], categories: CategoryKey[], min: number): Realisation[] {
  if (!site.showPlaceholders || items.length > 0) return items;
  const out = [...items];
  let i = 0;
  for (const cat of categories.length ? categories : CATEGORY_KEYS) {
    if (out.length >= min) break;
    if (!out.some((r) => r.categorie === cat)) out.push(placeholderFor(cat, i++ % 2 === 0));
  }
  return out;
}

export const altFor = (r: Realisation, moment: 'avant' | 'après') =>
  `${r.categorieLabel}${r.vehicule ? ` — ${r.vehicule}` : ''} : ${moment} intervention FlashUp`;
