(() => {
  const AUTOPLAY_MS = 5200;

  const showcases = [
    {
      id: "profile",
      number: "00",
      kicker: "Knowledge × customer experience",
      title: ["Farooq", "Halabi"],
      shortTitle: "Profile",
      accent: "#f3a07e",
      accentSoft: "#f8c4b1",
      ink: "#17201f",
      visual: `
        <div class="visual visual-portrait" aria-hidden="true">
          <div class="portrait-orbit portrait-orbit-one"></div>
          <div class="portrait-orbit portrait-orbit-two"></div>
          <div class="portrait-frame">
            <img src="farooq-halabi.jpg" alt="">
          </div>
          <span class="floating-pill pill-location">Dubai, UAE</span>
          <span class="floating-sphere sphere-one"></span>
          <span class="floating-sphere sphere-two"></span>
        </div>`,
    },
    {
      id: "help-centre",
      number: "01",
      kicker: "Customer self-service",
      title: ["Help centre", "revamp"],
      shortTitle: "Help Centre",
      accent: "#f1ca55",
      accentSoft: "#f8e5a4",
      ink: "#1c211b",
      visual: `
        <div class="visual visual-help" aria-hidden="true">
          <div class="mini-browser">
            <div class="mini-browser-top"><span></span><span></span><span></span></div>
            <div class="mini-search"><span class="mini-search-icon"></span><span>How can we help?</span></div>
            <div class="mini-topic-grid">
              <span>ACCOUNT</span><span>WATCHING</span><span>SUBSCRIPTION</span><span>DEVICES</span>
            </div>
          </div>
          <span class="language-chip language-en">EN</span>
          <span class="language-chip language-ar">ع</span>
          <span class="floating-sphere sphere-one"></span>
        </div>`,
    },
    {
      id: "bot-journeys",
      number: "02",
      kicker: "Guided support design",
      title: ["Bot", "journeys"],
      shortTitle: "Bot journeys",
      accent: "#98aa89",
      accentSoft: "#c8d1bd",
      ink: "#172018",
      visual: `
        <div class="visual visual-bot" aria-hidden="true">
          <div class="phone">
            <div class="phone-speaker"></div>
            <div class="chat-bubble chat-bubble-one">Choose a topic</div>
            <div class="chat-options"><span>Account</span><span>Subscription</span><span>Watching</span></div>
            <div class="chat-bubble chat-bubble-two">Found the right path</div>
            <div class="phone-home"></div>
          </div>
          <div class="flow-node flow-node-one">01</div>
          <div class="flow-node flow-node-two">02</div>
          <div class="flow-node flow-node-three">03</div>
          <div class="flow-line flow-line-one"></div>
          <div class="flow-line flow-line-two"></div>
        </div>`,
    },
    {
      id: "training",
      number: "03",
      kicker: "Training enablement",
      title: ["Training", "system"],
      shortTitle: "Training",
      accent: "#d8a7c2",
      accentSoft: "#edccde",
      ink: "#211a1e",
      visual: `
        <div class="visual visual-training" aria-hidden="true">
          <div class="slide-stack">
            <div class="training-slide training-slide-back"></div>
            <div class="training-slide training-slide-middle"></div>
            <div class="training-slide training-slide-front">
              <span class="training-kicker">CONTENT SYSTEM</span>
              <strong>≈500</strong>
              <span class="training-label">slides refreshed</span>
              <div class="training-lines"><span></span><span></span><span></span></div>
            </div>
          </div>
          <span class="floating-pill pill-training">Prepared for agents · trainers · vendors</span>
          <span class="floating-sphere sphere-two"></span>
        </div>`,
    },
    {
      id: "launch",
      number: "04",
      kicker: "Agent knowledge at scale",
      title: ["Information", "at scale"],
      shortTitle: "Agent support",
      accent: "#7cc8d3",
      accentSoft: "#b9e1e6",
      ink: "#152022",
      visual: `
        <div class="visual visual-launch" aria-hidden="true">
          <div class="launch-orbit launch-orbit-one"></div>
          <div class="launch-orbit launch-orbit-two"></div>
          <div class="launch-orbit launch-orbit-three"></div>
          <div class="launch-core"><span>KNOWLEDGE REACH</span><strong>500+</strong><small>agent audience</small></div>
          <span class="market-label market-uae">KNOWLEDGE BASE</span>
          <span class="market-label market-jordan">CARE UPDATES</span>
          <span class="market-label market-egypt">TRAINING MATERIAL</span>
          <span class="floating-sphere sphere-one"></span>
        </div>`,
    },
  ];

  const showcase = document.querySelector(".showcase");
  const stage = document.querySelector(".showcase-stage");
  const copy = document.querySelector(".stage-copy");
  const visual = document.querySelector(".visual-wrap");
  const count = document.querySelector(".stage-count");
  const tabs = Array.from(document.querySelectorAll(".showcase-tabs button"));
  const pauseButton = document.querySelector(".pause-button");
  const nextButton = document.querySelector(".next-button");
  const progressTrack = document.querySelector(".progress-track");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (
    !showcase ||
    !stage ||
    !copy ||
    !visual ||
    !count ||
    tabs.length !== showcases.length ||
    !nextButton
  ) {
    return;
  }

  let activeIndex = 0;
  let manuallyPaused = false;
  let timer = null;

  const stopTimer = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const resetProgress = () => {
    if (!progressTrack || reducedMotion.matches) {
      return;
    }

    const currentBar = progressTrack.querySelector("span");
    if (!currentBar) {
      return;
    }

    const freshBar = currentBar.cloneNode(true);
    freshBar.classList.toggle("is-stopped", manuallyPaused);
    freshBar.style.animationDuration = `${AUTOPLAY_MS}ms`;
    currentBar.replaceWith(freshBar);
  };

  const scheduleNext = () => {
    stopTimer();
    resetProgress();

    if (manuallyPaused || reducedMotion.matches || document.hidden) {
      return;
    }

    timer = window.setTimeout(() => {
      showSlide((activeIndex + 1) % showcases.length);
    }, AUTOPLAY_MS);
  };

  const replayAnimation = (element) => {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "";
  };

  const showSlide = (index) => {
    activeIndex = (index + showcases.length) % showcases.length;
    const item = showcases[activeIndex];

    showcase.style.setProperty("--accent", item.accent);
    showcase.style.setProperty("--accent-soft", item.accentSoft);
    showcase.style.setProperty("--showcase-ink", item.ink);
    showcase.classList.toggle("showcase-training", item.id === "training");
    stage.setAttribute(
      "aria-label",
      `${item.shortTitle} portfolio highlight`,
    );

    copy.innerHTML = `
      <p><span>${item.number}</span>${item.kicker}</p>
      <h2>${item.title[0]}<br>${item.title[1]}</h2>`;
    visual.innerHTML = item.visual;
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(showcases.length).padStart(2, "0")}`;

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === activeIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
      const marker = tab.querySelector(".tab-plus");
      if (marker) {
        marker.textContent = isActive ? "—" : "+";
      }
    });

    replayAnimation(copy);
    replayAnimation(visual);
    scheduleNext();
  };

  const syncPauseButton = () => {
    if (!pauseButton) {
      return;
    }

    if (reducedMotion.matches) {
      pauseButton.hidden = true;
      if (progressTrack) {
        progressTrack.hidden = true;
      }
      return;
    }

    pauseButton.hidden = false;
    if (progressTrack) {
      progressTrack.hidden = false;
    }
    pauseButton.setAttribute("aria-pressed", String(manuallyPaused));
    pauseButton.setAttribute(
      "aria-label",
      manuallyPaused
        ? "Resume automatic showcase"
        : "Pause automatic showcase",
    );
    pauseButton.innerHTML = manuallyPaused
      ? '<span aria-hidden="true">▶</span>Play'
      : '<span aria-hidden="true">Ⅱ</span>Pause';
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showSlide(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      showSlide(nextIndex);
    });
  });

  nextButton.addEventListener("click", () => {
    showSlide((activeIndex + 1) % showcases.length);
  });

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      syncPauseButton();
      scheduleNext();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
    } else {
      scheduleNext();
    }
  });

  reducedMotion.addEventListener("change", () => {
    syncPauseButton();
    scheduleNext();
  });

  syncPauseButton();
  showSlide(0);
})();
