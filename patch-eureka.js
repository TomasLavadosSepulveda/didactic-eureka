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

