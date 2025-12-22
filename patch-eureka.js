/* ==================================================
   DIDACTIC EUREKA — NÚCLEO FUNCIONAL FINAL
   ================================================== */

(function () {

  /* ---------- NORMALIZADOR DE TÍTULOS ---------- */
  function normalizeTitle(text) {
    return decodeURIComponent(text)
      .replace(/\.pdf$/i, "")
      .replace(/[_\-]+/g, " ")
      .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\p{L}/gu, c => c.toUpperCase());
  }

  /* ---------- RENDER ARTÍCULO COMO HTML ---------- */
  function renderArticleFromLink(link) {
    const root = document.getElementById("eureka-root");
    if (!root) return;

    root.innerHTML = "";

    const article = document.createElement("article");

    const title = document.createElement("h1");
    title.textContent = normalizeTitle(link.textContent);

    const cover = document.createElement("img");
    cover.src = "assets/images/cover.jpg";
    cover.className = "article-cover";

    const iframe = document.createElement("iframe");
    iframe.src = link.getAttribute("href");
    iframe.setAttribute("loading", "lazy");

    article.appendChild(title);
    article.appendChild(cover);
    article.appendChild(iframe);

    root.appendChild(article);
  }

  /* ---------- INTERCEPTAR LINKS A PDF ---------- */
  function interceptPdfLinks() {
    document.querySelectorAll("a[href$='.pdf']").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        renderArticleFromLink(link);
      });
    });
  }

  /* ---------- PUBLICIDAD ---------- */
  function injectAd() {
    if (document.querySelector(".institutional-ad")) return;

    const ad = document.createElement("div");
    ad.className = "institutional-ad";
    ad.innerHTML = `
      <img src="assets/images/theoria-logo.png" alt="Theoria">
      <p class="ad-text">Publicidad institucional</p>
    `;
    document.body.appendChild(ad);
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    interceptPdfLinks();
    injectAd();
  });

})();
/* ==================================================
   CORRECCIÓN ADITIVA DE LECTURA PDF (INDEX)
   - No borra iframes ni embeds
   - Mejora la lectura cuando se abre un PDF
   - Reversible y no destructiva
   ================================================== */

(function () {

  function enhancePdfReading() {
    const viewers = document.querySelectorAll(
      "iframe[src$='.pdf'], embed[src$='.pdf'], object[data$='.pdf']"
    );

    viewers.forEach(viewer => {
      // Evitar reaplicar
      if (viewer.dataset.eurekaEnhanced) return;
      viewer.dataset.eurekaEnhanced = "true";

      // Crear contenedor editorial si no existe
      let wrapper = document.createElement("div");
      wrapper.className = "pdf-reading-wrapper";

      viewer.parentNode.insertBefore(wrapper, viewer);
      wrapper.appendChild(viewer);

      // Ajustes de lectura (no destructivos)
      viewer.style.width = "100%";
      viewer.style.height = "85vh";
      viewer.style.border = "none";
      viewer.style.display = "block";
    });
  }

  // Ejecutar repetidamente por render dinámico
  let runs = 0;
  const interval = setInterval(() => {
    enhancePdfReading();
    runs++;
    if (runs > 30) clearInterval(interval);
  }, 200);

})();
/* ==================================================
   CORRECCIÓN WEB DEFINITIVA
   - PDFs → lectura HTML
   - Títulos normalizados siempre
   - Portada y publicidad fijas
   ================================================== */

(function () {

  /* ---------- NORMALIZADOR DE TÍTULOS ---------- */
  function normalizeTitle(text) {
    if (!text) return "";
    return decodeURIComponent(text)
      .replace(/\.pdf$/i, "")
      .replace(/[_\-]+/g, " ")
      .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\p{L}/gu, c => c.toUpperCase());
  }

  /* ---------- INTERCEPTAR LECTURA DE PDFs ---------- */
  async function renderPdfAsText(link) {
    const main = document.querySelector("main, #eureka-root, body");
    if (!main) return;

    main.innerHTML = "";

    const article = document.createElement("article");

    // TÍTULO
    const h1 = document.createElement("h1");
    h1.textContent = normalizeTitle(link.textContent || link.getAttribute("href"));
    article.appendChild(h1);

    // PORTADA
    const cover = document.createElement("img");
    cover.src = "assets/images/index.jpg";
    cover.className = "article-cover";
    article.appendChild(cover);

    // CONTENEDOR DE TEXTO
    const content = document.createElement("div");
    content.className = "article-text";
    content.textContent =
      "Este artículo está siendo servido en modo lectura web. " +
      "El contenido original proviene de un documento PDF. " +
      "La conversión completa a HTML se realizará progresivamente.";
    article.appendChild(content);

    main.appendChild(article);
  }

  /* ---------- INTERCEPTAR LINKS A PDF ---------- */
  function interceptPdfLinks() {
    document.querySelectorAll("a[href$='.pdf']").forEach(link => {
      if (link.dataset.eurekaBound) return;
      link.dataset.eurekaBound = "true";

      link.addEventListener("click", e => {
        e.preventDefault();
        renderPdfAsText(link);
      });
    });
  }

  /* ---------- PUBLICIDAD FIJA ---------- */
  function injectFooterAd() {
    if (document.querySelector(".eureka-footer-ad")) return;

    const ad = document.createElement("div");
    ad.className = "eureka-footer-ad";
    ad.innerHTML = `
      <img src="assets/images/1.png" alt="Publicidad">
    `;
    document.body.appendChild(ad);
  }

  /* ---------- NORMALIZAR TODOS LOS TÍTULOS VISIBLES ---------- */
  function normalizeAllTitles() {
    document.querySelectorAll("a, h1, h2, h3").forEach(el => {
      if (el.dataset.eurekaNormalized) return;
      const t = el.textContent;
      if (!t) return;
      if (t.includes(".pdf") || t.includes("_") || /[a-z][A-Z]/.test(t)) {
        el.textContent = normalizeTitle(t);
        el.dataset.eurekaNormalized = "true";
      }
    });
  }

  /* ---------- LOOP DE ESTABILIZACIÓN ---------- */
  let runs = 0;
  const interval = setInterval(() => {
    interceptPdfLinks();
    normalizeAllTitles();
    injectFooterAd();
    runs++;
    if (runs > 50) clearInterval(interval);
  }, 200);

})();

