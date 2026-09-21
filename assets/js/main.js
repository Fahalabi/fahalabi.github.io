(() => {
  'use strict';

  document.documentElement.classList.add('has-js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.progress-rail span');
  const revealItems = [...document.querySelectorAll('.reveal')];
  const effectItems = [...document.querySelectorAll('[data-tilt], [data-spotlight], [data-magnetic]')];
  const pointerUpdates = new Map();
  let animationFrame = 0;
  let scrollPending = true;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const pointerEffectsEnabled = () => finePointer.matches && !reducedMotion.matches;

  // Scroll and pointer updates share a frame, keeping event handlers lightweight.
  const renderFrame = () => {
    animationFrame = 0;
    if (scrollPending) {
      const distance = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const ratio = clamp(window.scrollY / distance, 0, 1);
      if (progress) progress.style.transform = `scaleX(${ratio})`;
      header?.classList.toggle('is-scrolled', window.scrollY > 24);
      scrollPending = false;
    }

    if (pointerEffectsEnabled()) {
      pointerUpdates.forEach(({ x, y }, element) => {
        const bounds = element.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const localX = clamp(x - bounds.left, 0, bounds.width);
        const localY = clamp(y - bounds.top, 0, bounds.height);
        const relativeX = clamp((localX / bounds.width - 0.5) * 2, -1, 1);
        const relativeY = clamp((localY / bounds.height - 0.5) * 2, -1, 1);

        if (element.hasAttribute('data-spotlight')) {
          element.style.setProperty('--mx', `${localX.toFixed(1)}px`);
          element.style.setProperty('--my', `${localY.toFixed(1)}px`);
        }
        if (element.hasAttribute('data-tilt')) {
          element.style.setProperty('--rx', `${(-relativeY * 2.4).toFixed(2)}deg`);
          element.style.setProperty('--ry', `${(relativeX * 2.4).toFixed(2)}deg`);
        }
        if (element.hasAttribute('data-magnetic')) {
          element.style.setProperty('--mag-x', `${(relativeX * 4).toFixed(2)}px`);
          element.style.setProperty('--mag-y', `${(relativeY * 4).toFixed(2)}px`);
        }
      });
    }
    pointerUpdates.clear();
  };
  const queueFrame = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(renderFrame);
  };
  const queueScroll = () => {
    scrollPending = true;
    queueFrame();
  };

  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  window.addEventListener('load', queueScroll, { once: true });
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', queueScroll));
  document.fonts?.ready.then(queueScroll);
  renderFrame();

  const resetEffect = element => {
    pointerUpdates.delete(element);
    ['--mx', '--my', '--rx', '--ry', '--mag-x', '--mag-y'].forEach(property => {
      element.style.removeProperty(property);
    });
  };
  effectItems.forEach(element => {
    element.addEventListener('pointermove', event => {
      if (!pointerEffectsEnabled() || event.pointerType === 'touch') return;
      pointerUpdates.set(element, { x: event.clientX, y: event.clientY });
      queueFrame();
    }, { passive: true });
    element.addEventListener('pointerleave', () => resetEffect(element));
    element.addEventListener('pointercancel', () => resetEffect(element));
  });
  window.addEventListener('blur', () => effectItems.forEach(resetEffect));

  let revealObserver;
  const reveal = element => {
    element.classList.add('is-in');
    revealObserver?.unobserve(element);
  };
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });
  }
  revealItems.forEach(element => {
    const isBelowFold = element.getBoundingClientRect().top >= window.innerHeight;
    const containsFocus = element.contains(document.activeElement);
    if (revealObserver && isBelowFold && !containsFocus) {
      element.classList.add('reveal-ready');
      revealObserver.observe(element);
    } else {
      reveal(element);
    }
  });
  document.addEventListener('focusin', event => {
    let element = event.target.closest('.reveal');
    while (element) {
      reveal(element);
      element = element.parentElement?.closest('.reveal');
    }
  });
  const updateMotionPreferences = () => {
    if (!pointerEffectsEnabled()) effectItems.forEach(resetEffect);
    if (reducedMotion.matches) {
      revealItems.forEach(reveal);
      revealObserver?.disconnect();
    }
  };
  reducedMotion.addEventListener('change', updateMotionPreferences);
  finePointer.addEventListener('change', updateMotionPreferences);

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuLabel = document.querySelector('[data-menu-label]');
  const menu = document.querySelector('#mobile-menu');
  const desktopMenu = window.matchMedia('(min-width: 801px)');
  const setMenu = (open, returnFocus = false) => {
    if (!menuToggle || !menu) return;
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
    if (returnFocus) menuToggle.focus();
    queueScroll();
  };
  menuToggle?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu && !menu.hidden) setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (menu && !menu.hidden && !menu.contains(event.target) && !menuToggle?.contains(event.target)) {
      setMenu(false);
    }
  });
  desktopMenu.addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
  setMenu(false);

  const quotePanels = [...document.querySelectorAll('[data-quote]')];
  const quotePrevious = document.querySelector('[data-quote-prev]');
  const quoteNext = document.querySelector('[data-quote-next]');
  const quoteCount = document.querySelector('[data-quote-count]');
  const quoteRegion = document.querySelector('[data-quotes]');
  const quoteLabel = quoteRegion?.getAttribute('aria-label') || 'Recommendations';
  let quoteIndex = 0;
  const showQuote = index => {
    if (!quotePanels.length) return;
    quoteIndex = (index + quotePanels.length) % quotePanels.length;
    quotePanels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== quoteIndex;
    });
    if (quoteCount) {
      quoteCount.textContent = `${String(quoteIndex + 1).padStart(2, '0')} / ${String(quotePanels.length).padStart(2, '0')}`;
    }
    quoteRegion?.setAttribute('aria-label', `${quoteLabel}, ${quoteIndex + 1} of ${quotePanels.length}`);
    queueScroll();
  };
  quotePrevious?.addEventListener('click', () => showQuote(quoteIndex - 1));
  quoteNext?.addEventListener('click', () => showQuote(quoteIndex + 1));
  [quotePrevious, quoteNext].forEach(button => {
    if (button) button.disabled = quotePanels.length < 2;
  });
  showQuote(0);

  const dialog = document.querySelector('[data-award-dialog]');
  const dialogImage = document.querySelector('[data-dialog-image]');
  const dialogTitle = document.querySelector('[data-dialog-title]');
  let awardTrigger;
  document.querySelectorAll('.award-open').forEach(trigger => {
    trigger.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!dialog || typeof dialog.showModal !== 'function' || !dialogImage || !dialogTitle || !trigger.dataset.awardSrc) return;
      const title = trigger.dataset.awardTitle || 'Recognition';
      dialogTitle.textContent = title;
      dialogImage.src = trigger.dataset.awardSrc;
      dialogImage.alt = `${title} certificate awarded to Farooq Halabi`;
      try {
        dialog.showModal();
        awardTrigger = trigger;
        event.preventDefault();
      } catch {
        // Keep the certificate link usable if the native dialog cannot open.
      }
    });
  });
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  dialog?.addEventListener('close', () => {
    if (awardTrigger?.isConnected) awardTrigger.focus();
  });

  const toast = document.querySelector('[data-share-toast]');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4500);
  };
  document.querySelector('[data-share]')?.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]')?.href || `${location.origin}${location.pathname}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      showToast('Portfolio link copied.');
    } catch {
      showToast('Couldn’t copy automatically. Copy the link from your browser’s address bar.');
    }
  });
})();
