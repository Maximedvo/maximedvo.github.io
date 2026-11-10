/** Comportements communs : en-tête, menus, apparitions discrètes. */

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = header.querySelector<HTMLElement>('[data-menu]');
  if (toggle && menu) {
    const setOpen = (open: boolean) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.hidden = !open;
      header.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (mq) => {
      if (mq.matches) setOpen(false);
    });
  }

  // Menu déroulant « Solutions »
  header.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((dd) => {
    const btn = dd.querySelector<HTMLButtonElement>('[data-dropdown-toggle]')!;
    const setOpen = (open: boolean) => {
      dd.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(!dd.classList.contains('is-open')));
    dd.addEventListener('mouseenter', () => btn.setAttribute('aria-expanded', 'true'));
    dd.addEventListener('mouseleave', () => setOpen(false));
    dd.addEventListener('focusout', (e) => {
      if (!dd.contains(e.relatedTarget as Node)) setOpen(false);
    });
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.focus();
      }
    });
  });
}

/** Apparition au défilement — seulement pour les éléments hors écran au chargement (pas de flash). */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const vh = window.innerHeight;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('reveal-in');
        el.classList.remove('reveal-pending');
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > vh * 0.92) {
      el.classList.add('reveal-pending');
      io.observe(el);
    }
  });
}

initHeader();
initReveal();
