(() => {
  'use strict';
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('#mobile-menu');
  const setMenu = (open, returnFocus = false) => {
    if (!menuToggle || !menu) return;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = `${open ? 'Close' : 'Menu'} <span aria-hidden="true">${open ? '−' : '+'}</span>`;
    if (returnFocus) menuToggle.focus();
  };
  menuToggle?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu && !menu.hidden) setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (menu && !menu.hidden && !event.target.closest('.header-inner')) setMenu(false);
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
  const dialog = document.querySelector('[data-award-dialog]');
  const dialogImage = document.querySelector('[data-dialog-image]');
  const dialogTitle = document.querySelector('[data-dialog-title]');
  document.querySelectorAll('.award-open').forEach(button => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage || !dialogTitle) return;
      dialogTitle.textContent = button.dataset.awardTitle;
      dialogImage.src = button.dataset.awardSrc;
      dialogImage.alt = `${button.dataset.awardTitle} certificate awarded to Farooq Halabi`;
      dialog.showModal();
    });
  });
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  const toast = document.querySelector('[data-share-toast]');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
  };
  document.querySelector('[data-share]')?.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]').href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Portfolio link copied.');
    } catch {
      showToast('Copy the link from your browser’s address bar.');
    }
  });
})();
