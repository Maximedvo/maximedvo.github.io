/**
 * Catégories de réalisations.
 * Pour ajouter une catégorie : l'ajouter ici ET dans public/admin/config.yml
 * (champ « categorie » de la collection « realisations »).
 */
export const CATEGORIES = {
  'nettoyage-interieur': { label: 'Nettoyage intérieur', icon: 'armchair' },
  'nettoyage-exterieur': { label: 'Nettoyage extérieur', icon: 'droplets' },
  'renovation-interieure': { label: 'Rénovation intérieure', icon: 'spray-can' },
  'renovation-phares': { label: 'Rénovation de phares', icon: 'lightbulb' },
  'renovation-complete': { label: 'Rénovation esthétique complète', icon: 'sparkles' },
  'preparation-revente': { label: 'Préparation avant revente', icon: 'badge-check' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];

export const categoryLabel = (key: string) =>
  (CATEGORIES as Record<string, { label: string }>)[key]?.label ?? key;
