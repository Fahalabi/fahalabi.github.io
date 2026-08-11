(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".progress-rail span");
  let scrollFrame = 0;

  const updateScrollState = () => {
    const top = window.scrollY;
    const available = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(top / available, 0), 1);

    if (header) {
      header.classList.toggle("is-scrolled", top > 24);
    }
    if (progress) {
      progress.style.transform = `scaleY(${ratio})`;
    }
    scrollFrame = 0;
  };

  window.addEventListener("scroll", () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateScrollState);
    }
  }, { passive: true });
  updateScrollState();

  const glow = document.querySelector(".pointer-glow");
  if (glow && finePointer && !reducedMotion) {
    let targetX = -500;
    let targetY = -500;
    let currentX = targetX;
    let currentY = targetY;
    let pointerFrame = 0;

    const paintPointer = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      pointerFrame = window.requestAnimationFrame(paintPointer);
    };

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("is-visible");
      if (!pointerFrame) {
        paintPointer();
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => glow.classList.remove("is-visible"));
  }

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7%" });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Open navigation";
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.querySelector(".sr-only").textContent = willOpen ? "Close navigation" : "Open navigation";
      mobileMenu.hidden = !willOpen;
      document.body.classList.toggle("menu-open", willOpen);
      if (willOpen) {
        mobileMenu.querySelector("a")?.focus();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.matchMedia("(min-width: 821px)").addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  const toast = document.querySelector("[data-share-toast]");
  let toastTimer = 0;
  const showToast = (message) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  };

  const sharePortfolio = async () => {
    const shareData = {
      title: "Farooq Halabi | Knowledge Management, CX Operations and Applied AI",
      text: "Farooq Halabi uses human-governed AI to build trusted knowledge, scalable self-service and stronger frontline readiness.",
      url: window.location.href.split("#")[0]
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Portfolio shared.");
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Portfolio link copied.");
        return;
      }
      window.prompt("Copy this portfolio link:", shareData.url);
    } catch (error) {
      if (error?.name !== "AbortError") {
        showToast("Sharing was not available. Copy the address from your browser.");
      }
    }
  };

  document.querySelectorAll("[data-share]").forEach((button) => button.addEventListener("click", sharePortfolio));

  const carousel = document.querySelector("[data-carousel]");
  const slides = [...document.querySelectorAll("[data-slide]")];
  const previous = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  const carouselStatus = document.querySelector("[data-carousel-status]");
  let activeSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (carouselStatus) {
      carouselStatus.textContent = `${activeSlide + 1} / ${slides.length}`;
    }
  };

  previous?.addEventListener("click", () => showSlide(activeSlide - 1));
  next?.addEventListener("click", () => showSlide(activeSlide + 1));
  carousel?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeSlide - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeSlide + 1);
    }
  });
  showSlide(0);

  const dialog = document.querySelector("[data-award-dialog]");
  const dialogTitle = document.querySelector("[data-dialog-title]");
  const dialogImage = document.querySelector("[data-dialog-image]");
  const dialogClose = document.querySelector("[data-dialog-close]");

  document.querySelectorAll(".award-open").forEach((button) => {
    button.addEventListener("click", () => {
      if (!dialog || !dialogImage || !dialogTitle) return;
      const title = button.dataset.awardTitle || "Recognition certificate";
      dialogTitle.textContent = title;
      dialogImage.src = button.dataset.awardSrc || "";
      dialogImage.alt = `${title} certificate awarded to Farooq Halabi`;
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        window.open(dialogImage.src, "_blank", "noopener,noreferrer");
      }
    });
  });

  dialogClose?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!inside) dialog.close();
  });
})();
