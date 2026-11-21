/* =========================================================
   Rosalya — scripts communs (en-tête, panier, grilles, animations)
   ========================================================= */
(function () {
  "use strict";

  const PRODUITS = window.ROSALYA_PRODUITS || [];
  const CATS = window.ROSALYA_CATEGORIES || {};
  const ETAPES = window.ROSALYA_ETAPES || {};
  const SEUIL_LIVRAISON = 60;
  const FRAIS_LIVRAISON = 4.9;
  const CLE_PANIER = "rosalya-panier";

  const page = document.body.dataset.page || "";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const euro = (n) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const parSlug = (slug) => PRODUITS.find((p) => p.slug === slug);
  const img = (p, petit) =>
    `assets/img/produits/${p.slug}${petit ? "-sm" : ""}.webp`;
  const urlProduit = (p) => `produit.html?p=${p.slug}`;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- En-tête, menu mobile, pied de page ---------------- */
  const navLiens = [
    ["boutique.html?cat=tous", "Tout", "tous"],
    ["boutique.html?cat=iconiques", "Les iconiques", "iconiques"],
    ["boutique.html?cat=cremes", "Crèmes", "cremes"],
    ["boutique.html?cat=serums", "Sérums", "serums"],
    ["boutique.html?cat=soins-specifiques", "Soins spécifiques", "soins-specifiques"],
  ];

  function enTete() {
    const el = $("[data-header]");
    if (!el) return;
    const catActive = new URLSearchParams(location.search).get("cat");
    const current = (key) =>
      (page === "boutique" && catActive === key) || page === key ? ' aria-current="page"' : "";
    el.outerHTML = `
      <header class="header${page === "accueil" ? " header--overlay" : ""}" id="header">
        <div class="wrap header__inner">
          <div class="header__left">
            <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
            <nav class="nav nav--left" aria-label="Navigation">
              <div class="nav-drop">
                <a href="boutique.html" aria-haspopup="true"${page === "boutique" || page === "produit" ? ' aria-current="page"' : ""}>Boutique</a>
                <div class="nav-drop__panel">
                  <div class="nav-drop__links">
                    <a href="boutique.html?cat=tous">Tout <span>${PRODUITS.length}</span></a>
                    <a href="boutique.html?cat=iconiques">Les iconiques <span>${PRODUITS.filter((p) => p.iconique).length}</span></a>
                    ${navLiens.slice(2).map(([h, t, k]) => `<a href="${h}">${t} <span>${PRODUITS.filter((p) => p.categorie === k).length}</span></a>`).join("")}
                  </div>
                  <a class="nav-drop__promo" href="produit.html?p=gel-nettoyant-doux">
                    <span class="nav-drop__img"><img src="assets/img/produits/gel-nettoyant-doux-sm.webp" alt="" loading="lazy" width="700" height="875"></span>
                    <span class="nav-drop__tag">Nouveauté</span>
                    <strong>Gel Nettoyant Doux</strong>
                    <span class="nav-drop__sub">Le geste essentiel, redéfini.</span>
                    <span class="nav-drop__cta">Découvrir →</span>
                  </a>
                </div>
              </div>
              <a href="a-propos.html"${current("a-propos")}>À propos</a>
              <a href="contact.html"${current("contact")}>Contact</a>
            </nav>
          </div>
          <a class="brand" href="index.html" aria-label="Rosalya, accueil">Rosalya.</a>
          <nav class="nav nav--right" aria-label="Panier">
            <button class="cart-btn" data-open-cart aria-label="Ouvrir le panier">Panier (<span data-cart-count>0</span>)</button>
          </nav>
        </div>
      </header>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Menu mobile" data-lenis-prevent>
        ${navLiens.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
        <span class="label">Rosalya</span>
        <a href="a-propos.html">À propos</a>
        <a href="contact.html">Contact</a>
        <a href="panier.html">Panier</a>
      </nav>`;

    const header = $("#header");
    const burger = $(".burger");
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open);
      document.documentElement.style.setProperty("--menu-top", header.getBoundingClientRect().bottom + "px");
    });
    $$("#mobile-menu a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );

    const scene = $(".carousel");
    const petit = window.matchMedia("(max-width: 900px)");
    const seuil = () => (scene && !petit.matches ? Math.max(40, scene.offsetHeight - header.offsetHeight - 40) : 20);
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > seuil());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function piedDePage() {
    const el = $("[data-footer]");
    if (!el) return;
    el.outerHTML = `
      <footer class="footer">
        <div class="wrap">
          <a class="footer__giant" href="index.html" aria-label="Rosalya, accueil">Rosalya.</a>
          <div class="footer__bottom">
            <span>© ${new Date().getFullYear()} Rosalya · Projet scolaire</span>
            <nav class="footer__links">
              <a href="boutique.html">Boutique</a>
              <a href="a-propos.html">À propos</a>
              <a href="a-propos.html#faq">FAQ</a>
              <a href="contact.html">Contact</a>
            </nav>
            <span>Livraison offerte dès ${SEUIL_LIVRAISON} €</span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------------- Panier (localStorage) ---------------- */
  const Panier = {
    lire() {
      try {
        const data = JSON.parse(localStorage.getItem(CLE_PANIER) || "[]");
        return Array.isArray(data) ? data.filter((l) => parSlug(l.slug) && l.qte > 0) : [];
      } catch (e) {
        return [];
      }
    },
    ecrire(lignes) {
      try { localStorage.setItem(CLE_PANIER, JSON.stringify(lignes)); } catch (e) { /* navigation privée */ }
      majPanier();
    },
    ajouter(slug, qte = 1) {
      const lignes = this.lire();
      const l = lignes.find((x) => x.slug === slug);
      if (l) l.qte = Math.min(99, l.qte + qte);
      else lignes.push({ slug, qte });
      this.ecrire(lignes);
    },
    definir(slug, qte) {
      let lignes = this.lire();
      if (qte <= 0) lignes = lignes.filter((x) => x.slug !== slug);
      else lignes.forEach((x) => { if (x.slug === slug) x.qte = Math.min(99, qte); });
      this.ecrire(lignes);
    },
    vider() { this.ecrire([]); },
    total() { return this.lire().reduce((s, l) => s + parSlug(l.slug).prix * l.qte, 0); },
    nombre() { return this.lire().reduce((s, l) => s + l.qte, 0); },
  };
  window.RosalyaPanier = Panier;

  function tiroir() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="overlay" data-close-cart></div>
       <aside class="drawer" id="drawer" aria-label="Panier" aria-hidden="true">
         <div class="drawer__head">
           <h2>Votre panier <span class="muted" data-cart-count-text></span></h2>
           <button class="close-btn" data-close-cart aria-label="Fermer le panier"></button>
         </div>
         <div class="drawer__body" data-cart-lines data-lenis-prevent></div>
         <div class="drawer__foot" data-cart-foot></div>
       </aside>
       <div class="toast" role="status" aria-live="polite"></div>`
    );
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); ouvrirPanier(); }
      if (e.target.closest("[data-close-cart]")) fermerPanier();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { fermerPanier(); document.body.classList.remove("menu-open"); }
    });
  }
  function ouvrirPanier() {
    if (page === "panier") return;
    document.body.classList.add("cart-open");
    $("#drawer").setAttribute("aria-hidden", "false");
    setTimeout(() => $("#drawer .close-btn").focus(), 50);
  }
  function fermerPanier() {
    document.body.classList.remove("cart-open");
    const d = $("#drawer");
    if (d) d.setAttribute("aria-hidden", "true");
  }

  function toast(msg) {
    const t = $(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  function htmlLignes(grand) {
    const lignes = Panier.lire();
    if (!lignes.length) {
      return `<div class="empty"><p>Votre panier est vide.</p><a class="btn btn--ghost" href="boutique.html">Découvrir les soins</a></div>`;
    }
    return lignes
      .map(({ slug, qte }) => {
        const p = parSlug(slug);
        return `<div class="line">
          <a class="line__img" href="${urlProduit(p)}"><img src="${img(p, true)}" alt="${esc(p.nom)}" loading="lazy"></a>
          <div>
            <a class="line__name" href="${urlProduit(p)}">${esc(p.nom)}</a>
            <p class="line__actifs">${esc(p.actifs)}</p>
            <div class="qty qty--sm">
              <button data-qte="${slug}" data-delta="-1" aria-label="Retirer un">−</button>
              <input type="number" value="${qte}" min="0" max="99" data-qte-input="${slug}" aria-label="Quantité">
              <button data-qte="${slug}" data-delta="1" aria-label="Ajouter un">+</button>
            </div>
          </div>
          <div class="line__right">
            <span>${euro(p.prix * qte)}</span>
            <button class="line__remove" data-remove="${slug}">Retirer</button>
          </div>
        </div>`;
      })
      .join("");
  }

  function htmlLivraison() {
    const total = Panier.total();
    const reste = SEUIL_LIVRAISON - total;
    const pct = Math.min(100, (total / SEUIL_LIVRAISON) * 100);
    const txt = reste > 0
      ? `Plus que <strong>${euro(reste)}</strong> pour profiter de la livraison offerte.`
      : `La livraison vous est <strong>offerte</strong>.`;
    return `<div class="ship">${txt}<div class="ship__bar"><i style="width:${pct}%"></i></div></div>`;
  }

  function htmlTotaux() {
    const total = Panier.total();
    const port = total >= SEUIL_LIVRAISON || total === 0 ? 0 : FRAIS_LIVRAISON;
    return `<div class="totals">
        <div><span>Sous-total</span><span>${euro(total)}</span></div>
        <div><span>Livraison</span><span>${port ? euro(port) : "Offerte"}</span></div>
        <div class="total"><span>Total</span><span>${euro(total + port)}</span></div>
      </div>
      <button class="btn btn--block" data-checkout ${total ? "" : "disabled"}>Valider ma commande</button>
      <p class="note">Projet scolaire : le paiement est désactivé.</p>`;
  }

  function majPanier() {
    const n = Panier.nombre();
    $$("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 300);
    });
    $$("[data-cart-count-text]").forEach((el) => (el.textContent = n ? `(${n})` : ""));

    const vide = !Panier.lire().length;
    const corps = $("[data-cart-lines]");
    if (corps) corps.innerHTML = (vide ? "" : htmlLivraison()) + htmlLignes();
    const pied = $("[data-cart-foot]");
    if (pied) { pied.innerHTML = vide ? "" : htmlTotaux(); pied.hidden = vide; }

    // Page panier
    const pl = $("[data-cartpage-lines]");
    if (pl) pl.innerHTML = htmlLignes(true);
    const ps = $("[data-cartpage-summary]");
    if (ps) {
      ps.hidden = vide;
      ps.innerHTML = vide ? "" : `<h2 class="title-m">Récapitulatif</h2>${htmlLivraison()}${htmlTotaux()}`;
    }
  }

  function evenementsPanier() {
    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        e.preventDefault();
        const qteInput = add.dataset.qtyFrom ? $(add.dataset.qtyFrom) : null;
        const qte = qteInput ? Math.max(1, parseInt(qteInput.value, 10) || 1) : 1;
        Panier.ajouter(add.dataset.add, qte);
        const p = parSlug(add.dataset.add);
        if (add.dataset.noDrawer !== undefined || window.matchMedia("(max-width: 760px)").matches) {
          toast(`${p.nom} ajouté au panier`);
        } else {
          ouvrirPanier();
        }
      }
      const q = e.target.closest("[data-qte]");
      if (q) {
        const l = Panier.lire().find((x) => x.slug === q.dataset.qte);
        if (l) Panier.definir(l.slug, l.qte + parseInt(q.dataset.delta, 10));
      }
      const r = e.target.closest("[data-remove]");
      if (r) Panier.definir(r.dataset.remove, 0);
      if (e.target.closest("[data-checkout]")) {
        toast("Paiement désactivé : Rosalya est un projet scolaire.");
      }
    });
    document.addEventListener("change", (e) => {
      const i = e.target.closest("[data-qte-input]");
      if (i) Panier.definir(i.dataset.qteInput, parseInt(i.value, 10) || 0);
    });
    window.addEventListener("storage", (e) => { if (e.key === CLE_PANIER) majPanier(); });
  }

  /* ---------------- Cartes produit ---------------- */
  /* 2e image (texture), révélée au survol */
  const texture = (p) => `<img class="hover-img" src="assets/img/photos/texture-${p.slug}.webp" alt="" loading="lazy" aria-hidden="true">`;

  function carte(p, i = 0) {
    return `<article class="card reveal reveal-delay-${i % 4}">
      <div class="card__media">
        <img src="${img(p, true)}" alt="${esc(p.nom + " – " + p.actifs)}" loading="lazy" width="700" height="700">
        ${texture(p)}
      </div>
      <div class="card__body">
        <h3 class="card__name"><a href="${urlProduit(p)}">${esc(p.nom)}</a></h3>
        <p class="card__actifs">${esc(p.actifs)}</p>
        <p class="card__price">${euro(p.prix)}</p>
      </div>
    </article>`;
  }

  /* Carrousel de la bannière d'accueil */
  function carrousel() {
    const c = $("#carousel");
    if (!c) return;
    const slides = $$(".carousel__slide", c);
    const dots = $$(".carousel__dots button", c);
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = $(".carousel__track", c);
    let i = 0, pos = 0, timer;
    const nb = slides.length;
    /* Boucle infinie : une copie de la 1re diapo est placée après la dernière.
       On glisse jusqu'à la copie, puis on revient sans animation sur la vraie. */
    const copie = slides[0].cloneNode(true);
    copie.classList.remove("is-active");
    copie.setAttribute("aria-hidden", "true");
    $$("a", copie).forEach((a) => (a.tabIndex = -1));
    $$("img", copie).forEach((im) => im.removeAttribute("fetchpriority"));
    track.appendChild(copie);
    const placer = (p, anime) => {
      track.style.transition = anime ? "" : "none";
      track.style.transform = `translateX(${-p * 100}%)`;
      if (!anime) void track.offsetWidth;
      pos = p;
    };
    track.addEventListener("transitionend", (e) => { if (e.target === track && pos === nb) placer(0, false); });
    const aller = (n) => {
      if (pos === nb) placer(0, false);
      if (n < 0) { placer(nb, false); n = nb - 1; }
      placer(n, true);
      if (n === nb) setTimeout(() => { if (pos === nb) placer(0, false); }, 1000); /* filet si transitionend ne vient pas */
      i = n % nb;
      slides.forEach((s, k) => {
        s.classList.toggle("is-active", k === i);
        s.setAttribute("aria-hidden", k !== i);
        $$("a", s).forEach((a) => (a.tabIndex = k === i ? 0 : -1));
      });
      dots.forEach((d, k) => d.setAttribute("aria-selected", k === i));
    };
    const lancer = () => { if (reduit) return; clearInterval(timer); timer = setInterval(() => aller(i + 1), 6000); };
    dots.forEach((d, k) => d.addEventListener("click", () => { aller(k); lancer(); }));
    $$(".carousel__arrow", c).forEach((b) => b.addEventListener("click", () => { aller(i + parseInt(b.dataset.dir, 10)); lancer(); }));
    c.addEventListener("mouseenter", () => clearInterval(timer));
    c.addEventListener("mouseleave", lancer);
    c.addEventListener("focusin", () => clearInterval(timer));
    let x0 = null;
    c.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    c.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { aller(i + (dx < 0 ? 1 : -1)); lancer(); }
      x0 = null;
    });
    aller(0);
    lancer();
  }

  /* Slider à onglets (accueil) */
  function sliderOnglets() {
    const s = $("#slider");
    if (!s) return;
    const tabs = $$("[data-tab]");
    const bar = $("#progress i");
    const filtrer = (k) =>
      k === "iconiques" ? PRODUITS.filter((p) => p.iconique) : PRODUITS.filter((p) => p.categorie === k);
    const peindre = (k) => {
      s.innerHTML = filtrer(k).map(carte).join("");
      s.scrollLeft = 0;
      reveal();
      maj();
    };
    const maj = () => {
      const max = s.scrollWidth - s.clientWidth;
      const ratio = s.scrollWidth ? s.clientWidth / s.scrollWidth : 1;
      bar.style.width = Math.min(100, ratio * 100) + "%";
      bar.style.left = max > 0 ? (s.scrollLeft / max) * (100 - ratio * 100) + "%" : "0%";
    };
    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        tabs.forEach((x) => x.setAttribute("aria-selected", x === t));
        s.style.opacity = 0;
        setTimeout(() => { peindre(t.dataset.tab); s.style.opacity = 1; }, 220);
      })
    );
    s.style.transition = "opacity .25s";
    s.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    $$("[data-slide]").forEach((b) =>
      b.addEventListener("click", () => {
        const card = $(".card", s);
        const pas = card ? card.offsetWidth : s.clientWidth / 4;
        s.scrollBy({ left: pas * parseInt(b.dataset.slide, 10), behavior: "smooth" });
      })
    );
    peindre("iconiques");
  }
  window.RosalyaCarte = carte;

  function grilles() {
    $$("[data-grid]").forEach((g) => {
      const filtre = g.dataset.grid;
      let liste = PRODUITS;
      if (filtre === "iconiques") liste = PRODUITS.filter((p) => p.iconique);
      else if (CATS[filtre]) liste = PRODUITS.filter((p) => p.categorie === filtre);
      g.innerHTML = liste.map(carte).join("");
    });
  }

  /* ---------------- Apparition au défilement ---------------- */
  let io;
  function reveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal, .value").forEach((el) => el.classList.add("is-in"));
      return;
    }
    io = io || new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    $$(".reveal:not(.is-in), .value:not(.is-in)").forEach((el) => io.observe(el));
  }
  window.RosalyaReveal = reveal;

  /* ---------------- Accordéons ---------------- */
  function accordeons() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".acc__btn");
      if (!b) return;
      const open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
    });
  }

  /* ---------------- Page boutique ---------------- */
  /* Vitrine d'une catégorie : grande image + cases produit + ligne des actifs */
  const VITRINE = {
    serums: { photo: ["texture-serum-hydratation", "Gel transparent étalé, ponctué de microbulles"], visuel: ["serums", "Les quatre sérums Rosalya à plat, en plein soleil"], rituel: ["rituel-serums", "Une goutte de sérum tombant d’une pipette"],
      titre: "Concentrés d’actifs", lignes: ["Quatre sérums. Un besoin chacun.", "Après la lotion, avant la crème."], bas: "Étape 3 · Traiter" },
    cremes: { photo: ["texture-creme-eclat-subtil", "Crème nacrée aux reflets satinés"], visuel: ["cremes", "Trois crèmes Rosalya sur une balustrade face à la mer"], rituel: ["rituel-cremes", "Deux mains en contre-jour, une noisette de crème sur le dos de la main"],
      titre: "Sceller les bienfaits", lignes: ["Confort, hydratation, protection.", "Après le sérum, matin et/ou soir."], bas: "Étape 4 · Hydrater" },
    "soins-specifiques": { photo: ["texture-huile-regenerante", "Goutte d’huile dorée déposée sur la pommette"], visuel: ["soins-specifiques", "Lotion, huile et gel Rosalya sur un ponton au coucher du soleil"], rituel: ["rituel-soins", "Gouttes d’eau qui coulent d’un visage penché"],
      titre: "Compléter le rituel", lignes: ["Du nettoyage fondamental", "aux huiles précieuses pour la nuit."], bas: "Nettoyer · Tonifier · Nourrir" },
    iconiques: { photo: ["texture-creme-anti-oxydante", "Crème lisse en spirale"], visuel: ["iconiques", "Les quatre soins iconiques Rosalya posés sur des blocs de pierre"], rituel: ["rituel-iconiques", "Visage allongé, peau nue, en gros plan"],
      titre: "L’essentiel Rosalya", lignes: ["Quatre best-sellers.", "Une routine complète."], bas: "Nettoyer · Traiter · Hydrater" },
  };

  /* Tuile produit plein cadre (étiquette en surimpression) */
  function tuile(p, cls = "") {
    return `<article class="tile-p ${cls}">
      <a class="tile-p__link" href="${urlProduit(p)}">
        <img src="${img(p, true)}" alt="${esc(p.nom + " – " + p.actifs)}" loading="lazy" width="700" height="875">
        ${texture(p)}
        <span class="tile-p__top"><strong>${esc(p.nom)}</strong><span>${esc(p.actifs)}</span></span>
        <span class="tile-p__bottom"><span>Voir le produit</span><span>${euro(p.prix)}</span></span>
      </a>
      <button class="tile-p__plus" data-add="${p.slug}" aria-label="Ajouter ${esc(p.nom)} au panier">+</button>
    </article>`;
  }
  const photo = (nom, alt, cls = "", legende = "", lien = "") => `
    <figure class="tile-ph ${cls}">
      <img src="assets/img/photos/${nom}.webp" alt="${esc(alt)}" loading="lazy">
      ${legende ? `<figcaption>${lien ? `<a href="${lien}">` : ""}<span>${legende}</span>${lien ? `<span>Lire plus</span></a>` : ""}</figcaption>` : ""}
    </figure>`;
  const entete = (k, info) => `<header class="showcase__head">
      <h2 class="showcase__title"><a href="boutique.html?cat=${k}">${info.label}</a></h2>
      <p class="showcase__intro">${esc(info.intro)}</p>
    </header>`;

  /* Soins spécifiques : grille aérée avec cases vides */
  function vitrineAeree(k, liste, avecTitre) {
    const info = CATS[k], [a, b, c, d, e, ...reste] = liste;
    return `<section class="showcase reveal">
      <div class="airy${liste.length === 4 ? " airy--4" : ""}">
        <div class="airy__text">
          ${avecTitre ? `<h2 class="showcase__title"><a href="boutique.html?cat=${k}">${info.label}</a></h2><p>${esc(info.intro)}</p>` : `<h2 class="showcase__title">${VITRINE[k].titre}</h2><p>${VITRINE[k].lignes.map(esc).join(" ")}</p>`}
          <a class="link" href="boutique.html?cat=${k}">Tout voir</a>
        </div>
        ${a ? tuile(a, "tile-p--soft airy__a") : ""}
        ${b ? tuile(b, "tile-p--soft airy__b") : ""}
        ${c ? tuile(c, "tile-p--soft airy__c") : ""}
        ${d ? tuile(d, "tile-p--soft airy__d") : ""}
        ${e ? tuile(e, "tile-p--soft airy__e") : ""}
        ${reste.map((p) => tuile(p, "tile-p--soft")).join("")}
        ${photo(VITRINE[k].visuel[0], VITRINE[k].visuel[1], "airy__photo")}
      </div>
    </section>`;
  }

  function vitrine(k, liste, avecTitre) {
    if (!liste.length) return "";
    return vitrineAeree(k, liste, avecTitre);
  }

  function rituel(k, liste) {
    const v = VITRINE[k];
    if (!v) return "";
    return `
      <section class="ritual reveal">
        <div class="ritual__text">
          <h2>${v.titre}</h2>
          <p class="ritual__lines">${v.lignes.map(esc).join("<br>")}</p>
          <p class="ritual__index">Index des actifs<br>${liste.map((p) => esc(p.actifs)).join("<br>")}</p>
          <p class="ritual__foot">${liste.length} soins<br>${v.bas}</p>
        </div>
        <figure class="ritual__img"><img src="assets/img/photos/${v.rituel[0]}.webp" alt="${esc(v.rituel[1])}" loading="lazy"></figure>
      </section>`;
  }

  /* Bannière en tête de chaque catégorie */
  const BANNIERES = {
    tous: ["banniere-tous", "Deux visages côte à côte, peaux lumineuses"],
    iconiques: ["banniere-iconiques", "Mousse nettoyante massée du bout des doigts sur le visage"],
    cremes: ["banniere-cremes", "Visage en clair-obscur, un trait de crème blanche sur la pommette"],
    serums: ["banniere-serums", "Pipette de sérum doré posée sur une peau lumineuse, yeux fermés"],
    "soins-specifiques": ["banniere-soins-specifiques", "Visage couvert d’un masque à l’argile rose craquelé"],
  };
  const INTRO_TOUS = "Des formules épurées, enrichies de concentrations optimales d’actifs ciblés et d’extraits botaniques. Chaque soin est nommé d’après ses ingrédients clés.";

  /* Remonte en haut de la page (avec Lenis s'il est chargé) */
  function enHaut() {
    const l = window.RosalyaLenis;
    if (l) l.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function boutique() {
    const grid = $("#shop-grid");
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "tous";
    if (cat !== "tous" && !CATS[cat]) cat = "tous";
    let tri = params.get("tri") || "defaut";

    const filtres = [["tous", "Tout"], ...Object.entries(CATS).map(([k, v]) => [k, v.label])];
    const compte = (k) =>
      k === "tous" ? PRODUITS.length : k === "iconiques" ? PRODUITS.filter((p) => p.iconique).length : PRODUITS.filter((p) => p.categorie === k).length;

    $("#filters").innerHTML = filtres
      .map(([k, t]) => `<button class="chip" data-cat="${k}" aria-pressed="${k === cat}">${t}<sup>${compte(k)}</sup></button>`)
      .join("");
    $("#sort").value = tri;

    function banniere() {
      const info = CATS[cat];
      const [nom, alt] = BANNIERES[cat];
      const im = $("#shop-hero-img");
      im.src = `assets/img/photos/${nom}.webp`;
      im.alt = alt;
      $("#shop-title").textContent = info ? info.label : "Tous les soins";
      $("#shop-intro").textContent = info ? info.intro : INTRO_TOUS;
      document.title = `${info ? info.label : "Tous les soins"} · Rosalya`;
    }

    function rendu(anime) {
      let liste = PRODUITS.slice();
      if (cat === "iconiques") liste = liste.filter((p) => p.iconique);
      else if (cat !== "tous") liste = liste.filter((p) => p.categorie === cat);
      if (tri === "prix-asc") liste.sort((a, b) => a.prix - b.prix);
      if (tri === "prix-desc") liste.sort((a, b) => b.prix - a.prix);
      if (tri === "routine") liste.sort((a, b) => a.etape - b.etape);
      $("#shop-count").textContent = `${liste.length} soin${liste.length > 1 ? "s" : ""}`;

      const peindre = () => {
        banniere();
        if (cat === "tous") {
          /* Vue « Tout » : grille simple de cartes */
          grid.className = "cells";
          grid.innerHTML = liste.map(carte).join("");
        } else {
          grid.className = "showcases";
          grid.innerHTML = vitrine(cat, liste, false) + rituel(cat, liste);
        }
        reveal();
        grid.classList.remove("is-filtering");
      };
      if (anime) { grid.classList.add("is-filtering"); setTimeout(peindre, 250); }
      else peindre();
    }

    function majUrl() {
      const u = new URL(location.href);
      u.searchParams.set("cat", cat);
      tri === "defaut" ? u.searchParams.delete("tri") : u.searchParams.set("tri", tri);
      history.replaceState(null, "", u);
    }

    function choisir(k) {
      enHaut();
      if (k === cat) return;
      cat = k;
      $$("#filters .chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.cat === k));
      majUrl();
      rendu(true);
    }

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (b) choisir(b.dataset.cat);
    });
    /* Liens de catégorie du menu : on reste sur la page et on remonte en haut */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="boutique.html"]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const k = new URL(a.href).searchParams.get("cat") || "tous";
      if (k !== "tous" && !CATS[k]) return;
      e.preventDefault();
      a.blur();
      choisir(k);
    });
    $("#sort").addEventListener("change", (e) => { tri = e.target.value; majUrl(); rendu(true); });
    rendu(false);
  }

  /* ---------------- Fiche produit ---------------- */
  /* 2e photo de la fiche : texture du produit (assets/img/photos/texture-<slug>.webp) */
  const TEXTURES = {
    "serum-purete": "Goutte de sérum transparent tombant d’une pipette",
    "serum-hydratation": "Gel transparent étalé, ponctué de microbulles",
    "serum-apaisant": "Trait de sérum laiteux sur fond blanc",
    "serum-fermete": "Goutte de sérum laiteux au bout d’une pipette",
    "creme-hydratante": "Texture de crème blanche onctueuse",
    "creme-reparatrice": "Crème riche étalée en vagues",
    "creme-anti-oxydante": "Crème lisse en spirale",
    "creme-eclat-subtil": "Crème nacrée aux reflets satinés",
    "gel-nettoyant-doux": "Mousse du gel nettoyant massée sur le visage",
    "lotion-equilibrante": "Filet d’eau coulant dans une main",
    "masque-revitalisant": "Visage riant couvert d’un masque à l’argile rose",
    "huile-regenerante": "Goutte d’huile dorée déposée sur la pommette",
    "huile-apaisante": "Vague d’huile claire",
  };

  function fiche() {
    const box = $("#pdp");
    if (!box) return;
    const slug = new URLSearchParams(location.search).get("p");
    const p = parSlug(slug);
    if (!p) {
      box.innerHTML = `<div class="empty" style="padding:120px 0"><p class="title-m">Ce soin est introuvable.</p><a class="btn" href="boutique.html">Voir tous les soins</a></div>`;
      return;
    }
    const cat = CATS[p.categorie];
    document.title = `${p.nom} – ${p.actifs} · Rosalya`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.resume);

    const etapes = [1, 2, 3, 4, 5].map((n) => `<span class="${p.etape === n ? "is-on" : ""}">${n}. ${ETAPES[n]}</span>`).join("");
    const etapeTxt = p.etape === 6
      ? "Ce masque s’utilise 1 à 2 fois par semaine, sur peau propre, avant votre sérum et votre crème."
      : `Étape ${p.etape} sur 5 : <strong>${ETAPES[p.etape].toLowerCase()}</strong>. La règle d’or : du plus fin au plus riche.`;

    box.innerHTML = `
      <nav class="breadcrumb" aria-label="Fil d’Ariane">
        <a href="boutique.html">Soins</a><span>/</span><a href="boutique.html?cat=${p.categorie}">${cat.label}</a><span>/</span>${esc(p.nom)}
      </nav>
      <div class="pdp">
        <div class="pdp__media">
          <div class="pdp__main"><img src="${img(p)}" alt="${esc(p.nom + " – " + p.actifs)}" width="1400" height="1400"></div>
          <div class="pdp__second reveal"><img src="assets/img/photos/texture-${p.slug}.webp" alt="${esc(TEXTURES[p.slug] || "")}" loading="lazy"></div>
        </div>
        <div class="pdp__info">
          <span class="label label--accent">${p.nouveau ? "Nouveauté · " : p.iconique ? "Iconique · " : ""}${cat.label}</span>
          <h1 class="pdp__title">${esc(p.nom)}<span class="pdp__actifs">${esc(p.actifs)}</span></h1>
          <p class="pdp__resume">${esc(p.resume)}</p>
          <dl class="pdp__facts">
            <div><dt class="label">Pour</dt><dd>${esc(p.peau)}</dd></div>
            <div><dt class="label">Routine</dt><dd>${p.etape === 6 ? "1 à 2 fois par semaine" : "Étape " + p.etape + " · " + ETAPES[p.etape]}</dd></div>
          </dl>
          <p class="pdp__price">${euro(p.prix)}</p>
          <div class="pdp__buy" id="buy">
            <div class="qty">
              <button type="button" data-step="-1" aria-label="Diminuer la quantité">−</button>
              <input id="qty" type="number" value="1" min="1" max="99" aria-label="Quantité">
              <button type="button" data-step="1" aria-label="Augmenter la quantité">+</button>
            </div>
            <button class="btn" data-add="${p.slug}" data-qty-from="#qty">Ajouter au panier</button>
          </div>
          <div class="accordion">
            <div class="acc">
              <button class="acc__btn" aria-expanded="true">Utilisation<span class="acc__icon"></span></button>
              <div class="acc__panel"><div><div class="acc__content">${p.utilisation.map((t) => `<p>${esc(t)}</p>`).join("")}</div></div></div>
            </div>
            <div class="acc">
              <button class="acc__btn" aria-expanded="false">Pour qui ?<span class="acc__icon"></span></button>
              <div class="acc__panel"><div><div class="acc__content"><p>${esc(p.pourQui)}</p></div></div></div>
            </div>
            <div class="acc">
              <button class="acc__btn" aria-expanded="false">Dans votre routine<span class="acc__icon"></span></button>
              <div class="acc__panel"><div><div class="acc__content"><p>${etapeTxt}</p><div class="steps-mini">${etapes}</div></div></div></div>
            </div>
            <div class="acc">
              <button class="acc__btn" aria-expanded="false">Nos engagements<span class="acc__icon"></span></button>
              <div class="acc__panel"><div><div class="acc__content"><p>Rosalya est une marque engagée et <strong>cruelty-free</strong> : aucun test sur les animaux, ni sur nos ingrédients ni sur nos produits finis. Livraison offerte dès ${SEUIL_LIVRAISON} € d’achat.</p></div></div></div>
            </div>
          </div>
        </div>
      </div>`;

    $("#buy").addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (!b) return;
      const i = $("#qty");
      i.value = Math.min(99, Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    });

    // Suggestions : même catégorie, puis le reste de la routine
    const autres = PRODUITS.filter((x) => x.slug !== p.slug);
    const reco = [
      ...autres.filter((x) => x.categorie === p.categorie),
      ...autres.filter((x) => x.categorie !== p.categorie && x.iconique),
    ].slice(0, 4);
    $("#reco").innerHTML = reco.map(carte).join("");

    // Barre d'achat mobile
    const bar = $("#buybar");
    bar.innerHTML = `<p class="buybar__name">${esc(p.nom)}<span>${euro(p.prix)}</span></p><button class="btn" data-add="${p.slug}" data-no-drawer>Ajouter</button>`;
    const obs = new IntersectionObserver(([en]) => {
      bar.classList.toggle("is-visible", !en.isIntersecting && en.boundingClientRect.top < 0);
    });
    obs.observe($("#buy"));
  }

  /* ---------------- À propos : compteurs ---------------- */
  function compteurs() {
    $$(".value").forEach((v) => {
      const cible = parseInt(v.dataset.value, 10);
      v.style.setProperty("--w", cible + "%");
      const num = $(".num", v);
      const obs = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        obs.disconnect();
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduit) { num.textContent = cible + " %"; return; }
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / 1400);
          num.textContent = Math.round(cible * (1 - Math.pow(1 - k, 3))) + " %";
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      obs.observe(v);
    });
  }

  /* ---------------- Contact ---------------- */
  function contact() {
    const f = $("#contact-form");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const msg = $("#form-msg");
      msg.textContent = `Merci ${f.nom.value.trim().split(" ")[0]}, votre message a bien été pris en compte. (Démonstration : aucun e-mail n’est réellement envoyé.)`;
      msg.classList.add("is-visible");
      f.reset();
    });
  }

  /* ---------------- Grand logo du pied de page : occupe toute la largeur ---------------- */
  function logoGeant() {
    const g = $(".footer__giant");
    if (!g) return;
    const ajuster = () => {
      g.style.fontSize = "100px";
      const largeur = g.parentElement.clientWidth -
        parseFloat(getComputedStyle(g.parentElement).paddingLeft) -
        parseFloat(getComputedStyle(g.parentElement).paddingRight);
      const naturelle = g.scrollWidth;
      if (naturelle) g.style.fontSize = Math.floor((100 * largeur) / naturelle * 0.995) + "px";
    };
    ajuster();
    if (document.fonts) document.fonts.ready.then(ajuster);
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(ajuster, 100); });
  }

  /* ---------------- Défilement fluide (Lenis) ---------------- */
  function defilementFluide() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js";
    s.onload = () => {
      if (!window.Lenis) return;
      document.documentElement.style.scrollBehavior = "auto";
      const lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      const boucle = (t) => { lenis.raf(t); requestAnimationFrame(boucle); };
      requestAnimationFrame(boucle);
      // pas de défilement de la page quand le panier ou le menu mobile sont ouverts
      new MutationObserver(() => {
        const bloque = document.body.classList.contains("cart-open") || document.body.classList.contains("menu-open");
        bloque ? lenis.stop() : lenis.start();
      }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
      window.RosalyaLenis = lenis;
    };
    document.head.appendChild(s);
  }

  /* ---------------- Démarrage ---------------- */
  enTete();
  piedDePage();
  tiroir();
  evenementsPanier();
  accordeons();
  grilles();
  sliderOnglets();
  carrousel();
  boutique();
  fiche();
  compteurs();
  contact();
  logoGeant();
  defilementFluide();
  majPanier();
  reveal();
})();
