/**
 * Formulaire de devis : validation en français, envoi sans rechargement
 * (FormSubmit, réponse JSON), confirmation claire et gestion des erreurs.
 * Sans JavaScript, le formulaire fonctionne aussi (redirection vers /contact/merci/).
 */
const MIN_FILL_MS = 2500; // envoi trop rapide = robot probable

function fieldOf(input: HTMLElement) {
  return input.closest<HTMLElement>('.field');
}

function clearError(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const field = fieldOf(input);
  field?.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  const err = field?.querySelector('.field__error');
  if (err) {
    input.setAttribute(
      'aria-describedby',
      (input.getAttribute('aria-describedby') || '').replace(err.id, '').trim(),
    );
    err.remove();
  }
}

function showError(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  clearError(input);
  const field = fieldOf(input);
  if (!field) return;
  field.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  const p = document.createElement('p');
  p.className = 'field__error';
  p.id = `${input.id}-erreur`;
  p.textContent = input.dataset.error || 'Ce champ est requis.';
  field.append(p);
  input.setAttribute('aria-describedby', `${input.getAttribute('aria-describedby') || ''} ${p.id}`.trim());
}

function toPayload(form: HTMLFormElement) {
  // regroupe les choix multiples (ex. « prestations ») en une seule valeur lisible
  const grouped = new Map<string, string[]>();
  new FormData(form).forEach((value, key) => {
    if (typeof value !== 'string' || key === '_next') return;
    grouped.set(key, [...(grouped.get(key) ?? []), value]);
  });
  const data: Record<string, string> = {};
  grouped.forEach((values, key) => (data[key] = values.filter(Boolean).join(', ')));
  if (data.email) data._replyto = data.email;
  return JSON.stringify(data);
}

export function initContactForms() {
  document.querySelectorAll<HTMLElement>('[data-contact-form-wrap]').forEach((wrap) => {
    const form = wrap.querySelector<HTMLFormElement>('[data-contact-form]');
    if (!form || form.dataset.ready) return;
    form.dataset.ready = '1';
    form.noValidate = true;
    const startedAt = Date.now();

    const success = wrap.querySelector<HTMLElement>('[data-form-success]')!;
    const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
    const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
    const pageField = form.querySelector<HTMLInputElement>('[data-page-field]');
    if (pageField) pageField.value = location.pathname + location.search;

    // Pré-sélection du type d'entreprise via ?type=concessionnaire
    const type = new URLSearchParams(location.search).get('type');
    const select = form.querySelector<HTMLSelectElement>('[data-type-select]');
    if (type && select) {
      const opt = Array.from(select.options).find((o) => o.dataset.key === type);
      if (opt) select.value = opt.value;
    }

    const controls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')).filter(
      (c) => c.type !== 'hidden' && c.type !== 'checkbox' && c.name !== '_honey',
    );
    controls.forEach((c) => {
      c.addEventListener('blur', () => {
        if (c.value && !c.checkValidity()) showError(c);
      });
      c.addEventListener('input', () => {
        if (fieldOf(c)?.classList.contains('is-invalid') && c.checkValidity()) clearError(c);
      });
      c.addEventListener('change', () => {
        if (fieldOf(c)?.classList.contains('is-invalid') && c.checkValidity()) clearError(c);
      });
    });

    const setLoading = (loading: boolean) => {
      submit.disabled = loading;
      submitLabel.textContent = loading ? 'Envoi en cours…' : 'Envoyer ma demande';
      submit.setAttribute('aria-busy', String(loading));
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.hidden = true;

      // nettoyage des espaces superflus
      controls.forEach((c) => {
        if (c instanceof HTMLInputElement || c instanceof HTMLTextAreaElement) c.value = c.value.trim();
      });

      const invalid = controls.filter((c) => !c.checkValidity());
      controls.forEach(clearError);
      if (invalid.length) {
        invalid.forEach(showError);
        invalid[0].focus();
        return;
      }

      const honeypot = form.querySelector<HTMLInputElement>('[name="_honey"]');
      if (honeypot?.value || Date.now() - startedAt < MIN_FILL_MS) {
        // probable robot : on simule un succès sans rien envoyer
        form.hidden = true;
        success.hidden = false;
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(form.dataset.endpoint || form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: toPayload(form),
        });
        const result = (await res.json().catch(() => ({}))) as { success?: string | boolean };
        if (!res.ok || String(result.success) !== 'true') throw new Error(`Envoi refusé (${res.status})`);
        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.flashupTrack?.('generate_lead', { form: 'devis' });
      } catch {
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        setLoading(false);
      }
    });
  });
}
