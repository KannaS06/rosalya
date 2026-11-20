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
              <a href="boutique.html"${page === "boutique" || page === "produit" ? ' aria-current="page"' : ""}>Boutique</a>
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
      <nav class="mobile-menu" id="mobile-menu" aria-label="Menu mobile">
        <a href="boutique.html">Tous les soins</a>
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
         <div class="drawer__body" data-cart-lines></div>
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
  function carte(p, i = 0) {
    return `<article class="card reveal reveal-delay-${i % 4}">
      <div class="card__media">
        <img src="${img(p, true)}" alt="${esc(p.nom + " – " + p.actifs)}" loading="lazy" width="700" height="700">
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
    let i = 0, timer;
    const aller = (n, sens) => {
      const suivant = (n + slides.length) % slides.length;
      if (suivant !== i) {
        const dir = sens || (n > i ? 1 : -1);
        const entrant = slides[suivant], sortant = slides[i];
        // place la diapositive entrante sur le côté, sans animation
        entrant.style.transition = "none";
        entrant.style.transform = `translateX(${dir * 100}%)`;
        void entrant.offsetWidth;
        entrant.style.transition = "";
        entrant.style.transform = "translateX(0)";
        sortant.style.transform = `translateX(${-dir * 100}%)`;
      }
      i = suivant;
      slides.forEach((s, k) => {
        s.classList.toggle("is-active", k === i);
        s.setAttribute("aria-hidden", k !== i);
        $$("a", s).forEach((a) => (a.tabIndex = k === i ? 0 : -1));
      });
      dots.forEach((d, k) => d.setAttribute("aria-selected", k === i));
    };
    slides.forEach((s, k) => (s.style.transform = k === 0 ? "translateX(0)" : "translateX(100%)"));
    const lancer = () => { if (reduit) return; clearInterval(timer); timer = setInterval(() => aller(i + 1, 1), 6000); };
    dots.forEach((d, k) => d.addEventListener("click", () => { aller(k); lancer(); }));
    $$(".carousel__arrow", c).forEach((b) => b.addEventListener("click", () => { aller(i + parseInt(b.dataset.dir, 10), parseInt(b.dataset.dir, 10)); lancer(); }));
    c.addEventListener("mouseenter", () => clearInterval(timer));
    c.addEventListener("mouseleave", lancer);
    c.addEventListener("focusin", () => clearInterval(timer));
    let x0 = null;
    c.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    c.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { aller(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); lancer(); }
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
  function boutique() {
    const grid = $("#shop-grid");
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    let cat = params.get("cat") || "tous";
    if (cat !== "tous" && !CATS[cat]) cat = "tous";
    let tri = params.get("tri") || "defaut";

    const filtres = [["tous", "Tous les soins"], ...Object.entries(CATS).map(([k, v]) => [k, v.label])];
    const compte = (k) =>
      k === "tous" ? PRODUITS.length : k === "iconiques" ? PRODUITS.filter((p) => p.iconique).length : PRODUITS.filter((p) => p.categorie === k).length;

    $("#filters").innerHTML = filtres
      .map(([k, t]) => `<button class="chip" data-cat="${k}" aria-pressed="${k === cat}">${t}<sup>${compte(k)}</sup></button>`)
      .join("");
    $("#sort").value = tri;

    function rendu(anime) {
      let liste = PRODUITS.slice();
      if (cat === "iconiques") liste = liste.filter((p) => p.iconique);
      else if (cat !== "tous") liste = liste.filter((p) => p.categorie === cat);
      if (tri === "prix-asc") liste.sort((a, b) => a.prix - b.prix);
      if (tri === "prix-desc") liste.sort((a, b) => b.prix - a.prix);
      if (tri === "routine") liste.sort((a, b) => a.etape - b.etape);

      const info = CATS[cat];
      $("#shop-title").textContent = info ? info.label : "Tous les soins";
      $("#shop-intro").textContent = info
        ? info.intro
        : "Des formules épurées, enrichies de concentrations optimales d’actifs ciblés et d’extraits botaniques. Chaque soin est nommé d’après ses ingrédients clés, pour savoir exactement ce que vous appliquez.";
      $("#shop-count").textContent = `${liste.length} soin${liste.length > 1 ? "s" : ""}`;
      document.title = `${info ? info.label : "Tous les soins"} · Rosalya`;

      const peindre = () => {
        grid.innerHTML = liste.map(carte).join("");
        reveal();
        grid.classList.remove("is-filtering");
      };
      if (anime) { grid.classList.add("is-filtering"); setTimeout(peindre, 250); }
      else peindre();
    }

    function majUrl() {
      const u = new URL(location.href);
      cat === "tous" ? u.searchParams.delete("cat") : u.searchParams.set("cat", cat);
      tri === "defaut" ? u.searchParams.delete("tri") : u.searchParams.set("tri", tri);
      history.replaceState(null, "", u);
      $$(".nav--left a").forEach((a) => {
        const k = new URL(a.href).searchParams.get("cat");
        (k === cat || (!k && cat === "tous")) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
      });
    }

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b || b.dataset.cat === cat) return;
      cat = b.dataset.cat;
      $$("#filters .chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
      majUrl();
      rendu(true);
    });
    $("#sort").addEventListener("change", (e) => { tri = e.target.value; majUrl(); rendu(true); });
    rendu(false);
  }

  /* ---------------- Fiche produit ---------------- */
  const PHOTO_CAT = {
    serums: ["pipettes", "Pipettes de sérum"],
    cremes: ["textures-cremes", "Textures de crèmes"],
    "soins-specifiques": ["gouttes-huile", "Gouttes d’huile et de gel"],
  };
  const PHOTO_PRODUIT = {
    "gel-nettoyant-doux": ["mousse-gel", "Mousse du gel nettoyant sur le visage"],
    "masque-revitalisant": ["masque-argile", "Masque appliqué sur le visage"],
    "serum-fermete": ["deux-visages", "Deux visages, deux âges"],
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
    const [photo, alt] = PHOTO_PRODUIT[p.slug] || PHOTO_CAT[p.categorie];
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
          <div class="pdp__second reveal"><img src="assets/img/photos/${photo}.webp" alt="${esc(alt)}" loading="lazy"></div>
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
  majPanier();
  reveal();
})();
