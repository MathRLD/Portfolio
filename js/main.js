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

    // pas de fond tant que le header est au-dessus du hero
    const heroEl = document.getElementById("hero");
    header.classList.toggle("on-hero", !!heroEl && heroEl.getBoundingClientRect().bottom > probeY);
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
  // dans `pinnedIds` sont toujours inclus en premier, les ids de
  // `excludedIds` ne sont jamais repris, le reste est complété en
  // entrelaçant vidéos/photos/graphisme ; complète avec des cases vides
  // si besoin.
  function gatherOrbitProjects(count, pinnedIds, excludedIds) {
    const cats = ["videos", "photos", "graphisme"];
    const lists = cats.map((c) =>
      (projectsData[c] || []).map((p) => Object.assign({}, p, { category: c }))
    );
    const picked = [];
    const usedIds = new Set(excludedIds || []);

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
  // Projets à toujours faire apparaître dans l'anneau autour du portrait,
  // et projets à ne jamais y faire apparaître (aucun pour l'instant).
  const ORBIT_PINNED_IDS = ["sncf-valeurs-eigs", "redstar-eag", "bobital-2026", "jeune-lion-release-party"];
  const ORBIT_EXCLUDED_IDS = [];
  const ORBIT_MASK_COUNT = 4; // voir index.html : #grunge-mask-1 à 4
  const orbitProjects = new Map(); // élément -> projet associé (pour l'ouverture de la modale)
  const orbitDeform = new Map(); // élément -> légère déformation figée (rotation)
  const orbitItems = orbitContainer
    ? gatherOrbitProjects(ORBIT_COUNT, ORBIT_PINNED_IDS, ORBIT_EXCLUDED_IDS).map((project, index) => {
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
        // Look "un peu moins clean" : contour grunge (masque SVG, voir
        // index.html) qui varie d'une carte à l'autre + un tout petit tilt
        // fixe propre à chaque vignette, figés une fois pour toutes. Le
        // masque ne touche que le contour : l'image à l'intérieur reste nette.
        const maskId = `grunge-mask-${(index % ORBIT_MASK_COUNT) + 1}`;
        el.style.webkitMaskImage = `url(#${maskId})`;
        el.style.maskImage = `url(#${maskId})`;
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
    let hoveredEl = null; // vignette actuellement survolée (ralentit l'orbite, se grossit elle-même)
    let lastX = 0;
    let lastT = performance.now();
    const hoverAmount = new Map(); // el -> 0..1, lissé image par image vers 1 (survolée) ou 0
    orbitItems.forEach((el) => hoverAmount.set(el, 0));

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

    function renderOrbit(totalAngle, dt) {
      const { cx, cy, rx, ry } = ellipseForStage();
      orbitItems.forEach((el, i) => {
        const angle = totalAngle + (i * (Math.PI * 2)) / N;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        const z = Math.sin(angle); // -1 (derrière) → 1 (devant)
        // Écart de taille plus marqué entre l'avant et l'arrière de l'anneau.
        const baseScale = 0.58 + 0.55 * ((z + 1) / 2);
        const opacity = 0.5 + 0.5 * ((z + 1) / 2);
        const tilt = Math.cos(angle) * 6 + (orbitDeform.get(el) || 0);
        // Effet 3D : la vignette pivote sur elle-même (rotateY) selon sa
        // position dans l'anneau — de face au centre (devant ou derrière,
        // cos(angle)=0), de profil sur les côtés (cos(angle)=±1) — comme si
        // elle suivait réellement la courbe de l'ellipse au lieu de rester
        // plaquée face à l'écran.
        const rotY = -Math.cos(angle) * 22;

        // Lissage du survol (0 → 1 sur la vignette pointée, retombe à 0
        // ailleurs) : évite un saut de taille brutal à l'entrée/sortie.
        const target = el === hoveredEl ? 1 : 0;
        const cur = hoverAmount.get(el) || 0;
        const next = cur + (target - cur) * Math.min(1, (dt || 0.016) * 10);
        hoverAmount.set(el, next);
        const scale = baseScale * (1 + next * 0.22);

        // Empilement continu (et non un simple binaire devant/derrière) :
        // deux cartes qui se croisent gardent toujours un ordre cohérent
        // avec le sens de rotation, y compris au croisement à gauche/droite
        // du portrait, où l'ancien binaire pouvait les faire passer derrière
        // de façon incohérente. Basé uniquement sur z (jamais sur le survol,
        // voir `next`) : une vignette à l'arrière reste TOUJOURS derrière le
        // portrait (z-index 0, voir .hero-portrait), même agrandie au survol.
        el.style.zIndex = Math.round(z * 1000);
        el.style.opacity = opacity.toFixed(2);
        // perspective() juste avant rotateY (pas en tête de chaîne) :
        // posé là, son point de fuite se retrouve centré sur la vignette
        // elle-même (une fois déjà positionnée par les translate/scale/
        // rotate qui précèdent), au lieu de déformer aussi ce
        // positionnement. Et posé ici plutôt qu'en CSS sur le conteneur
        // parent (voir .hero-orbit), pour ne pas créer un contexte
        // d'empilement partagé qui figerait tout l'anneau devant ou
        // derrière le portrait en un seul bloc.
        el.style.transform =
          `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(1)}deg) perspective(1400px) rotateY(${rotY.toFixed(1)}deg)`;
      });
    }

    if (prefersReducedMotion) {
      renderOrbit(0, 0);
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
        el.addEventListener("pointerenter", () => (hoveredEl = el));
        el.addEventListener("pointerleave", () => {
          if (hoveredEl === el) hoveredEl = null;
        });
      });

      function tick(t) {
        const dt = (t - lastT) / 1000;
        lastT = t;
        // Le survol ralentit l'orbite plutôt que de la stopper net.
        const speedFactor = hoveredEl ? 0.15 : 1;
        if (!isDragging) {
          autoAngle += dt * 0.28 * speedFactor; // vitesse de rotation automatique
        }
        renderOrbit(autoAngle + dragOffset, dt);
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

  /* ---------------------------------------------------
     5bis. Slider infini (Vidéos / Photos / Graphisme)
     ---------------------------------------------------
     #videos-row / #photos-row / #graphisme-row est la fenêtre fixe
     (overflow caché) ; #videos-track / #photos-track / #graphisme-track
     est le rail à l'intérieur, qui contient TROIS exemplaires consécutifs
     de la liste et glisse via transform. On avance d'une carte à la fois
     avec une transition ; une fois qu'on a dérivé d'un exemplaire complet
     dans un sens, on se replace silencieusement (sans transition) au même
     endroit visuel dans l'exemplaire du milieu — mais seulement une fois
     la carte sortie hors du champ visible, donc sans saut perceptible.

     Deux variantes, pilotées par `opts` :
     - Vidéos / Graphisme (opts.featured = true) : 4 cartes visibles dont
       la 2e est mise en avant (.is-featured) via une largeur agrandie.
     - Photos (opts.featured = false) : plusieurs cartes carrées de même
       taille (pas de carte agrandie), dont le nombre visible s'adapte
       aussi à la largeur de la fenêtre (voir visibleCount()).
     --------------------------------------------------- */
  function buildCardFactories(containerId, list, category, minSlots) {
    const container = document.getElementById(containerId);
    const emptyLabel = container?.dataset.emptyLabel || "À venir";
    const factories = list.map((project) => () => createCard({ ...project, category }, emptyLabel));
    const remaining = Math.max(0, minSlots - list.length);
    for (let i = 0; i < remaining; i++) {
      factories.push(() => createEmptyCard(emptyLabel));
    }
    return factories;
  }

  function setupInfiniteSlider(carouselId, viewportId, trackId, slideFactories, opts) {
    // bleed < 1 : les cartes sont dimensionnées sur cette fraction de la
    // largeur, centrées, et les cartes voisines dépassent jusqu'aux bords.
    const { featured = true, cardAspect = 10 / 16, bleed = 1 } = opts || {};
    let sideOffset = 0;
    const carousel = document.getElementById(carouselId);
    const viewport = document.getElementById(viewportId);
    const track = document.getElementById(trackId);
    if (!carousel || !viewport || !track) return;

    const n = slideFactories.length;
    if (!n) return;

    // Chaque carte est directement l'item flexible du rail (pas de slot
    // intermédiaire) : sa largeur (normale ou vedette, voir CSS) est donc
    // sa vraie largeur de mise en page, et le gap flex (--slot-gap) est
    // une valeur UNIQUE partagée par toutes les paires de cartes — l'écart
    // est donc rigoureusement identique partout, y compris autour de la
    // carte vedette. La position de chaque carte se calcule en sommant les
    // largeurs RÉELLEMENT rendues qui la précèdent (voir place()), ce qui
    // reste correct même si la carte vedette (plus large) se trouve parmi
    // elles pour un exemplaire donné.
    const copies = [[], [], []];
    for (let c = 0; c < 3; c++) {
      slideFactories.forEach((factory, i) => {
        const card = factory();
        card.dataset.slideIndex = i; // identité logique (0..n-1), la même dans les 3 exemplaires
        track.appendChild(card);
        copies[c].push(card);
      });
    }
    const allCards = copies.flat();
    allCards.forEach((card) => observeReveal(card));

    let currentIndex = n; // on démarre sur le premier élément de l'exemplaire du milieu
    let isAnimating = false;

    // Un nombre fixe de cartes visibles à la fois (moins sur petit écran
    // pour rester lisible) : les largeurs sont calculées à partir de la
    // largeur réelle de la fenêtre visible, pas d'une taille fixe/vw —
    // ainsi il n'y a jamais un bout de carte suivante qui dépasse en bord
    // de rangée. On se base sur clientWidth SANS retirer de padding CSS :
    // overflow-hidden sur .scroll-row masque à la largeur totale de la
    // boîte (voir .carousel--featured / .carousel--photos .scroll-row,
    // qui n'ont aucun padding — tout l'espacement est calculé ici et
    // appliqué via transform, jamais en padding CSS).
    const GAP_RATIO = 0.05; // gap réel, en fraction d'une carte normale
    const FEATURED_RATIO = 1.17; // largeur de la carte vedette, en fraction d'une carte normale
    function visibleCount() {
      const w = viewport.clientWidth * bleed;
      if (featured) {
        if (w < 560) return 2;
        if (w < 900) return 3;
        return 4;
      }
      if (w < 560) return 1;
      if (w < 900) return 2;
      return 3;
    }
    function layout() {
      const count = visibleCount();
      const baseW = viewport.clientWidth * bleed;
      sideOffset = (viewport.clientWidth - baseW) / 2;
      if (featured) {
        // (count-1) cartes normales + 1 vedette + (count-1) gaps = largeur dispo
        const units = (count - 1) * (1 + GAP_RATIO) + FEATURED_RATIO;
        const cardWidth = baseW / units;
        const featuredWidth = cardWidth * FEATURED_RATIO;
        track.style.setProperty("--card-w", `${cardWidth}px`);
        track.style.setProperty("--card-w-featured", `${featuredWidth}px`);
        track.style.setProperty("--slot-gap", `${cardWidth * GAP_RATIO}px`);
        // Hauteur de la fenêtre fixée sur la carte vedette (toujours la plus
        // grande) : sans ça, pendant la transition, les deux cartes qui
        // échangent leur rôle passent un instant par une taille
        // intermédiaire, la carte la plus haute du rail rétrécit
        // brièvement, et toute la page en dessous remonte puis redescend
        // pour suivre.
        viewport.style.height = `${featuredWidth * cardAspect}px`;
      } else {
        // Cartes de même taille, réparties uniformément sur toute la largeur.
        const units = count + (count - 1) * GAP_RATIO;
        const cardWidth = baseW / units;
        track.style.setProperty("--card-w", `${cardWidth}px`);
        track.style.setProperty("--slot-gap", `${cardWidth * GAP_RATIO}px`);
        viewport.style.height = `${cardWidth * cardAspect}px`;
      }
    }
    layout();

    // La carte mise en avant est toujours la 2e carte visible, donc celle
    // juste après la carte de tête (currentIndex) dans l'ordre du rail.
    // N'existe qu'en mode "vedette" (Vidéos / Graphisme) : Photos affiche
    // des cartes toutes de même taille, pas de carte agrandie.
    function updateFeatured() {
      if (!featured) return;
      const idx = ((currentIndex + 1) % n + n) % n;
      allCards.forEach((card) => {
        card.classList.toggle("is-featured", Number(card.dataset.slideIndex) === idx);
      });
    }
    updateFeatured();

    // Indicateur de progression (points, celui de la diapositive active
    // s'étire en pastille) : un point par diapositive réelle (0..n-1),
    // cliquable pour y sauter directement. Purement additif : n'affecte
    // pas la navigation aux flèches ni le défilement infini lui-même.
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";
    const dots = [];
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Aller à l'élément ${i + 1}`);
      dot.addEventListener("click", () => animateTo(n + i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }
    carousel.appendChild(dotsWrap);

    function updateDots() {
      const active = ((currentIndex % n) + n) % n;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    }
    updateDots();

    // Décalage cumulé jusqu'à currentIndex, à partir des largeurs
    // RÉELLEMENT rendues (offsetWidth) — correct même quand une carte plus
    // large que la normale se trouve parmi celles qui précèdent.
    function offsetFor(index) {
      const gapPx = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += allCards[i].offsetWidth + gapPx;
      }
      return offset;
    }

    function place(animate) {
      track.style.transition = animate && !prefersReducedMotion ? "transform 0.45s var(--ease)" : "none";
      track.style.transform = `translateX(${sideOffset - offsetFor(currentIndex)}px)`;
    }
    place(false);
    // N'active la transition des cartes (largeur/ombre) qu'une fois la
    // mise en page initiale posée — sinon ce premier calcul de style
    // serait lui-même animé (voir la règle .scroll-track.is-ready en CSS).
    track.classList.add("is-ready");

    function settle() {
      if (currentIndex >= 2 * n) currentIndex -= n;
      else if (currentIndex < n) currentIndex += n;
      place(false);
      isAnimating = false;
    }

    function onTrackTransitionEnd(e) {
      if (e.target !== track) return; // ignore les transitions des cartes (flex-basis) qui remontent ici
      track.removeEventListener("transitionend", onTrackTransitionEnd);
      settle();
    }

    function animateTo(targetIndex) {
      if (isAnimating || targetIndex === currentIndex) return;
      currentIndex = targetIndex;
      updateDots();
      if (prefersReducedMotion) {
        updateFeatured();
        settle();
        return;
      }
      isAnimating = true;
      updateFeatured();
      place(true);
      track.addEventListener("transitionend", onTrackTransitionEnd);
    }

    function step(dir) {
      animateTo(currentIndex + dir);
    }

    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => step(1));

    window.addEventListener("resize", () => {
      layout();
      place(false);
    });
  }

  setupInfiniteSlider(
    "videos-carousel",
    "videos-row",
    "videos-track",
    buildCardFactories("videos-row", projectsData.videos, "videos", 4)
  );
  setupInfiniteSlider(
    "graphisme-carousel",
    "graphisme-row",
    "graphisme-track",
    buildCardFactories("graphisme-row", projectsData.graphisme, "graphisme", 4)
  );
  setupInfiniteSlider(
    "photos-carousel",
    "photos-row",
    "photos-track",
    buildCardFactories("photos-row", projectsData.photos, "photos", 0),
    { featured: false, cardAspect: 1, bleed: 0.85 }
  );

  /* ---------------------------------------------------
     6. MODALE PROJET — un gabarit différent par type :
     - vidéo      : poster flouté + bouton lecture, titre en overlay
     - photo      : titre, description courte optionnelle, puis galerie en masonry
     - graphisme  : titre, puis image + description côte à côte,
                    et le reste des visuels en galerie en dessous
     --------------------------------------------------- */
  const modal = document.getElementById("project-modal");
  const modalPanel = document.getElementById("modal-panel");
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
    modalPanel.classList.remove("modal-panel--video", "modal-panel--photo");

    if (project.category === "videos") {
      modalKicker.textContent = project.client || "Vidéo";
      modalTopbar.classList.add("modal-topbar--on-media");
      modalPanel.classList.add("modal-panel--video");
      modalContent.appendChild(renderVideoContent(project));
    } else if (project.category === "graphisme") {
      modalKicker.textContent = "Graphisme";
      modalContent.appendChild(renderGraphismeContent(project));
    } else {
      modalKicker.textContent = "Photo";
      modalPanel.classList.add("modal-panel--photo");
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

  /* ---------------------------------------------------
     7b. BANDEAU LOGOS : boucle infinie
     On duplique la liste autant de fois que nécessaire pour
     couvrir 2x la largeur de l'écran, puis on fait défiler
     la piste d'exactement une liste : le raccord est invisible
     et il n'y a jamais de trou blanc, quelle que soit la largeur.
     --------------------------------------------------- */
  const logoTrack = document.querySelector(".logo-track");
  if (logoTrack) {
    const logoSource = logoTrack.querySelector(".logo-list");
    const LOGO_SPEED = 60; // px par seconde

    function buildLogoLoop() {
      logoTrack.querySelectorAll(".logo-list[data-clone]").forEach((el) => el.remove());
      const listW = logoSource.getBoundingClientRect().width;
      if (!listW) return;
      const copies = Math.ceil((window.innerWidth * 2) / listW);
      for (let i = 0; i < copies; i++) {
        const clone = logoSource.cloneNode(true);
        clone.setAttribute("data-clone", "");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach((img) => (img.alt = ""));
        logoTrack.appendChild(clone);
      }
      logoTrack.style.setProperty("--logo-shift", `-${listW}px`);
      logoTrack.style.setProperty("--logo-duration", `${listW / LOGO_SPEED}s`);
    }

    buildLogoLoop();
    window.addEventListener("load", buildLogoLoop);
    let logoResizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(logoResizeTimer);
      logoResizeTimer = setTimeout(buildLogoLoop, 150);
    });
  }

  /* ---------------------------------------------------
     8. CURSEUR PERSONNALISÉ
     Un point (position exacte) + un anneau qui suit avec un
     léger retard élastique, et se transforme en pastille
     "Voir" au survol des vignettes/cartes de projet.
     N'active jamais sur écran tactile (pointer: coarse) ni en
     mode mouvement réduit.
     --------------------------------------------------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";
    const cursorRing = document.createElement("div");
    cursorRing.className = "cursor-ring";
    const cursorLabel = document.createElement("span");
    cursorRing.appendChild(cursorLabel);
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.classList.add("has-custom-cursor");

    const VIEW_TARGETS = ".project-card:not(.is-empty), .hero-orbit-item:not(.is-placeholder)";
    const HOVER_TARGETS = "a, button";

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      const viewEl = e.target.closest(VIEW_TARGETS);
      const linkEl = !viewEl && e.target.closest(HOVER_TARGETS);
      cursorRing.classList.toggle("is-view", !!viewEl);
      cursorRing.classList.toggle("is-hover", !!linkEl);
      cursorLabel.textContent = viewEl ? "Voir" : "";
    }
    window.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mousedown", () => cursorRing.classList.add("is-active"));
    document.addEventListener("mouseup", () => cursorRing.classList.remove("is-active"));
    document.addEventListener("mouseleave", () => {
      cursorDot.classList.add("is-hidden");
      cursorRing.classList.add("is-hidden");
    });
    document.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("is-hidden");
      cursorRing.classList.remove("is-hidden");
    });

    // L'anneau suit le point avec un léger retard (lerp), le point lui
    // reste collé exactement à la position réelle de la souris.
    function tickCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(tickCursor);
    }
    requestAnimationFrame(tickCursor);
  }
})();
