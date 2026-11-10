import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './lib/categories';

/** Les champs laissés vides dans l'interface d'administration arrivent parfois en "" : on les traite comme absents. */
const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);
const optionalText = z.preprocess(emptyToUndefined, z.string().optional()).transform((v) => v ?? '');
const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

/**
 * RÉALISATIONS — une réalisation = un fichier JSON dans src/content/realisations/.
 * Les chemins d'images pointent vers src/assets/uploads/realisations/ (ajoutées via /admin).
 */
const realisations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/realisations' }),
  schema: z.object({
    titre: z.string(),
    categorie: z.enum(CATEGORY_KEYS),
    vehicule: optionalText,
    description: optionalText,
    avant: optionalText,
    apres: optionalText,
    photos: z.preprocess((v) => (Array.isArray(v) ? v.filter(Boolean) : []), z.array(z.string())),
    miseEnAvant: z.boolean().optional().default(false),
    date: optionalDate,
    publie: z.boolean().optional().default(true),
  }),
});

/**
 * AVIS — uniquement de vrais avis clients (copiés depuis Google, avec leur date).
 * Ne jamais créer d'avis fictif.
 */
const avis = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/avis' }),
  schema: z.object({
    auteur: z.string(),
    note: z.coerce.number().int().min(1).max(5),
    date: optionalDate,
    texte: z.string(),
    lien: optionalText,
    source: z.string().optional().default('Google'),
    publie: z.boolean().optional().default(true),
  }),
});

/**
 * OFFRES PROFESSIONNELLES — chaque fichier génère une page /solutions/<nom-du-fichier>/
 * et une carte sur la page d'accueil.
 */
const offres = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/offres' }),
  schema: z.object({
    ordre: z.coerce.number().optional().default(10),
    menu: z.string(),
    cible: z.string(),
    resumeCarte: z.string(),
    surtitre: z.string(),
    titre: z.string(),
    introduction: z.string(),
    image: optionalText,
    seoTitre: z.string(),
    seoDescription: z.string(),
    icone: z.string().optional().default('car-front'),
    prestationsTitre: z.string().optional().default('Mes prestations'),
    prestations: z.array(
      z.object({
        titre: z.string(),
        description: optionalText,
        elements: z.preprocess((v) => (Array.isArray(v) ? v.filter(Boolean) : []), z.array(z.string())),
      }),
    ),
    avantagesTitre: z.string().optional().default('Pourquoi travailler avec FlashUp'),
    avantages: z.array(
      z.object({
        titre: z.string(),
        texte: optionalText,
        icone: z.string().optional().default('check'),
      }),
    ),
    cta: z.string(),
    typeEntreprise: optionalText,
    categoriesRealisations: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.enum(CATEGORY_KEYS))),
    publie: z.boolean().optional().default(true),
  }),
});

export const collections = { realisations, avis, offres };
