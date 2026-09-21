(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionToggle = document.querySelector('[data-motion-toggle]');
  const glow = document.querySelector('.pointer-glow');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.progress-rail span');
  let userPaused = false;
  try { userPaused = localStorage.getItem('farooq-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
  const motionIsPaused = () => reducedMotion.matches || userPaused;

  const revealItems = [...document.querySelectorAll('.section-heading, .expertise-card, .project-card, .independent-project, .approach-panel, .experience-row, .credential-card, .quote-card, .award-card, .community-row, .contact-inner')];
  let revealObserver;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
  }
  revealItems.forEach(item => {
    item.dataset.reveal = '';
    if (!motionIsPaused() && revealObserver && item.getBoundingClientRect().top >= window.innerHeight) {
      item.classList.add('reveal-ready');
      revealObserver.observe(item);
    } else {
      item.classList.add('is-revealed');
    }
  });
  document.addEventListener('focusin', event => {
    const item = event.target.closest('.reveal-ready');
    if (item) {
      item.classList.add('is-revealed');
      revealObserver?.unobserve(item);
    }
  });

  const syncMotion = () => {
    const paused = motionIsPaused();
    document.body.classList.toggle('motion-paused', paused);
    if (motionToggle) {
      motionToggle.setAttribute('aria-pressed', String(paused));
      motionToggle.setAttribute('aria-label', reducedMotion.matches ? 'Animations disabled by your reduced motion preference' : paused ? 'Resume animations' : 'Pause animations');
      motionToggle.disabled = reducedMotion.matches;
      motionToggle.innerHTML = `Motion ${paused ? 'off' : 'on'} <span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span>`;
    }
    if (paused) {
      glow?.classList.remove('is-visible');
      revealItems.forEach(item => item.classList.add('is-revealed'));
      revealObserver?.disconnect();
    }
  };
  motionToggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('farooq-motion-paused', String(userPaused)); } catch { /* Preference still works for this visit. */ }
    syncMotion();
  });
  reducedMotion.addEventListener('change', syncMotion);
  syncMotion();

  let scrollFrame = 0;
  const updateScroll = () => {
    const total = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const ratio = Math.min(Math.max(scrollY / total, 0), 1);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('is-scrolled', scrollY > 24);
    scrollFrame = 0;
  };
  const queueScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  };
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', queueScroll));
  updateScroll();

  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  document.addEventListener('pointermove', event => {
    if (!glow || !finePointer.matches || motionIsPaused()) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    glow.classList.add('is-visible');
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      pointerFrame = 0;
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => glow?.classList.remove('is-visible'));
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('is-background', document.hidden));

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
