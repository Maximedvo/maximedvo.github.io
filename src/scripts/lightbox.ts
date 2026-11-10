import { initBeforeAfter } from './before-after';

type Img = { src: string; w: number; h: number } | null;
type Item = {
  id: string;
  titre: string;
  categorie: string;
  vehicule: string;
  description: string;
  placeholder: boolean;
  compare: boolean;
  altBefore: string;
  altAfter: string;
  before: Img;
  after: Img;
  photos: NonNullable<Img>[];
};
type Mode = 'compare' | 'before' | 'after' | `photo-${number}`;

const ICON_MOVE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg>';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

function placeholder(kind: 'before' | 'after') {
  const d = el('div', `placeholder-media${kind === 'after' ? ' placeholder-media--after' : ''}`);
  d.setAttribute('role', 'img');
  d.setAttribute('aria-label', `Emplacement provisoire : photo ${kind === 'before' ? 'avant' : 'après'} à fournir`);
  d.append(
    el('span', 'placeholder-media__title', kind === 'before' ? 'Photo avant' : 'Photo après'),
    el('span', 'placeholder-media__note', 'Emplacement provisoire — photo à fournir'),
  );
  return d;
}

function img(data: NonNullable<Img>, alt: string) {
  const i = el('img');
  i.src = data.src;
  i.width = data.w;
  i.height = data.h;
  i.alt = alt;
  i.decoding = 'async';
  i.draggable = false;
  return i;
}

function buildCompare(item: Item) {
  const root = el('div', 'ba ba--wide');
  root.dataset.ba = '';
  const lb = el('div', 'ba__layer ba__layer--before');
  lb.append(item.before ? img(item.before, item.altBefore) : placeholder('before'));
  const la = el('div', 'ba__layer ba__layer--after');
  la.append(item.after ? img(item.after, item.altAfter) : placeholder('after'));
  const tb = el('span', 'ba__tag ba__tag--before', 'Avant');
  const ta = el('span', 'ba__tag ba__tag--after', 'Après');
  const div = el('div', 'ba__divider');
  const handle = el('div', 'ba__handle');
  handle.setAttribute('role', 'slider');
  handle.tabIndex = 0;
  handle.setAttribute('aria-label', `Comparer avant et après — ${item.titre}`);
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');
  handle.dataset.baHandle = '';
  handle.innerHTML = ICON_MOVE;
  div.append(handle);
  root.append(lb, la, tb, ta, div);
  initBeforeAfter(root);
  return root;
}

function buildSingle(data: Img, alt: string, kind: 'before' | 'after') {
  const wrap = el('div', 'lightbox__single');
  wrap.append(data ? img(data, alt) : placeholder(kind));
  return wrap;
}

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const dataEl = dialog?.querySelector('[data-lightbox-data]');
  if (!dialog || !dataEl) return;
  const items: Item[] = JSON.parse(dataEl.textContent || '[]');
  if (!items.length) return;

  const stage = dialog.querySelector<HTMLElement>('[data-lb-stage]')!;
  const title = dialog.querySelector<HTMLElement>('[data-lb-title]')!;
  const desc = dialog.querySelector<HTMLElement>('[data-lb-desc]')!;
  const meta = dialog.querySelector<HTMLElement>('[data-lb-meta]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lb-counter]')!;
  const thumbs = dialog.querySelector<HTMLElement>('[data-lb-thumbs]')!;
  const modeBtns = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-lb-mode]'));
  const modesGroup = dialog.querySelector<HTMLElement>('[data-lb-modes]')!;
  const initialMode = (item: Item): Mode => (item.compare ? 'compare' : 'after');

  let visible: Item[] = items;
  let index = 0;
  let mode: Mode = 'compare';
  let opener: HTMLElement | null = null;

  const renderStage = () => {
    const item = visible[index];
    stage.replaceChildren();
    if (mode === 'compare') stage.append(buildCompare(item));
    else if (mode === 'before') stage.append(buildSingle(item.before, item.altBefore, 'before'));
    else if (mode === 'after') stage.append(buildSingle(item.after, item.altAfter, 'after'));
    else {
      const p = item.photos[Number(mode.split('-')[1])];
      stage.append(buildSingle(p, `${item.titre} — photo complémentaire`, 'after'));
    }
    modeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lbMode === mode)));
    thumbs.querySelectorAll<HTMLButtonElement>('button:not([data-main])').forEach((b, i) =>
      b.setAttribute('aria-pressed', String(mode === `photo-${i}`)),
    );
    thumbs.querySelector('[data-main]')?.setAttribute('aria-pressed', String(mode === 'after'));
  };

  const render = () => {
    const item = visible[index];
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
    title.textContent = item.titre;
    desc.textContent = item.description;
    desc.hidden = !item.description;
    meta.replaceChildren(el('span', '', item.categorie));
    if (item.vehicule) meta.append(el('span', '', item.vehicule));
    thumbs.replaceChildren();
    if (!item.compare && item.photos.length && item.after) {
      const b = el('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Photo principale');
      b.dataset.main = '1';
      b.append(img(item.after, ''));
      b.addEventListener('click', () => {
        mode = 'after';
        renderStage();
      });
      thumbs.append(b);
    }
    item.photos.forEach((p, i) => {
      const b = el('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Photo complémentaire ${i + 1}`);
      b.append(img(p, ''));
      b.addEventListener('click', () => {
        mode = `photo-${i}`;
        renderStage();
      });
      thumbs.append(b);
    });
    thumbs.hidden = item.photos.length === 0;
    modesGroup.hidden = !item.compare;
    dialog.querySelectorAll<HTMLButtonElement>('[data-lb-prev], [data-lb-next]').forEach((b) => (b.hidden = visible.length < 2));
    renderStage();
  };

  const go = (delta: number) => {
    index = (index + delta + visible.length) % visible.length;
    mode = initialMode(visible[index]);
    render();
  };

  const open = (id: string, trigger: HTMLElement) => {
    // ne parcourir que les réalisations visibles (filtre actif)
    const shown = new Set(
      Array.from(document.querySelectorAll<HTMLElement>('.rcard[data-id]'))
        .filter((c) => !c.hidden && c.offsetParent !== null)
        .map((c) => c.dataset.id),
    );
    visible = items.filter((i) => shown.has(i.id));
    if (!visible.length) visible = items;
    index = Math.max(0, visible.findIndex((i) => i.id === id));
    mode = initialMode(visible[index]);
    opener = trigger;
    render();
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  };

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    stage.replaceChildren();
    opener?.focus();
  });
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')!.addEventListener('click', () => go(-1));
  dialog.querySelector('[data-lb-next]')!.addEventListener('click', () => go(1));
  modeBtns.forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.lbMode as Mode;
      renderStage();
    }),
  );
  dialog.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('[data-ba-handle]')) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  // clic sur le fond = fermeture
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-lightbox-open]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.lightboxOpen!, trigger);
  });
}
