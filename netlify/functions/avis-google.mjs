/**
 * Fonction Netlify : avis Google en direct (Google Places API — Place Details « New »).
 *
 * Variables d'environnement à définir dans Netlify (Project configuration › Environment variables) :
 *   GOOGLE_PLACES_API_KEY  clé API Google Cloud (Places API (New) activée, restreinte à cette API)
 *   GOOGLE_PLACE_ID        identifiant de la fiche FlashUp (outil « Place ID Finder » de Google)
 *
 * La clé reste côté serveur : elle n'est jamais exposée aux visiteurs, et aucune
 * donnée de visiteur n'est transmise à Google.
 * Google renvoie au maximum 5 avis (« les plus pertinents »).
 */
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

export default async () => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return json({ error: 'non_configure' }, 503, { 'Cache-Control': 'no-store' });

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr&regionCode=BE`,
      {
        headers: {
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return json({ error: 'google', status: res.status }, 502, { 'Cache-Control': 'no-store' });
    const place = await res.json();

    const reviews = (place.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? 'Client Google',
      authorUrl: r.authorAttribution?.uri ?? '',
      photo: r.authorAttribution?.photoUri ?? '',
      rating: Number(r.rating ?? 0),
      text: r.text?.text ?? r.originalText?.text ?? '',
      date: r.publishTime ?? '',
      relative: r.relativePublishTimeDescription ?? '',
    }));

    return json(
      {
        rating: typeof place.rating === 'number' ? place.rating : null,
        count: typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
        url: place.googleMapsUri ?? '',
        reviews,
      },
      200,
      {
        // courte mise en cache technique pour limiter le nombre d'appels à l'API
        'Cache-Control': 'public, max-age=600',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
      },
    );
  } catch {
    return json({ error: 'indisponible' }, 502, { 'Cache-Control': 'no-store' });
  }
};

export const config = { path: '/api/avis-google' };
