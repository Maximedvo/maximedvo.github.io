# FlashUp Pro — Guide d'utilisation

Site professionnel de FlashUp (préparation esthétique automobile, Liège).

- **Adresse du site** : https://flashup-pro.be (l'ancienne adresse maximedvo.github.io y redirige automatiquement)
- **Administration** : https://flashup-pro.be/admin/
- **Hébergement** : GitHub Pages, gratuit, avec ton compte GitHub (dépôt `Maximedvo/maximedvo.github.io`)

Le site est pensé pour les visiteurs qui arrivent en **scannant le QR code du flyer** (sur mobile, en priorité).
L'accueil se lit dans cet ordre : **qui je suis** › **FlashUp** › **réalisations et avis mélangés** › **« Vous êtes… ? »** › **contact**.

---

## 1. Se connecter à l'administration (une seule fois par appareil)

L'administration utilise un **jeton GitHub** : une sorte de clé personnelle, à créer une fois.

1. Ouvre ce lien (déjà prérempli) :
   https://github.com/settings/tokens/new?scopes=public_repo&description=Administration%20FlashUp
2. **Expiration** : choisis **No expiration**.
3. Descends tout en bas et clique **Generate token**.
4. Copie le code qui commence par `ghp_…`. Garde-le pour toi : ne l'envoie à personne.
5. Va sur **https://flashup-pro.be/admin/**, clique **Se connecter avec un jeton d'accès**, colle le code et valide.

Tu restes connecté sur cet appareil. **Sur ton téléphone** : une fois connecté sur l'ordinateur, le menu de ton profil
(en haut à droite) propose « Se connecter avec un mobile » : un QR code s'affiche, tu le scannes et c'est fait.

Si tu perds le code ou changes d'appareil, refais simplement les étapes 1 à 5.

---

## 2. Modifier le site

Chaque enregistrement publie le site automatiquement, en **1 à 2 minutes**.

- **Réalisations › Nouveau** : titre, type de prestation, véhicule (facultatif), description, **photo APRÈS** (obligatoire),
  **photo AVANT** (facultative : si tu l'ajoutes, le site affiche un comparateur avant / après), photos supplémentaires,
  « Mettre en avant sur la page d'accueil ». Les photos sont automatiquement réduites et converties avant l'envoi.
- **Galerie photos › Mes plus belles photos** : tes plus belles photos, sans avant / après. **Ajouter photo** pour chacune,
  légende facultative ; glisse-les pour changer l'ordre. Les 9 premières s'affichent sur l'accueil, toutes sur la page
  Réalisations. Utilise de préférence les photos d'origine plutôt que des captures d'écran (sinon bandes noires).
- **Vidéo › Ma vidéo « Comment je travaille »** : colle le **lien YouTube** de ta vidéo (le plus simple et le plus fiable ;
  publie-la en « Non répertoriée » si tu veux qu'on ne la trouve que via ton site). Un lien **Instagram / TikTok** fonctionne aussi
  (bouton qui ouvre la vidéo sur la plateforme), ou un **fichier MP4** court (moins de 50 Mo). Choisis le **format** (horizontal ou
  vertical) et, si tu veux, une **image d'aperçu** (sinon la miniature YouTube est reprise automatiquement).
- **Avis clients › Nouveau** : recopie uniquement de **vrais avis Google** (nom affiché, note, date, texte).
- **Offres professionnelles** : textes, prestations et avantages des 3 pages d'offres, ou une nouvelle offre.
- **Textes de l'accueil** : tous les titres et textes de la page d'accueil (présentation, FlashUp, points forts,
  « Vous êtes… ? », contact). Écris `{experience}` pour afficher ton ancienneté et `{ville}` pour « Liège ».
  Un champ laissé vide reprend le texte d'origine.
- **Paramètres du site** : **prénom, photo portrait, ancienneté** (« 1 an », à mettre à jour chaque année), téléphone,
  WhatsApp, Instagram, zone d'intervention, note Google et nombre d'avis, Google Analytics, mentions légales.
  La case **Afficher les emplacements provisoires** masque les cadres orange « à compléter » une fois tes contenus ajoutés.

**Photos** : JPG, PNG ou WebP. Évite le format HEIC de l'iPhone (Réglages › Appareil photo › Formats › **Le plus compatible**).
Floute les plaques d'immatriculation si nécessaire.

Pour tout le reste (design, nouvelles sections, textes des autres pages), demande à Claude.

---

## 3. Recevoir les demandes de devis (à faire une fois)

Le formulaire envoie chaque demande par e-mail à **flashup.be@gmail.com**, via le service gratuit FormSubmit.

1. Une fois le site en ligne, envoie-toi une **demande de test** depuis la page Contact.
2. Tu reçois un e-mail de FormSubmit (pense à regarder dans les spams) : clique **Activate Form**.
3. C'est tout : les demandes suivantes arrivent directement dans ta boîte mail.

---

## 4. Informations encore à compléter

Les éléments manquants s'affichent dans des **cadres orange « Emplacement provisoire »** :

- [ ] Ton **prénom** et ta **photo**.
- [ ] Tes **photos de réalisations**.
- [ ] Les **mentions légales** : nom légal, forme juridique, adresse, **numéro BCE**, **numéro de TVA**.
- [ ] Ta **note Google**, le nombre d'avis et le texte de tes avis.
- [ ] Plus tard : Google Analytics (identifiant `G-…`), si tu veux des statistiques.

---

## 5. Domaine flashup-pro.be (déjà branché, pour mémoire)

1. Sur GitHub : dépôt **maximedvo.github.io › Settings › Pages › Custom domain** : `flashup-pro.be` › **Save**.
2. Chez ton registrar (là où le domaine est acheté), ajoute ces enregistrements DNS :
   - 4 enregistrements **A** pour `flashup-pro.be` : `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 1 enregistrement **CNAME** pour `www` : `maximedvo.github.io`
3. Une fois le domaine validé, coche **Enforce HTTPS** dans la même page GitHub.
4. L'adresse `https://flashup-pro.be` est indiquée dans `astro.config.mjs`, `.github/workflows/deploy.yml` et `public/admin/config.yml`.

**QR code du flyer** : fais-le pointer vers l'adresse finale, avec `?utm_source=flyer&utm_medium=qrcode` à la fin
pour compter les visites venues du flyer dans Google Analytics.

---

## 6. Statistiques (facultatif)

- **Google Analytics 4** : crée une propriété sur analytics.google.com, puis colle l'identifiant `G-XXXXXXX`
  dans **Paramètres › Statistiques**. Un bandeau cookies apparaît alors automatiquement ;
  Analytics n'est chargé qu'après accord du visiteur.
- **Search Console** : colle le code de vérification (balise HTML) dans **Paramètres › Statistiques**,
  puis soumets le sitemap `…/sitemap-index.xml`.

---

## 7. Pour un développeur

```bash
npm install          # Node 22.23+ (24 recommandé)
npm run dev          # site en local sur http://localhost:4321
npm run build        # version de production dans dist/
```

Publication : chaque `push` sur `main` déclenche `.github/workflows/deploy.yml` (compilation Astro + GitHub Pages).
Voir `README.md` pour l'architecture.
