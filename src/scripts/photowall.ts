/** Visionneuse plein écran de la galerie photos (flèches, clavier, glisser du doigt). */
type Photo = { src: string; w: number; h: number; alt: string; legende: string };

export function initPhotoWall() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-pwall-dialog]');
  const dataEl = dialog?.querySelector('[data-pwall-data]');
  if (!dialog || !dataEl) return;
  const photos: Photo[] = JSON.parse(dataEl.textContent || '[]');
  if (!photos.length) return;

  const stage = dialog.querySelector<HTMLElement>('[data-pw-stage]')!;
  const title = dialog.querySelector<HTMLElement>('[data-pw-title]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-pw-counter]')!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const render = () => {
    const p = photos[index];
    const wrap = document.createElement('div');
    wrap.className = 'lightbox__single';
    const img = document.createElement('img');
    img.src = p.src;
    img.width = p.w;
    img.height = p.h;
    img.alt = p.alt;
    img.decoding = 'async';
    img.draggable = false;
    wrap.append(img);
    stage.replaceChildren(wrap);
    title.textContent = p.legende;
    title.hidden = !p.legende;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  };

  const go = (delta: number) => {
    index = (index + delta + photos.length) % photos.length;
    render();
  };

  dialog.querySelectorAll<HTMLButtonElement>('[data-pw-prev], [data-pw-next]').forEach((b) => (b.hidden = photos.length < 2));
  dialog.querySelector('[data-pw-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-pw-prev]')!.addEventListener('click', () => go(-1));
  dialog.querySelector('[data-pw-next]')!.addEventListener('click', () => go(1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    stage.replaceChildren();
    opener?.focus();
  });

  // glisser du doigt pour passer d'une photo à l'autre
  let startX: number | null = null;
  stage.addEventListener('pointerdown', (e) => (startX = e.clientX));
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });

  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-pwall-open]');
    if (!trigger) return;
    e.preventDefault();
    index = Math.min(photos.length - 1, Math.max(0, Number(trigger.dataset.pwallOpen) || 0));
    opener = trigger;
    render();
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  });
}
