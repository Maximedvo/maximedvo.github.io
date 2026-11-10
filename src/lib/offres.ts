import { getCollection } from 'astro:content';

export async function getOffres() {
  const offres = await getCollection('offres', ({ data }) => data.publie !== false);
  return offres.sort((a, b) => a.data.ordre - b.data.ordre);
}

export const offreUrl = (id: string) => `/solutions/${id}/`;
