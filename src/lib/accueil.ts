/**
 * Textes de la page d'accueil, modifiables dans l'administration (« Textes de l'accueil »).
 * Un champ vide reprend le texte d'origine ci-dessous.
 * Repères remplacés automatiquement : {experience} (ancienneté) et {ville}.
 */
import raw from '../data/accueil.json';
import { site } from './site';

const DEFAULTS = {
  presentation: {
    surtitre: 'Préparateur esthétique automobile · {ville}',
    titre: 'Un indépendant motivé pour préparer vos véhicules.',
    texte:
      "Je suis seul derrière FlashUp : c'est moi qui vous réponds, moi qui prépare vos véhicules et moi qui contrôle le résultat. Un seul interlocuteur, et le soin du détail de quelqu'un qui construit sa réputation véhicule après véhicule.",
    sousNom: 'Fondateur de FlashUp · Indépendant',
  },
  entreprise: {
    surtitre: 'FlashUp, mon entreprise',
    titre: "D'abord pour les particuliers. Aujourd'hui pour les pros.",
    texte1:
      "J'ai lancé FlashUp il y a {experience}. Jusqu'ici, je travaillais uniquement pour des particuliers : nettoyage intérieur et extérieur, rénovation, phares… Avec, à chaque fois, le même objectif : rendre un véhicule dont son propriétaire est fier.",
    texte2:
      "Aujourd'hui, j'ouvre FlashUp aux professionnels de l'automobile : marchands VO, garages, concessions, loueurs et gestionnaires de flottes. Même exigence, même motivation, avec l'organisation et la régularité qu'attend un pro.",
  },
  travail: {
    surtitre: 'Mon travail · Vos avis',
    titre: 'Des résultats, et des clients satisfaits.',
    texte:
      "Avant / après, photos de résultats et avis Google. Les avis viennent de mes clients particuliers : la même exigence s'applique à vos véhicules.",
  },
  solutions: {
    surtitre: 'Solutions pros',
    titre: 'Vous êtes… ?',
    texte: 'Choisissez votre profil : je vous explique ce que je peux faire pour vous.',
  },
  contact: {
    surtitre: 'Contact',
    titre: 'Parlons de vos véhicules.',
    texte: 'Un appel, un message WhatsApp ou le formulaire : je vous réponds personnellement.',
  },
};

const fill = (s: string) => s.replaceAll('{experience}', site.experience).replaceAll('{ville}', site.city || 'Liège');
const pick = (v: unknown, fallback: string) => fill(typeof v === 'string' && v.trim() ? v.trim() : fallback);

type Section = keyof typeof DEFAULTS;
const section = <S extends Section>(name: S) => {
  const src = ((raw as Record<string, unknown>)[name] ?? {}) as Record<string, unknown>;
  const def = DEFAULTS[name] as Record<string, string>;
  return Object.fromEntries(Object.keys(def).map((k) => [k, pick(src[k], def[k])])) as (typeof DEFAULTS)[S];
};

const rawPoints = (raw as { entreprise?: { points?: unknown } }).entreprise?.points;
const points = (Array.isArray(rawPoints) ? rawPoints : [])
  .map((p) => (p ?? {}) as Record<string, unknown>)
  .filter((p) => typeof p.titre === 'string' && p.titre.trim())
  .map((p) => ({
    icon: typeof p.icone === 'string' && p.icone ? p.icone : 'check',
    title: fill(String(p.titre).trim()),
    text: typeof p.texte === 'string' ? fill(p.texte.trim()) : '',
  }));

export const accueil = {
  presentation: section('presentation'),
  entreprise: { ...section('entreprise'), points },
  travail: section('travail'),
  solutions: section('solutions'),
  contact: section('contact'),
};
