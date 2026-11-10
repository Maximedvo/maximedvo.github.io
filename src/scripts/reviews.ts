/**
 * Synchronisation automatique des avis Google (optionnelle).
 * Interroge /api/avis-google (fonction serveur optionnelle, absente sur GitHub Pages). En cas d'échec,
 * les avis saisis dans l'administration restent affichés.
 */
type LiveReview = {
  author: string;
  authorUrl: string;
  photo: string;
  rating: number;
  text: string;
  date: string;
  relative: string;
};
type LiveData = { rating: number | null; count: number | null; url: string; reviews: LiveReview[] };

const STAR =
  'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';
const GOOGLE =
  'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z';

const NS = 'http://www.w3.org/2000/svg';
let uid = 0;

function stars(rating: number, large = false) {
  const wrap = document.createElement('span');
  wrap.className = `stars${large ? ' stars--lg' : ''}`;
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', `${rating.toLocaleString('fr-BE')} sur 5`);
  for (let i = 0; i < 5; i++) {
    const diff = rating - i;
    const kind = diff >= 0.75 ? 'full' : diff >= 0.25 ? 'half' : 'empty';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const outline = document.createElementNS(NS, 'path');
    outline.setAttribute('d', STAR);
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', 'currentColor');
    outline.setAttribute('stroke-width', '1.6');
    if (kind === 'empty') outline.setAttribute('class', 'star--empty');
    svg.append(outline);
    if (kind !== 'empty') {
      const fill = document.createElementNS(NS, 'path');
      fill.setAttribute('d', STAR);
      fill.setAttribute('fill', 'currentColor');
      if (kind === 'half') {
        const id = `lh-${uid++}`;
        const defs = document.createElementNS(NS, 'defs');
        const cp = document.createElementNS(NS, 'clipPath');
        cp.setAttribute('id', id);
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('width', '12');
        rect.setAttribute('height', '24');
        cp.append(rect);
        defs.append(cp);
        svg.prepend(defs);
        fill.setAttribute('clip-path', `url(#${id})`);
      }
      svg.append(fill);
    }
    wrap.append(svg);
  }
  return wrap;
}

function googleIcon(size = 14) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', GOOGLE);
  svg.append(p);
  return svg;
}

function card(r: LiveReview, clamp: boolean, quote = false) {
  const a = document.createElement('article');
  a.className = `review${clamp ? ' review--clamp' : ''}${quote ? ' review--quote' : ''}`;
  a.dataset.feedReview = '';
  const top = document.createElement('div');
  top.className = 'review__top';
  const src = document.createElement('span');
  src.className = 'review__source';
  src.append(googleIcon(), ' Google');
  top.append(stars(r.rating), src);

  const text = document.createElement('p');
  text.className = 'review__text';
  text.textContent = r.text;

  const author = document.createElement('div');
  author.className = 'review__author';
  const avatar = document.createElement('span');
  avatar.className = 'review__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  if (r.photo && /^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\//i.test(r.photo)) {
    const img = document.createElement('img');
    img.src = r.photo;
    img.alt = '';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    avatar.append(img);
  } else {
    avatar.textContent = (r.author || '?').charAt(0).toUpperCase();
  }
  const who = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'review__name';
  if (r.authorUrl && /^https:\/\/(www\.)?google\./i.test(r.authorUrl)) {
    const link = document.createElement('a');
    link.href = r.authorUrl;
    link.target = '_blank';
    link.rel = 'noopener nofollow';
    link.textContent = r.author;
    name.append(link);
  } else {
    name.textContent = r.author;
  }
  who.append(name);
  if (r.date) {
    const t = document.createElement('time');
    t.className = 'review__date';
    t.dateTime = r.date;
    t.textContent = new Date(r.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
    who.append(t);
  } else if (r.relative) {
    const t = document.createElement('span');
    t.className = 'review__date';
    t.textContent = r.relative;
    who.append(t);
  }
  author.append(avatar, who);
  a.append(top, text, author);
  return a;
}

let cache: Promise<LiveData | null> | null = null;
const load = () =>
  (cache ??= fetch('/api/avis-google', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? (r.json() as Promise<LiveData>) : null))
    .catch(() => null));

/** Fil « réalisations + avis » de l'accueil : remplace les cartes d'avis par les avis Google en direct. */
export function initLiveFeed() {
  document.querySelectorAll<HTMLElement>('[data-feed][data-live]').forEach(async (feed) => {
    const data = await load();
    if (!data?.reviews?.length) return;
    const slots = Array.from(feed.querySelectorAll<HTMLElement>('[data-feed-review]'));
    slots.forEach((slot, i) => {
      const r = data.reviews[i];
      if (r) slot.replaceWith(card(r, true, true));
      else if (slot.classList.contains('review--placeholder')) slot.remove();
    });
  });
}

export function initLiveReviews() {
  document.querySelectorAll<HTMLElement>('[data-reviews][data-live]').forEach(async (block) => {
    const data = await load();
    if (!data || (!data.reviews?.length && data.rating === null)) return;
    const limit = Number(block.dataset.limit) || undefined;
    const clamp = block.dataset.clamp === '1';

    if (data.rating !== null) {
      const summary = block.querySelector<HTMLElement>('[data-reviews-summary]')!;
      const actions = summary.querySelector('.rating-summary__actions');
      const score = document.createElement('span');
      score.className = 'rating-summary__score';
      score.textContent = data.rating.toLocaleString('fr-BE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const detail = document.createElement('div');
      detail.className = 'rating-summary__detail';
      const count = document.createElement('span');
      count.className = 'rating-summary__count';
      const badge = document.createElement('span');
      badge.className = 'google-badge';
      badge.append(googleIcon(16), ' Google');
      count.append(badge);
      if (data.count !== null) count.append(` · ${data.count} avis`);
      detail.append(stars(data.rating, true), count);
      summary.replaceChildren(score, detail, ...(actions ? [actions] : []));
    }
    if (data.reviews?.length) {
      const list = block.querySelector<HTMLElement>('[data-reviews-list]')!;
      const items = limit ? data.reviews.slice(0, limit) : data.reviews;
      list.replaceChildren(...items.map((r) => card(r, clamp)));
      block.querySelector<HTMLElement>('[data-reviews-attribution]')!.hidden = false;
    }
  });
}
