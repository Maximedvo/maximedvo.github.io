/**
 * Comparateur avant / après.
 * - glisser n'importe où sur l'image (souris ou doigt) ; le défilement vertical reste possible
 * - clavier : flèches (±2 %, Maj ±10 %), Début / Fin
 */
export function initBeforeAfter(root: HTMLElement) {
  if (root.dataset.baReady) return;
  root.dataset.baReady = '1';
  const handle = root.querySelector<HTMLElement>('[data-ba-handle]');
  let pos = 50;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let decided = false;

  const set = (value: number) => {
    pos = Math.max(0, Math.min(100, value));
    root.style.setProperty('--pos', `${pos}%`);
    if (handle) {
      const rounded = Math.round(pos);
      handle.setAttribute('aria-valuenow', String(rounded));
      handle.setAttribute('aria-valuetext', `${100 - rounded} % de la photo après visible`);
    }
  };

  const fromEvent = (e: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    decided = e.pointerType === 'mouse';
    startX = e.clientX;
    startY = e.clientY;
    if (decided) {
      root.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
      set(fromEvent(e));
    }
  });

  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (!decided) {
      // au doigt : on ne prend la main que si le geste est horizontal
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx < 6 && dy < 6) return;
      if (dy > dx) {
        dragging = false;
        return;
      }
      decided = true;
      root.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
    }
    set(fromEvent(e));
  });

  const end = (e: PointerEvent) => {
    if (dragging && !decided && e.type === 'pointerup') {
      // simple toucher : place le curseur à cet endroit
      set(fromEvent(e));
    }
    dragging = false;
    root.classList.remove('is-dragging');
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);

  handle?.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 2;
    let handled = true;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') set(pos - step);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') set(pos + step);
    else if (e.key === 'Home') set(0);
    else if (e.key === 'End') set(100);
    else handled = false;
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
