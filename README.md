# flashup-pro.be

Site vitrine B2B de FlashUp — préparation esthétique automobile, Liège.
Guide utilisateur (mise en ligne, administration, Google) : **[GUIDE.md](GUIDE.md)**.

## Stack

- **Astro 7** (site statique, zéro framework client, ~13 Ko de JavaScript au total)
- **Sveltia CMS** (`/admin/`) — contenus en JSON versionnés dans Git, connexion par jeton GitHub
- **GitHub Pages** — hébergement gratuit, publication automatique (`.github/workflows/deploy.yml`)
- **FormSubmit** — envoi du formulaire de devis par e-mail, sans compte
- Police **Archivo** auto-hébergée (aucun appel à Google Fonts), icônes **Lucide** / **Simple Icons** intégrées à la compilation
- CSP stricte générée par Astro (`security.csp`)

## Structure

```
src/
  content/            Contenus éditables (JSON) — réalisations, avis, offres
  content.config.ts   Schémas de validation des contenus
  data/site.json      Paramètres (coordonnées, Google, analytics, mentions légales)
  assets/uploads/     Images envoyées depuis /admin (optimisées au build)
  assets/brand/       Logo et déclinaisons (scripts/generate-brand-assets.mjs)
  components/         Header, Footer, BeforeAfter, Lightbox, ReviewsBlock, ContactForm…
  layouts/            BaseLayout (SEO, Open Graph, JSON-LD, CSP)
  pages/              Pages ; solutions/[slug].astro génère une page par offre
  scripts/            JS client (comparateur, visionneuse, formulaire, consentement, avis)
  styles/global.css   Design system (couleurs, typo, composants)
public/admin/         Sveltia CMS (index.html + config.yml)
.github/workflows/    deploy.yml (compilation + publication sur GitHub Pages)
```

## Règles de contenu

- Aucune réalisation, aucun avis, aucun prix ni chiffre inventé.
- Sans donnée réelle, les composants affichent un **emplacement provisoire** identifié
  (désactivable via `afficherEmplacementsProvisoires` dans `src/data/site.json`).

## Ajouter une catégorie de réalisations

1. `src/lib/categories.ts` (clé, libellé, icône)
2. `public/admin/config.yml` (options du champ `categorie` et `categoriesRealisations`)
