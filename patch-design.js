/* ==================================================
   DIDACTIC EUREKA — PATCH DESIGN
   Diseño gráfico editorial
   Inspiración: Landing moderna (HubSpot-like)
   ================================================== */

(function () {

  /* -------- INYECTAR CSS GRÁFICO -------- */
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background: #0b0b0b;
      color: #e6e6e6;
      font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    }

    main {
      max-width: 960px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem;
    }

    article {
      max-width: 720px;
      margin: 0 auto;
      font-size: 1.05rem;
      line-height: 1.75;
    }

    h1 {
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2.5rem;
      letter-spacing: 0.04em;
    }

    h2 {
      font-size: 1.8rem;
      margin-top: 3rem;
    }

    h3 {
      font-size: 1.4rem;
      margin-top: 2rem;
    }

    p {
      margin-bottom: 1.4rem;
    }

    a {
      color: #9ad0ff;
      text-decoration: none;
    }

    a:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    hr {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4rem 0;
    }

    /* ===== PUBLICIDAD INSTITUCIONAL ===== */

    .institutional-ad {
      margin-top: 6rem;
      padding: 3rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.12);
      text-align: center;
      opacity: 0.9;
    }

    .institutional-ad img {
      max-width: 150px;
      margin-bottom: 1.2rem;
    }

    .institutional-ad .ad-text {
      font-size: 0.85rem;
      letter-spacing: 0.28em;
      color: #b5b5b5;
    }
  `;
  document.head.appendChild(style);

  /* -------- INYECTAR BLOQUE PUBLICITARIO -------- */
  function waitFor(selector, cb) {
    const i = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(i);
        cb(el);
      }
    }, 100);
  }

  waitFor("main", (main) => {
    if (document.querySelector(".institutional-ad")) return;

    const ad = document.createElement("section");
    ad.className = "institutional-ad";
    ad.innerHTML = `
      <img src="assets/images/theoria-logo.png"
           alt="Theōría Productora Creativa" />
      <div class="ad-text">
        THEŌRÍA · PRODUCTORA CREATIVA
      </div>
    `;

    main.appendChild(ad);
  });

})();
/* ===============================
   CATEGORÍAS SIEMPRE VISIBLES
   =============================== */

nav,
aside,
.categories,
.sidebar {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

nav a,
aside a,
.categories a {
  color: #3a6ea5 !important;   /* azul sobrio */
  font-weight: 500;
}

nav a:hover,
aside a:hover {
  text-decoration: underline;
}
/* ==================================================
   CORRECCIÓN FINAL SEGURA — VISIBILIDAD + PALETA
   (bloque aditivo, no destructivo)
   ================================================== */

(function () {

  /* ---------- CSS CORRECTIVO ADITIVO ---------- */
  const correctiveStyle = document.createElement("style");
  correctiveStyle.innerHTML = `
    /* === CATEGORÍAS SIEMPRE VISIBLES === */
    nav,
    aside,
    .sidebar,
    .categories {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      pointer-events: auto !important;
    }

    nav a,
    aside a,
    .sidebar a,
    .categories a {
      color: #5a7fa6 !important;   /* azul sobrio permanente */
      font-weight: 500;
    }

    nav a:hover,
    aside a:hover {
      text-decoration: underline;
    }

    /* === PALETA SUAVE: BLANCOS · GRISES · PIEL === */
    body {
      background: #f7f7f5 !important;   /* blanco cálido */
      color: #2e2e2e !important;        /* gris texto */
    }

    main {
      background: #ffffff !important;
    }

    h1, h2, h3 {
      color: #1f1f1f !important;
    }

    p, li {
      color: #3a3a3a !important;
    }

    a {
      color: #5a7fa6 !important;
    }

    a:hover {
      color: #2f4f6f !important;
    }

    /* === TONO PIEL / PAPEL === */
    .institutional-ad {
      background: #f3eee9 !important;
      border-top: 1px solid #e2d9cf !important;
    }

    .institutional-ad .ad-text {
      color: #6b5f55 !important;
    }

    /* === NEUTRALIZAR HOVERS / FADES HEREDADOS === */
    * {
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(correctiveStyle);

})();
/* ==================================================
   CORRECCIÓN SEGURA — VISIBILIDAD DE IMÁGENES
   (cover + logo institucional)
   Bloque aditivo, no destructivo
   ================================================== */

(function () {

  /* ---------- CSS DE GARANTÍA VISUAL ---------- */
  const imgStyle = document.createElement("style");
  imgStyle.innerHTML = `
    /* === GARANTIZAR QUE LAS IMÁGENES SE VEAN === */
    img {
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      max-width: 100% !important;
      height: auto !important;
      filter: none !important;
      mix-blend-mode: normal !important;
    }

    /* === IMAGEN DE PORTADA === */
    .cover-image {
      margin: 2rem auto 3rem auto !important;
      max-height: 420px !important;
      object-fit: cover !important;
    }

    /* === LOGO INSTITUCIONAL === */
    .institutional-ad img {
      display: block !important;
      margin: 0 auto 1rem auto !important;
      opacity: 1 !important;
      filter: none !important;
    }
  `;
  document.head.appendChild(imgStyle);

  /* ---------- FALLBACK SI NO CARGA POR RUTA ---------- */
  function forceImageReload(selector) {
    const img = document.querySelector(selector);
    if (!img) return;

    // Si la imagen existe pero no tiene tamaño, forzar recarga
    if (img.complete && img.naturalWidth === 0) {
      const src = img.src;
      img.src = "";
      img.src = src + "?v=" + Date.now();
    }
  }

  /* Reintentos suaves (por carga tardía) */
  let tries = 0;
  const retry = setInterval(() => {
    forceImageReload(".cover-image");
    forceImageReload(".institutional-ad img");
    tries++;
    if (tries > 10) clearInterval(retry);
  }, 500);

})();
/* ==================================================
   CORRECCIÓN FINAL DE LECTURA
   - Artículo grande y centrado
   - Imagen visible
   - Escala editorial
   Bloque aditivo irreversible
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    /* --- ARTÍCULO COMO PÁGINA --- */
    article {
      max-width: 920px !important;
      margin: 0 auto !important;
      padding: 2.5rem 2rem !important;
      font-size: 1.1rem !important;
      line-height: 1.75 !important;
      text-align: left !important;
    }

    /* --- TÍTULOS LEGIBLES --- */
    article h1,
    article h2 {
      font-size: 2.2rem !important;
      margin-bottom: 1.8rem !important;
    }

    article h3 {
      font-size: 1.6rem !important;
      margin-top: 2.5rem !important;
    }

    /* --- IMAGEN DEL ARTÍCULO --- */
    .article-force-image {
      display: block !important;
      width: 100% !important;
      max-height: 420px !important;
      object-fit: cover !important;
      margin: 2rem auto 3rem auto !important;
      border-radius: 6px !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    /* --- ELIMINAR LAYOUT LATERAL --- */
    article *,
    article *::before,
    article *::after {
      float: none !important;
    }
  `;
  document.head.appendChild(style);

})();
/* ==================================================
   ESCALA EDITORIAL UNIVERSAL
   + VISIBILIDAD DE IMÁGENES
   Bloque aditivo
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    article {
      max-width: 980px !important;
      margin: 0 auto !important;
      padding: 3rem 2rem !important;
      font-size: 1.15rem !important;
      line-height: 1.8 !important;
    }

    .universal-cover {
      display: block !important;
      width: 100% !important;
      max-height: 440px !important;
      object-fit: cover !important;
      margin: 2rem auto 3rem auto !important;
      border-radius: 8px !important;
    }

    .institutional-ad img {
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
  `;
  document.head.appendChild(style);

})();

