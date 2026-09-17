/* =====================================================
   main.js — logique du portfolio RAWLAND
   ===================================================== */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     1. HEADER : ombre au scroll + couleur selon section
     --------------------------------------------------- */
  const header = document.getElementById("site-header");
  const darkSections = document.querySelectorAll(".section--dark, .hero");

  function updateHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);

    // change la couleur du header selon la section actuellement sous la nav
    const probeY = header.offsetHeight + 10;
    let onDark = false;
    document.querySelectorAll(".section--dark").forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= probeY) onDark = true;
    });
    header.classList.toggle("on-dark", onDark);
  }
  document.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  /* ---------------------------------------------------
     2. NAV : menu mobile + lien actif
     --------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
    })
  );

  const navLinks = document.querySelectorAll("[data-nav]");
  const navSections = Array.from(navLinks).map((a) =>
    document.querySelector(a.getAttribute("href"))
  );

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = navSections.indexOf(entry.target);
        navLinks.forEach((a) => a.classList.remove("is-active"));
        if (idx > -1) navLinks[idx].classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  navSections.forEach((sec) => sec && navObserver.observe(sec));

  /* ---------------------------------------------------
     3. REVEAL AU SCROLL
     --------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  function observeReveal(el) {
    if (prefersReducedMotion) {
      el.classList.add("is-visible");
    } else {
      revealObserver.observe(el);
    }
  }
  document.querySelectorAll(".reveal").forEach(observeReveal);

  /* ---------------------------------------------------
     4. HERO : titre en parallax + orbite de vignettes
     façon "anneaux de Saturne" autour du portrait.
     - rotation automatique continue
     - on peut cliquer-glisser pour la faire tourner à la main
     - survoler une vignette met la rotation en pause
     - une vignette passe alternativement devant/derrière le
       portrait selon sa position sur l'ellipse (profondeur simulée)
     --------------------------------------------------- */
  const heroVisual = document.getElementById("hero-visual");
  const heroBgPhoto = document.getElementById("hero-bg-photo");
  const heroStage = document.querySelector(".hero-stage");
  const heroPortrait = document.getElementById("hero-portrait");
  const orbitContainer = document.getElementById("hero-orbit");

  // Position (en pixels, dans la photo à sa résolution native 1920x1080) du
  // personnage dans fond_hero_section.jpg, mesurée par corrélation d'image
  // avec portrait2.png. Sert à superposer le portrait détouré exactement
  // au même endroit, quelle que soit la taille de l'écran.
  const PORTRAIT_BBOX = { x: 338, y: 217, w: 481, h: 646 };

  function updateHeroPortraitPosition() {
    if (!heroVisual || !heroBgPhoto || !heroStage || !heroPortrait) return;
    const containerW = heroVisual.clientWidth;
    const containerH = heroVisual.clientHeight;
    if (!containerW || !containerH) return;

    const naturalW = heroBgPhoto.naturalWidth || 1920;
    const naturalH = heroBgPhoto.naturalHeight || 1080;
    const containerRatio = containerW / containerH;
    const imgRatio = naturalW / naturalH;

    // Reproduit le mapping de object-fit:cover / object-position:left center.
    let scale, offsetX, offsetY;
    if (imgRatio > containerRatio) {
      scale = containerH / naturalH;
      offsetX = 0;
      offsetY = 0;
    } else {
      scale = containerW / naturalW;
      offsetX = 0;
      offsetY = (containerH - naturalH * scale) / 2;
    }

    const cx = offsetX + (PORTRAIT_BBOX.x + PORTRAIT_BBOX.w / 2) * scale;
    const cy = offsetY + (PORTRAIT_BBOX.y + PORTRAIT_BBOX.h / 2) * scale;
    const pw = PORTRAIT_BBOX.w * scale;
    const ph = PORTRAIT_BBOX.h * scale;

    // L'ancre de l'anneau (hero-stage) est dimensionnée en fonction de la
    // taille réelle du portrait (et non du viewport) pour que le rayon de
    // l'anneau reste proportionné au personnage à toute taille d'écran.
    const stageSize = pw * 2.3;

    heroStage.style.left = `${cx}px`;
    heroStage.style.top = `${cy}px`;
    heroStage.style.width = `${stageSize}px`;
    heroStage.style.height = `${stageSize}px`;
    heroPortrait.style.width = `${pw}px`;
    heroPortrait.style.height = `${ph}px`;
  }

  if (heroBgPhoto && heroBgPhoto.complete) {
    updateHeroPortraitPosition();
  } else if (heroBgPhoto) {
    heroBgPhoto.addEventListener("load", updateHeroPortraitPosition);
  }
  window.addEventListener("resize", updateHeroPortraitPosition);

  // Récupère jusqu'à `count` projets pour peupler l'orbite : les ids listés
  // dans `pinnedIds` sont toujours inclus en premier, le reste est complété
  // en entrelaçant vidéos/photos/graphisme ; complète avec des cases vides
  // si besoin.
  function gatherOrbitProjects(count, pinnedIds) {
    const cats = ["videos", "photos", "graphisme"];
    const lists = cats.map((c) =>
      (projectsData[c] || []).map((p) => Object.assign({}, p, { category: c }))
    );
    const picked = [];
    const usedIds = new Set();

    (pinnedIds || []).forEach((id) => {
      for (const list of lists) {
        const found = list.find((p) => p.id === id);
        if (found && !usedIds.has(found.id)) {
          picked.push(found);
          usedIds.add(found.id);
          break;
        }
      }
    });

    let i = 0;
    while (picked.length < count) {
      let sawAny = false;
      for (const list of lists) {
        if (picked.length >= count) break;
        const p = list[i];
        if (!p) continue;
        sawAny = true;
        if (!usedIds.has(p.id)) {
          picked.push(p);
          usedIds.add(p.id);
        }
      }
      i++;
      if (!sawAny) break;
    }
    while (picked.length < count) picked.push(null);
    return picked;
  }

  const ORBIT_COUNT = 8;
  // Projets à toujours faire apparaître dans l'anneau autour du portrait.
  const ORBIT_PINNED_IDS = ["sncf-valeurs-eigs", "redstar-eag"];
  const orbitProjects = new Map(); // élément -> projet associé (pour l'ouverture de la modale)
  const orbitDeform = new Map(); // élément -> légère déformation figée (coins + rotation)
  const orbitItems = orbitContainer
    ? gatherOrbitProjects(ORBIT_COUNT, ORBIT_PINNED_IDS).map((project) => {
        const el = document.createElement(project ? "button" : "div");
        el.className = "hero-orbit-item" + (project ? "" : " is-placeholder");
        if (project) {
          el.type = "button";
          el.setAttribute("aria-label", project.title);
          el.innerHTML = `<img src="${project.cover}" alt="" onerror="this.parentElement.classList.add('img-missing')">`;
          orbitProjects.set(el, project);
          // Fallback pour le mode "mouvement réduit" (pas de drag, donc pas de
          // capture de pointeur) : le click natif suffit dans ce cas.
          el.addEventListener("click", () => openModal(project));
        }
        // Look "un peu moins clean" : coins légèrement irréguliers + un tout
        // petit tilt fixe propre à chaque vignette, figés une fois pour toutes.
        const r1 = 14 + Math.random() * 10;
        const r2 = 14 + Math.random() * 10;
        const r3 = 14 + Math.random() * 10;
        const r4 = 14 + Math.random() * 10;
        el.style.borderRadius = `${r1}px ${r2}px ${r3}px ${r4}px`;
        orbitDeform.set(el, (Math.random() - 0.5) * 7);
        orbitContainer.appendChild(el);
        return el;
      })
    : [];

  if (orbitContainer && orbitItems.length) {
    const N = orbitItems.length;
    let autoAngle = 0;
    let dragOffset = 0;
    let isDragging = false;
    let hoverPause = false;
    let lastX = 0;
    let lastT = performance.now();

    function ellipseForStage() {
      const rect = heroStage.getBoundingClientRect();
      const rx = Math.min(rect.width * 0.44, 300);
      const ry = rx * 0.34;
      // Anneau décalé vers la gauche par rapport au centre du portrait,
      // pour recentrer l'orbite sur le torse plutôt que sur le buste entier
      // (le profil du visage tire le centre géométrique vers la droite).
      // Décalage moins prononcé en layout mobile empilé, où l'espace manque.
      const shiftFactor = window.innerWidth <= 880 ? -0.1 : -0.3;
      return { cx: rect.width / 2 + rx * shiftFactor, cy: rect.height / 2, rx, ry };
    }

    function renderOrbit(totalAngle) {
      const { cx, cy, rx, ry } = ellipseForStage();
      orbitItems.forEach((el, i) => {
        const angle = totalAngle + (i * (Math.PI * 2)) / N;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        const z = Math.sin(angle); // -1 (derrière) → 1 (devant)
        const scale = 0.72 + 0.36 * ((z + 1) / 2);
        const opacity = 0.5 + 0.5 * ((z + 1) / 2);
        const tilt = Math.cos(angle) * 6 + (orbitDeform.get(el) || 0);
        el.style.zIndex = z > 0 ? 5 : 2;
        el.style.opacity = opacity.toFixed(2);
        el.style.transform =
          `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(1)}deg)`;
      });
    }

    if (prefersReducedMotion) {
      renderOrbit(0);
    } else {
      // Le drag capture le pointeur dès le pointerdown, ce qui empêche le
      // "click" natif d'atteindre les vignettes : on détecte donc nous-mêmes
      // un clic (peu/pas de mouvement entre down et up) pour ouvrir la modale.
      let downTarget = null;
      let downX = 0;
      let downY = 0;
      let didDrag = false;

      if (heroStage) {
        heroStage.addEventListener("pointerdown", (e) => {
          isDragging = true;
          didDrag = false;
          lastX = e.clientX;
          downX = e.clientX;
          downY = e.clientY;
          downTarget = e.target.closest(".hero-orbit-item");
          heroStage.classList.add("is-dragging");
          heroStage.setPointerCapture(e.pointerId);
        });
        heroStage.addEventListener("pointermove", (e) => {
          if (!isDragging) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          dragOffset += dx * 0.006;
          if (Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4) {
            didDrag = true;
          }
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
          heroStage.addEventListener(evt, (e) => {
            isDragging = false;
            heroStage.classList.remove("is-dragging");
            if (evt === "pointerup" && !didDrag && downTarget) {
              const project = orbitProjects.get(downTarget);
              if (project) openModal(project);
            }
            downTarget = null;
          })
        );
      }

      orbitItems.forEach((el) => {
        el.addEventListener("pointerenter", () => (hoverPause = true));
        el.addEventListener("pointerleave", () => (hoverPause = false));
      });

      function tick(t) {
        const dt = (t - lastT) / 1000;
        lastT = t;
        if (!isDragging && !hoverPause) {
          autoAngle += dt * 0.28; // vitesse de rotation automatique
        }
        renderOrbit(autoAngle + dragOffset);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  /* ---------------------------------------------------
     5. GÉNÉRATION DES CARTES À PARTIR DE projects-data.js
     --------------------------------------------------- */
  function createCard(project, emptyLabel) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "project-card reveal-item";
    card.innerHTML = `
      <img src="${project.cover}" alt="${project.title}" onerror="this.parentElement.classList.add('img-missing')">
      <div class="card-overlay">
        <span class="card-title">${project.title}</span>
        ${project.client ? `<span class="card-client">${project.client}</span>` : ""}
      </div>
    `;
    card.addEventListener("click", () => openModal(project));
    return card;
  }

  function createEmptyCard(label) {
    const el = document.createElement("div");
    el.className = "project-card is-empty reveal-item";
    el.textContent = label;
    return el;
  }

  function fillRow(containerId, list, category, minSlots) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const emptyLabel = container.dataset.emptyLabel || "À venir";

    list.forEach((project) => {
      container.appendChild(createCard({ ...project, category }, emptyLabel));
    });

    const remaining = Math.max(0, minSlots - list.length);
    for (let i = 0; i < remaining; i++) {
      container.appendChild(createEmptyCard(emptyLabel));
    }
  }

  fillRow("videos-row", projectsData.videos, "videos", 4);
  fillRow("photos-grid", projectsData.photos, "photos", 10);
  fillRow("graphisme-row", projectsData.graphisme, "graphisme", 4);

  document.querySelectorAll(".reveal-item").forEach(observeReveal);

  /* ---------------------------------------------------
     5bis. Molette verticale → défilement horizontal
     pour les rangées de type .scroll-row
     --------------------------------------------------- */
  document.querySelectorAll(".scroll-row").forEach((row) => {
    row.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        if (row.scrollWidth <= row.clientWidth) return;
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      },
      { passive: false }
    );
  });

  /* ---------------------------------------------------
     6. MODALE PROJET — un gabarit différent par type :
     - vidéo      : poster flouté + bouton lecture, titre en overlay
     - photo      : titre, description courte optionnelle, puis galerie en masonry
     - graphisme  : titre, puis image + description côte à côte,
                    et le reste des visuels en galerie en dessous
     --------------------------------------------------- */
  const modal = document.getElementById("project-modal");
  const modalTopbar = document.getElementById("modal-topbar");
  const modalKicker = document.getElementById("modal-kicker");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  let lastFocusedEl = null;

  function youTubeEmbedUrl(id) {
    return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
  }
  function vimeoEmbedUrl(id) {
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  function imgTag(src, alt) {
    return `<img src="${src}" alt="${alt || ""}" onerror="this.parentElement.classList.add('img-missing')">`;
  }

  function renderVideoContent(project) {
    const media = project.media || {};
    const stage = document.createElement("div");
    stage.className = "modal-video-stage";
    stage.innerHTML = imgTag(project.cover, project.title);

    if (media.src) {
      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "modal-play-btn";
      playBtn.setAttribute("aria-label", "Lancer la lecture");
      playBtn.addEventListener("click", () => {
        let playerHtml = "";
        if (media.type === "youtube") {
          playerHtml = `<iframe src="${youTubeEmbedUrl(media.src)}" title="${project.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        } else if (media.type === "vimeo") {
          playerHtml = `<iframe src="${vimeoEmbedUrl(media.src)}" title="${project.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        } else if (media.type === "file") {
          playerHtml = `<video src="${media.src}" controls autoplay playsinline></video>`;
        }
        stage.innerHTML = playerHtml;
      });
      stage.appendChild(playBtn);
    }
    return stage;
  }

  function renderPhotoContent(project) {
    const wrapper = document.createDocumentFragment();

    if (project.description) {
      const desc = document.createElement("p");
      desc.className = "modal-photo-desc";
      desc.textContent = project.description;
      wrapper.appendChild(desc);
    }

    const gallery = document.createElement("div");
    gallery.className = "modal-masonry";
    const images = project.images && project.images.length ? project.images : [project.cover];
    gallery.innerHTML = images.map((src) => imgTag(src, project.title)).join("");
    wrapper.appendChild(gallery);

    return wrapper;
  }

  function renderGraphismeContent(project) {
    const wrapper = document.createDocumentFragment();
    const images = project.images && project.images.length ? project.images : [project.cover];

    const intro = document.createElement("div");
    intro.className = "modal-graphisme-intro";

    const introImg = document.createElement("div");
    introImg.innerHTML = imgTag(images[0], project.title);

    const introText = document.createElement("div");
    introText.className = "modal-graphisme-text";
    const desc = document.createElement("p");
    desc.textContent = project.description || "";
    introText.appendChild(desc);

    const context = document.createElement("span");
    context.className = "modal-context";
    context.textContent = project.client ? project.client : "Projet personnel";
    introText.appendChild(context);

    if (project.tags && project.tags.length) {
      const tagList = document.createElement("ul");
      tagList.className = "modal-graphisme-tags";
      tagList.innerHTML = project.tags.map((t) => `<li>${t}</li>`).join("");
      introText.appendChild(tagList);
    }

    intro.appendChild(introImg);
    intro.appendChild(introText);
    wrapper.appendChild(intro);

    if (images.length > 1) {
      const rest = document.createElement("div");
      rest.className = "modal-graphisme-gallery";
      rest.innerHTML = images.slice(1).map((src) => imgTag(src, project.title)).join("");
      wrapper.appendChild(rest);
    }
    return wrapper;
  }

  function openModal(project) {
    lastFocusedEl = document.activeElement;
    modalContent.innerHTML = "";
    modalTopbar.classList.remove("modal-topbar--on-media");

    if (project.category === "videos") {
      modalKicker.textContent = project.client || "Vidéo";
      modalTopbar.classList.add("modal-topbar--on-media");
      modalContent.appendChild(renderVideoContent(project));
    } else if (project.category === "graphisme") {
      modalKicker.textContent = "Graphisme";
      modalContent.appendChild(renderGraphismeContent(project));
    } else {
      modalKicker.textContent = "Photo";
      modalContent.appendChild(renderPhotoContent(project));
    }

    modalTitle.textContent = project.title;

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalContent.innerHTML = ""; // stoppe vidéos/iframes en cours de lecture
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  /* ---------------------------------------------------
     7. À PROPOS : toggle des expériences
     --------------------------------------------------- */
  const expToggle = document.getElementById("exp-toggle");
  const expList = document.getElementById("exp-list");
  expToggle.addEventListener("click", () => {
    const isHidden = expList.hasAttribute("hidden");
    if (isHidden) {
      expList.removeAttribute("hidden");
    } else {
      expList.setAttribute("hidden", "");
    }
    expToggle.setAttribute("aria-expanded", String(isHidden));
  });
})();
