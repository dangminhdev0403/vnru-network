(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const sidebar = qs('#sidebar');
  const overlay = qs('#overlay');
  const menu = qs('#menuBtn');
  const closeMenu = () => { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); };
  menu?.addEventListener('click', () => { sidebar?.classList.toggle('open'); overlay?.classList.toggle('show'); });
  overlay?.addEventListener('click', closeMenu);

  const globalSearch = qs('#globalSearch');
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      globalSearch?.focus();
    }
  });

  const form = qs('#registerForm');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = qs('#registerNote');
    if (note) note.textContent = 'Prototype only — self-registration policy is not finalized. Runtime authentication remains behind Keycloak/OIDC.';
  });

  qs('#googleLogin')?.addEventListener('click', () => {
    const note = qs('#registerNote');
    if (note) note.textContent = 'Google is presented as an identity-provider option through the Keycloak/OIDC boundary; this template does not implement provider credentials.';
  });
})();
