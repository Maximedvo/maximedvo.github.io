import raw from '../data/site.json';

/** Valeur provisoire affichée tant qu'une information n'a pas été fournie. */
export const PLACEHOLDER = (label: string) => `[À compléter : ${label}]`;

const toNumber = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export const site = {
  name: text(raw.nom) || 'FlashUp',
  tagline: text(raw.slogan),
  firstName: text(raw.prenom),
  portrait: text(raw.photoPortrait),
  experience: text(raw.experience) || '1 an',
  url: (import.meta.env.SITE || 'https://flashup-pro.be').replace(/\/$/, ''),
  phone: text(raw.telephone),
  phoneHref: `tel:${text(raw.telephoneInternational)}`,
  email: text(raw.email),
  emailHref: `mailto:${text(raw.email)}`,
  whatsappHref: `https://wa.me/${text(raw.whatsapp)}?text=${encodeURIComponent(text(raw.whatsappMessage))}`,
  instagram: text(raw.instagram),
  instagramHref: `https://www.instagram.com/${text(raw.instagram)}/`,
  city: text(raw.ville),
  zone: text(raw.zone),
  towns: (raw.communes ?? []).map(text).filter(Boolean),
  showPlaceholders: raw.afficherEmplacementsProvisoires !== false,
  google: {
    reviewsUrl: text(raw.google?.lienAvis),
    writeReviewUrl: text(raw.google?.lienLaisserAvis),
    rating: toNumber(raw.google?.note),
    count: toNumber(raw.google?.nombreAvis),
    live: raw.google?.synchronisationAutomatique === true,
  },
  analytics: {
    ga4: text(raw.analytics?.ga4),
    searchConsole: text(raw.analytics?.searchConsole),
  },
  legal: {
    denomination: text(raw.legal?.denomination),
    form: text(raw.legal?.formeJuridique),
    manager: text(raw.legal?.responsable),
    address: text(raw.legal?.adresse),
    bce: text(raw.legal?.bce),
    vat: text(raw.legal?.tva),
  },
};

/** Renvoie la valeur ou un repère provisoire clairement identifié. */
export const orPlaceholder = (value: string, label: string) => value || PLACEHOLDER(label);

export const formatRating = (n: number) =>
  n.toLocaleString('fr-BE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatDate = (d: Date) =>
  d.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
