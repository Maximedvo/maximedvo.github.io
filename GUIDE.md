# FlashUp Pro — Guide de mise en ligne et d'utilisation

Site professionnel de FlashUp (préparation esthétique automobile B2B, Liège), prêt à être publié sur **flashup-pro.be**.

Le site est pensé pour les visiteurs qui arrivent en **scannant le QR code du flyer** (sur mobile, en priorité).
L'accueil se lit dans cet ordre : **qui je suis** (photo, prénom, indépendant) › **FlashUp** (1 an auprès des particuliers,
aujourd'hui ouvert aux pros) › **réalisations et avis mélangés** › **« Vous êtes… ? »** (3 boutons selon le profil) › **contact**.
Tous les textes sont écrits à la première personne (« je »).

---

## 1. Ce que contient le site

| Page | Adresse |
|---|---|
| Accueil | `/` |
| Marchands VO & garages | `/solutions/marchands-vo-garages/` |
| Concessionnaires | `/solutions/concessionnaires/` |
| Flottes & location | `/solutions/flottes-location/` |
| Réalisations (avant / après) | `/realisations/` |
| Avis clients | `/avis/` |
| Contact & devis | `/contact/` (confirmation : `/contact/merci/`) |
| Mentions légales, confidentialité, cookies | `/mentions-legales/`, `/confidentialite/`, `/cookies/` |
| Administration | `/admin/` |

Fonctions incluses : comparateur avant / après (souris, doigt, clavier), visionneuse plein écran, filtres par prestation,
formulaire de devis réel (Netlify Forms) avec anti-spam, bouton WhatsApp flottant, numéros et e-mail cliquables,
avis Google (manuels ou synchronisés), SEO local (titres, descriptions, données structurées, sitemap, Open Graph),
Google Analytics 4 avec bandeau de consentement, en-têtes de sécurité.

---

## 2. Informations à fournir (emplacements provisoires)

Tant que ces éléments manquent, le site affiche des **emplacements provisoires clairement identifiés** (cadres orange en pointillés).

- [ ] **Votre prénom** et **votre photo** (portrait, visage bien visible) — c'est la première chose que voit un visiteur.
- [ ] **Photos de vos réalisations** : avant / après, ou simplement la photo du résultat.
- [ ] **Photos des 3 offres** (facultatif, sinon une illustration est affichée).
- [ ] **Mentions légales** : nom légal / dénomination, forme juridique, responsable, adresse, **numéro BCE**, **numéro de TVA**.
- [ ] **Avis Google** : note moyenne, nombre d'avis et textes des avis (ou synchronisation automatique, voir § 5).
- [ ] **Google Analytics 4** (identifiant `G-…`) et **Search Console** (voir § 6).
- [ ] À confirmer : intervenez-vous sur le site du client, dans vos locaux, ou les deux ? Horaires ? Délai de réponse habituel ?

Tout se complète depuis l'administration (`/admin/`) — aucun code à toucher.
Avant l'ouverture au public, si certaines photos manquent encore, décochez **Paramètres › Afficher les emplacements provisoires** :
les sections concernées se masquent proprement.

---

## 3. Mise en ligne (à faire une seule fois, ~30 minutes)

### a) Déposer le site sur GitHub
1. Créez un compte gratuit sur [github.com](https://github.com).
2. Créez un dépôt **privé** nommé `flashup-pro`.
3. Envoyez-y le contenu de ce dossier (le plus simple : l'application **GitHub Desktop**, ou « Add file › Upload files »).
   Ne pas envoyer les dossiers `node_modules/` et `dist/` (ils sont recréés automatiquement).

### b) Publier avec Netlify
1. Créez un compte sur [netlify.com](https://www.netlify.com) en vous connectant avec GitHub.
2. **Add new project › Import an existing project › GitHub** › choisissez `flashup-pro`.
3. Les réglages sont lus automatiquement depuis `netlify.toml` (commande `npm run build`, dossier `dist`). Cliquez sur **Deploy**.

### c) Activer la réception des demandes de devis par e-mail
1. Netlify › votre projet › **Forms** › **Enable form detection**, puis relancez un déploiement (**Deploys › Trigger deploy**).
2. Le formulaire **devis** apparaît. Allez dans **Forms › Form notifications › Add notification › Email notification**
   et indiquez **flashup.be@gmail.com**.
3. Faites un essai depuis le site : la demande arrive par e-mail et reste consultable dans Netlify (Forms).
   Pensez à vérifier le dossier « spam » lors du premier essai.

### d) Brancher le domaine flashup-pro.be
1. Netlify › **Domain management › Add a domain** › `flashup-pro.be`.
2. Suivez les instructions DNS de Netlify chez votre registrar (là où le domaine a été acheté).
3. Le certificat HTTPS est installé automatiquement. Choisissez `flashup-pro.be` comme domaine principal (le `www` y redirigera).

### e) Activer l'administration (/admin)
1. Sur GitHub : **Settings › Developer settings › OAuth Apps › New OAuth App**
   - Homepage URL : `https://flashup-pro.be`
   - Authorization callback URL : `https://api.netlify.com/auth/done`
2. Copiez le **Client ID** et générez un **Client secret**.
3. Netlify › **Project configuration › Access & security › OAuth › Install provider** › GitHub › collez les deux valeurs.
4. Le dépôt est déjà indiqué dans `public/admin/config.yml` (`Maximedvo/FlashUp-pro`). À modifier seulement si le dépôt change de nom ou de compte.
5. Rendez-vous sur `https://flashup-pro.be/admin/` › **Se connecter avec GitHub**.

---

## 4. Utiliser l'administration

Chaque enregistrement publie le site automatiquement (environ 1 minute).

- **Réalisations › + Réalisation** : titre, type de prestation, véhicule (facultatif), description, **photo APRÈS** (obligatoire),
  **photo AVANT (facultative)**, photos supplémentaires, « Mettre en avant sur la page d'accueil ».
  Avec une photo avant, le site affiche un comparateur avant / après ; sans, il affiche simplement la photo du résultat.
  Les 6 réalisations les plus récentes (mises en avant d'abord) apparaissent sur l'accueil, mélangées avec les 4 derniers avis.
  Les photos sont automatiquement redimensionnées, converties en WebP et chargées à la demande.
- **Avis clients › + Avis** : copiez uniquement de **vrais avis Google** (nom affiché, note, date, texte — sans les modifier).
- **Offres professionnelles** : modifiez textes, prestations, avantages et boutons ; **+ Offre** crée une nouvelle page
  `/solutions/…` et une carte sur l'accueil.
- **Paramètres du site** : **prénom, photo portrait, ancienneté** (« 1 an », à mettre à jour chaque année), téléphone, e-mail,
  WhatsApp et message pré-rempli, Instagram, zone d'intervention, note Google, Google Analytics, Search Console, mentions légales.

**Conseils photos** : même angle et même cadrage avant / après, lumière homogène, format paysage (4:3 idéalement),
fichiers JPG ou PNG de 2000 px de large environ. Floutez les plaques d'immatriculation si nécessaire.

---

## 5. Avis Google

**Option A — manuelle (gratuite, recommandée pour démarrer)** : renseignez la note et le nombre d'avis dans
**Paramètres › Google**, puis ajoutez vos avis dans **Avis clients**. Le bouton « Consulter tous nos avis Google »
renvoie vers votre fiche.

**Option B — synchronisation automatique** (note, nombre d'avis et 5 avis récents mis à jour automatiquement) :
1. Sur [console.cloud.google.com](https://console.cloud.google.com) : créez un projet, activez **Places API (New)**
   (un compte de facturation est exigé par Google, avec un quota mensuel gratuit — vérifiez la grille tarifaire en vigueur).
2. Créez une **clé API** et restreignez-la à « Places API (New) ».
3. Trouvez l'identifiant de votre fiche avec l'outil **Place ID Finder** de Google.
4. Netlify › **Project configuration › Environment variables** : ajoutez `GOOGLE_PLACES_API_KEY` et `GOOGLE_PLACE_ID`.
5. Dans l'administration : **Paramètres › Google › Synchronisation automatique** = oui.

La clé reste côté serveur (fonction `netlify/functions/avis-google.mjs`) ; les réponses sont mises en cache 6 h pour limiter les appels.
Si Google ne répond pas, les avis saisis manuellement restent affichés.

---

## 6. Google Analytics 4 et Search Console

- **GA4** : créez une propriété sur [analytics.google.com](https://analytics.google.com), copiez l'identifiant `G-XXXXXXX`
  dans **Paramètres › Statistiques**. Le bandeau cookies apparaît alors automatiquement : GA4 n'est chargé qu'après accord.
  Événements suivis : `generate_lead` (demande de devis envoyée), `click_telephone`, `click_whatsapp`, `click_email`.
  Dans GA4, réglez la conservation des données sur 14 mois (Admin › Collecte et conservation des données).
- **Search Console** : sur [search.google.com/search-console](https://search.google.com/search-console), ajoutez la propriété
  (méthode DNS recommandée, ou balise HTML : collez le code dans **Paramètres › Statistiques**), puis soumettez le sitemap
  `https://flashup-pro.be/sitemap-index.xml`.
- **Fiche Google Business** : indiquez `https://flashup-pro.be` comme site web.
- **QR code du flyer** : faites pointer le QR code vers `https://flashup-pro.be/?utm_source=flyer&utm_medium=qrcode`
  pour compter dans Google Analytics les visites qui viennent du flyer.
- Le référencement Google reste en place (titres, descriptions, sitemap) mais n'est pas la priorité : le site sert d'abord
  de prolongement au flyer.

---

## 7. Coûts et limites de l'hébergement

Le plan gratuit de Netlify fonctionne avec 300 crédits par mois. Chaque publication (déploiement) coûte environ 15 crédits,
soit une vingtaine de publications par mois ; les envois de formulaire ne consomment pas de crédits. Si le quota est dépassé,
Netlify met le site en pause : surveillez la consommation (Netlify › Usage), regroupez vos ajouts, et passez au plan payant
si vous publiez très souvent.

---

## 8. Pour un développeur

```bash
npm install          # installer les dépendances (Node 22.23+ requis, 24 recommandé)
npm run dev          # site en local sur http://localhost:4321
npm run cms          # (dans un 2e terminal) administration en local sur http://localhost:4321/admin/
npm run build        # version de production dans dist/
```

Voir `README.md` pour l'architecture.
