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

