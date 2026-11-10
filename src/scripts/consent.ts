/**
 * Consentement cookies + chargement conditionnel de Google Analytics 4.
 * Le choix est conservé 6 mois dans le navigateur du visiteur.
 */
const KEY = 'flashup-consent';
const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 mois

type Consent = { analytics: boolean; date: string; v: 1 };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    flashupTrack?: (event: string, params?: Record<string, unknown>) => void;
  }
}

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (!c.date || Date.now() - new Date(c.date).getTime() > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

function write(analytics: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, date: new Date().toISOString(), v: 1 }));
  } catch {
    /* stockage indisponible (navigation privée) : le choix vaut pour la page en cours */
  }
}

let gaLoaded = false;
function loadGA(id: string) {
  if (gaLoaded || !/^G-[A-Z0-9]+$/i.test(id)) return;
  gaLoaded = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function disableGA(id: string) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  // supprime les cookies _ga éventuellement déposés
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`;
      });
    }
  });
}

export function initConsent() {
  // Suivi des actions de contact (n'envoie rien si GA n'est pas chargé)
  window.flashupTrack = (event, params = {}) => {
    if (gaLoaded && window.gtag) window.gtag('event', event, params);
  };
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:')) window.flashupTrack?.('click_telephone');
    else if (href.includes('wa.me')) window.flashupTrack?.('click_whatsapp');
    else if (href.startsWith('mailto:')) window.flashupTrack?.('click_email');
  });

  const root = document.querySelector<HTMLElement>('[data-consent]');
  if (!root) return;
  const id = root.dataset.ga || '';
  const prefs = root.querySelector<HTMLElement>('[data-consent-prefs]')!;
  const analyticsBox = root.querySelector<HTMLInputElement>('[data-consent-analytics]')!;
  const btnSave = root.querySelector<HTMLButtonElement>('[data-consent-save]')!;
  const btnCustomize = root.querySelector<HTMLButtonElement>('[data-consent-customize]')!;

  const open = (showPrefs = false) => {
    const current = read();
    analyticsBox.checked = current?.analytics ?? false;
    prefs.hidden = !showPrefs;
    btnSave.hidden = !showPrefs;
    btnCustomize.hidden = showPrefs;
    root.hidden = false;
    document.body.classList.add('consent-open');
  };
  const close = () => {
    root.hidden = true;
    document.body.classList.remove('consent-open');
  };
  const decide = (analytics: boolean) => {
    write(analytics);
    if (analytics) loadGA(id);
    else disableGA(id);
    close();
  };

  root.querySelector('[data-consent-accept]')!.addEventListener('click', () => decide(true));
  root.querySelector('[data-consent-reject]')!.addEventListener('click', () => decide(false));
  btnSave.addEventListener('click', () => decide(analyticsBox.checked));
  btnCustomize.addEventListener('click', () => open(true));
  document.querySelectorAll('[data-consent-open]').forEach((el) => el.addEventListener('click', () => open(true)));

  const existing = read();
  if (existing) {
    if (existing.analytics) loadGA(id);
  } else {
    open(false);
  }
}
