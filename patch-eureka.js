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

