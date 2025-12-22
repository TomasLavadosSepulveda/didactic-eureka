/* ==================================================
   DIDACTIC EUREKA — PATCH ÚNICO (ESTABLE)
   Repositorio de modificaciones · Modo 1
   ================================================== */

(function () {

  /* -------- UTILIDAD: ESPERAR ELEMENTO -------- */
  function waitFor(selector, callback, timeout = 8000) {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        callback(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, 100);
  }

  /* -------- 1. TÍTULO → HOME -------- */
  waitFor("h1", (title) => {
    if (!title.querySelector("a")) {
      const text = title.textContent.trim();
      title.innerHTML = "";
      const a = document.createElement("a");
      a.href = "./";
      a.textContent = text;
      a.style.textDecoration = "none";
      a.style.color = "inherit";
      title.appendChild(a);
    }
  });

  /* -------- 2. CSS CORRECTIVO GLOBAL -------- */
  const style = document.createElement("style");
  style.innerHTML = `
    h2, h3, .article-title {
      text-transform: none !important;
      font-size: 1.6rem !important;
      line-height: 1.35 !important;
      margin: 1.5rem 0 1.2rem 0 !important;
      letter-spacing: 0.02em;
    }

    article {
      user-select: none;
    }

    article img {
      pointer-events: none;
    }

    .cover-image {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      margin-bottom: 2rem;
      border-radius: 6px;
    }

    .article-cover {
      width: 100%;
      max-height: 260px;
      object-fit: cover;
      margin-bottom: 1.5rem;
      border-radius: 4px;
    }

    .visit-counter {
      font-size: 0.9rem;
      opacity: 0.7;
      margin-top: 2rem;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  /* -------- 3. IMAGEN DE PORTADA (HOME) -------- */
  waitFor("main", (main) => {
    if (!document.querySelector(".cover-image")) {
      const img = document.createElement("img");
      img.src = "assets/images/cover-didactic-eureka.jpg";
      img.alt = "Didactic Eureka";
      img.className = "cover-image";
      main.prepend(img);
    }
  });

  /* -------- 4. IMAGEN POR ARTÍCULO (CATEGORÍA) -------- */
  waitFor("article", (article) => {
    if (article.querySelector(".article-cover")) return;

    const path = window.location.pathname.toLowerCase();
    const categorias = [
      "filosofia","teologia","ciencia","psicologia",
      "ensayos","antropologia","derecho","linguistica","yoga"
    ];

    const categoria = categorias.find(c => path.includes(c));
    if (!categoria) return;

    const img = document.createElement("img");
    img.src = `assets/images/covers/${categoria}.jpg`;
    img.className = "article-cover";
    article.prepend(img);
  });

  /* -------- 5. BLOQUEO DESCARGA SIMPLE -------- */
  document.addEventListener("contextmenu", e => e.preventDefault());

  /* -------- 6. CONTADOR DE VISITAS (GOATCOUNTER) -------- */
  if (!window.goatcounter) {
    const s = document.createElement("script");
    s.src = "//gc.zgo.at/count.js";
    s.async = true;
    s.setAttribute(
      "data-goatcounter",
      "https://didactic-eureka.goatcounter.com/count"
    );
    document.body.appendChild(s);
  }

  waitFor("body", (body) => {
    if (!document.querySelector(".visit-counter")) {
      const counter = document.createElement("div");
      counter.className = "visit-counter";
      counter.innerHTML = `Visitas: <span data-goatcounter-total></span>`;
      body.appendChild(counter);
    }
  });

})();
function normalizeTitle(text) {
  if (!text) return text;

  // Decodifica URL (%20, etc.)
  let t = decodeURIComponent(text);

  // Quita extensión .pdf
  t = t.replace(/\.pdf$/i, "");

  // Inserta espacio antes de mayúsculas internas (camelCase)
  t = t.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");

  // Reemplaza guiones bajos y guiones por espacio
  t = t.replace(/[_\-]+/g, " ");

  // Colapsa espacios múltiples
  t = t.replace(/\s+/g, " ").trim();

  // Capitaliza primera letra de cada palabra (respetando tildes)
  t = t.replace(/\b\p{L}/gu, c => c.toUpperCase());

  return t;
}
function normalizeAllArticleTitles() {
  const candidates = document.querySelectorAll("a, h2, h3, li");

  candidates.forEach(el => {
    // Evita tocar navegación general
    if (el.closest("nav")) return;

    // Texto visible
    const text = el.textContent;
    if (!text) return;

    // Heurística: títulos sospechosos
    if (
      text.includes(".pdf") ||
      /[a-z][A-Z]/.test(text) ||
      text.includes("_")
    ) {
      el.textContent = normalizeTitle(text);
    }
  });
}
/* ==================================================
   CORRECCIÓN FINAL DEFINITIVA
   - Forzar carga de imágenes
   - Normalizar títulos SIEMPRE
   Bloque aditivo, no destructivo
   ================================================== */

(function () {

  /* ---------- 1. NORMALIZADOR ROBUSTO DE TÍTULOS ---------- */
  function normalizeTitle(text) {
    if (!text) return text;

    let t = decodeURIComponent(text);

    // quitar extensión pdf
    t = t.replace(/\.pdf$/i, "");

    // separar camelCase
    t = t.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");

    // reemplazar _ y -
    t = t.replace(/[_\-]+/g, " ");

    // colapsar espacios
    t = t.replace(/\s+/g, " ").trim();

    // capitalizar palabras (unicode)
    t = t.replace(/\b\p{L}/gu, c => c.toUpperCase());

    return t;
  }

  function normalizeAllTitles() {
    const nodes = document.querySelectorAll("a, h2, h3, li, span");

    nodes.forEach(el => {
      if (el.closest("nav")) return;

      const txt = el.textContent;
      if (!txt) return;

      if (
        txt.includes(".pdf") ||
        txt.includes("_") ||
        /[a-z][A-Z]/.test(txt)
      ) {
        el.textContent = normalizeTitle(txt);
      }
    });
  }

  /* repetir porque el sitio re-renderiza */
  let runs = 0;
  const titleInterval = setInterval(() => {
    normalizeAllTitles();
    runs++;
    if (runs > 30) clearInterval(titleInterval);
  }, 150);

  /* ---------- 2. FORZAR IMAGEN DE PORTADA (REAL) ---------- */
  function forceCoverImage() {
    if (document.querySelector(".cover-image")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const img = document.createElement("img");
    img.className = "cover-image";
    img.alt = "Didactic Eureka";

    /* RUTA ABSOLUTA + CACHE BUSTER */
    img.src =
      "https://tomaslavadossepulveda.github.io/didactic-eureka/assets/images/cover-didactic-eureka.jpg?v=" +
      Date.now();

    main.prepend(img);
  }

  let imgTries = 0;
  const imgInterval = setInterval(() => {
    forceCoverImage();
    imgTries++;
    if (imgTries > 20) clearInterval(imgInterval);
  }, 300);

})();
/* ==================================================
   BAJADA DE PRESENTACIÓN — MÉTODO BIFÁSICO HYLÓTRAXICO
   Bloque aditivo, no destructivo
   ================================================== */

(function () {

  function insertSiteSubtitle() {
    const h1 = document.querySelector("h1");
    if (!h1) return;

    // Evitar duplicados
    if (document.querySelector(".site-subtitle")) return;

    const subtitle = document.createElement("p");
    subtitle.className = "site-subtitle";
    subtitle.textContent =
      "Didactic Eureka es una plataforma editorial experimental basada en una praxis bifásica: " +
      "una fase eidética de formulación conceptual y una fase material de realización técnica. " +
      "Su marco hylotráxico articula pensamiento, forma y ejecución en un sistema coherente, " +
      "donde la idea se preserva, se prueba y se encarna sin perder unidad.";

    // Insertar inmediatamente después del título
    h1.insertAdjacentElement("afterend", subtitle);
  }

  // Reintentos suaves por render dinámico
  let tries = 0;
  const interval = setInterval(() => {
    insertSiteSubtitle();
    tries++;
    if (tries > 20) clearInterval(interval);
  }, 200);

})();
/* ==================================================
   MEJORA DE LECTURA DE ARTÍCULOS
   - Título limpio
   - Lectura frontal (no “visor PDF”)
   - Dos imágenes por artículo
   Bloque aditivo y seguro
   ================================================== */

(function () {

  /* ---------- 1. NORMALIZAR TÍTULO DEL ARTÍCULO ABIERTO ---------- */
  function normalizeTitle(text) {
    if (!text) return text;

    let t = decodeURIComponent(text);
    t = t.replace(/\.pdf$/i, "");
    t = t.replace(/[_\-]+/g, " ");
    t = t.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");
    t = t.replace(/\s+/g, " ").trim();
    t = t.replace(/\b\p{L}/gu, c => c.toUpperCase());
    return t;
  }

  function fixArticleTitle() {
    const h2 = document.querySelector("article h2, article h1");
    if (!h2) return;

    h2.textContent = normalizeTitle(h2.textContent);
  }

  /* ---------- 2. FORZAR LECTURA FRONTAL DEL PDF ---------- */
  function improvePdfReading() {
    const iframe = document.querySelector("iframe, embed, object");
    if (!iframe) return;

    iframe.style.width = "100%";
    iframe.style.height = "90vh";
    iframe.style.border = "none";
    iframe.style.boxShadow = "none";
    iframe.style.display = "block";
  }

  /* ---------- 3. INSERTAR DOS IMÁGENES EN EL ARTÍCULO ---------- */
  function insertArticleImages() {
    const article = document.querySelector("article");
    if (!article) return;

    // Evitar duplicados
    if (article.querySelector(".article-img-top")) return;

    const topImg = document.createElement("img");
    topImg.src =
      "https://tomaslavadossepulveda.github.io/didactic-eureka/assets/images/cover-didactic-eureka.jpg";
    topImg.className = "article-img-top";
    topImg.alt = "Didactic Eureka";

    const bottomImg = topImg.cloneNode();
    bottomImg.className = "article-img-bottom";

    article.prepend(topImg);
    article.appendChild(bottomImg);
  }

  /* ---------- 4. ESTILO DE LECTURA EDITORIAL ---------- */
  const style = document.createElement("style");
  style.innerHTML = `
    article {
      max-width: 820px !important;
      margin: 0 auto !important;
    }

    .article-img-top,
    .article-img-bottom {
      width: 100%;
      max-height: 360px;
      object-fit: cover;
      margin: 2rem 0;
      border-radius: 6px;
    }
  `;
  document.head.appendChild(style);

  /* ---------- EJECUCIÓN REITERADA (por render dinámico) ---------- */
  let runs = 0;
  const interval = setInterval(() => {
    fixArticleTitle();
    improvePdfReading();
    insertArticleImages();
    runs++;
    if (runs > 25) clearInterval(interval);
  }, 200);

})();
/* ==================================================
   CORRECCIÓN FINAL DE ARTÍCULOS
   - Títulos correctos
   - Lectura frontal y centrada
   - Imagen siempre visible
   Bloque aditivo irreversible
   ================================================== */

(function () {

  /* -------- NORMALIZADOR DEFINITIVO DE TÍTULOS -------- */
  function normalizeTitle(text) {
    if (!text) return text;

    let t = decodeURIComponent(text);

    t = t.replace(/\.pdf$/i, "");
    t = t.replace(/[_\-]+/g, " ");
    t = t.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");
    t = t.replace(/\s+/g, " ").trim();

    // Capitalización correcta Unicode
    t = t.replace(/\b\p{L}/gu, c => c.toUpperCase());

    return t;
  }

  function fixAllArticleTitles() {
    const candidates = document.querySelectorAll(
      "article h1, article h2, article h3, article a"
    );

    candidates.forEach(el => {
      const txt = el.textContent;
      if (!txt) return;

      if (
        txt.includes(".pdf") ||
        txt.includes("_") ||
        /[a-z][A-Z]/.test(txt)
      ) {
        el.textContent = normalizeTitle(txt);
      }
    });
  }

  /* -------- FORZAR ARTÍCULO FRONTAL -------- */
  function forceFrontalArticle() {
    const article = document.querySelector("article");
    if (!article) return;

    article.style.maxWidth = "920px";
    article.style.margin = "0 auto";
    article.style.float = "none";
    article.style.display = "block";
  }

  /* -------- IMAGEN SUPERIOR DEL ARTÍCULO -------- */
  function forceArticleImage() {
    const article = document.querySelector("article");
    if (!article) return;

    if (article.querySelector(".article-force-image")) return;

    const img = document.createElement("img");
    img.className = "article-force-image";
    img.alt = "Didactic Eureka";
    img.src =
      "https://tomaslavadossepulveda.github.io/didactic-eureka/assets/images/cover-didactic-eureka.jpg?v=" +
      Date.now();

    article.prepend(img);
  }

  /* -------- EJECUCIÓN REITERADA (DOM DINÁMICO) -------- */
  let runs = 0;
  const interval = setInterval(() => {
    fixAllArticleTitles();
    forceFrontalArticle();
    forceArticleImage();
    runs++;
    if (runs > 30) clearInterval(interval);
  }, 200);

})();
/* ==================================================
   UNIVERSALIZACIÓN DE LECTURA CORRECTA
   (forzar comportamiento tipo ciencia/física)
   Bloque aditivo
   ================================================== */

(function () {

  function forceUniversalArticleMode() {
    const article = document.querySelector("article");
    if (!article) return;

    // Forzar contenedor frontal único
    article.style.maxWidth = "980px";
    article.style.margin = "0 auto";
    article.style.float = "none";
    article.style.display = "block";
  }

  function killSideLayouts() {
    const sideCandidates = document.querySelectorAll(
      "aside, .sidebar, .side, .column, .pdf-container"
    );

    sideCandidates.forEach(el => {
      el.style.display = "none";
    });
  }

  function forceCoverImage() {
    const article = document.querySelector("article");
    if (!article) return;

    if (article.querySelector(".universal-cover")) return;

    const img = document.createElement("img");
    img.className = "universal-cover";
    img.alt = "Didactic Eureka";
    img.src =
      "https://tomaslavadossepulveda.github.io/didactic-eureka/assets/images/cover-didactic-eureka.jpg?v=" +
      Date.now();

    article.prepend(img);
  }

  function forceAdImage() {
    const ad = document.querySelector(".institutional-ad");
    if (!ad) return;

    const img = ad.querySelector("img");
    if (!img) return;

    img.style.display = "block";
    img.style.opacity = "1";
    img.style.visibility = "visible";
  }

  let runs = 0;
  const interval = setInterval(() => {
    forceUniversalArticleMode();
    killSideLayouts();
    forceCoverImage();
    forceAdImage();
    runs++;
    if (runs > 40) clearInterval(interval);
  }, 200);

})();
/* ==================================================
   CORRECCIÓN FUNCIONAL UNIVERSAL (ROOT)
   - Títulos legibles
   - Artículo frontal
   - Portada + publicidad visibles
   Bloque aditivo irreversible
   ================================================== */

(function () {

  /* ---------- NORMALIZAR TÍTULOS DE ARTÍCULOS ---------- */
  function normalizeTitle(text) {
    if (!text) return text;

    let t = decodeURIComponent(text);
    t = t.replace(/\.pdf$/i, "");
    t = t.replace(/[_\-]+/g, " ");
    t = t.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2");
    t = t.replace(/\s+/g, " ").trim();
    t = t.replace(/\b\p{L}/gu, c => c.toUpperCase());
    return t;
  }

  function fixTitles() {
    document.querySelectorAll("article h1, article h2, article h3, article a")
      .forEach(el => {
        const t = el.textContent;
        if (!t) return;
        if (t.includes(".pdf") || t.includes("_") || /[a-z][A-Z]/.test(t)) {
          el.textContent = normalizeTitle(t);
        }
      });
  }

  /* ---------- FORZAR ARTÍCULO FRONTAL ---------- */
  function forceFrontalArticle() {
    const article = document.querySelector("article");
    if (!article) return;

    article.style.maxWidth = "1000px";
    article.style.margin = "0 auto";
    article.style.float = "none";
    article.style.display = "block";
  }

  /* ---------- PORTADA DEL ARTÍCULO ---------- */
  function injectCover() {
    const article = document.querySelector("article");
    if (!article) return;
    if (article.querySelector(".article-cover")) return;

    const img = document.createElement("img");
    img.className = "article-cover";
    img.alt = "Didactic Eureka";
    img.src =
      "assets/images/cover.jpg?v=" + Date.now();

    article.prepend(img);
  }

  /* ---------- PUBLICIDAD INSTITUCIONAL ---------- */
  function forceAd() {
    let ad = document.querySelector(".institutional-ad");
    if (!ad) {
      ad = document.createElement("div");
      ad.className = "institutional-ad";
      ad.innerHTML = `
        <img src="assets/images/theoria-logo.png?v=${Date.now()}" alt="Theoria">
        <p class="ad-text">Publicidad institucional</p>
      `;
      document.body.appendChild(ad);
    }
  }

  /* ---------- EJECUCIÓN REITERADA ---------- */
  let runs = 0;
  const interval = setInterval(() => {
    fixTitles();
    forceFrontalArticle();
    injectCover();
    forceAd();
    runs++;
    if (runs > 40) clearInterval(interval);
  }, 200);

})();

