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
    if (note) note.textContent = 'Prototype only — runtime authentication uses Auth.js Credentials and backend authorization remains authoritative.';
  });
})();
