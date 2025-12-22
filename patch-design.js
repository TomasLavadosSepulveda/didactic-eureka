/* ==================================================
   DIDACTIC EUREKA — DISEÑO EDITORIAL FINAL
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background: #ffffff;
      color: #111;
      font-family: Georgia, "Times New Roman", serif;
    }

    article {
      max-width: 960px;
      margin: 0 auto;
      padding: 3rem 2.5rem;
      background: #fafafa;
      font-size: 1.2rem;
      line-height: 1.85;
    }

    h1 {
      border-left: 6px solid #b00020;
      padding-left: 1rem;
    }

    .article-cover {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      margin: 2rem 0 3rem;
    }

    iframe {
      width: 100%;
      height: 85vh;
      border: none;
    }

    .institutional-ad {
      max-width: 960px;
      margin: 4rem auto;
      padding: 2rem;
      border: 2px solid #000;
      background: #f3eee9;
      text-align: center;
    }

    .institutional-ad img {
      max-width: 220px;
      margin-bottom: 1rem;
    }

    .ad-text {
      color: #b00020;
      font-weight: bold;
      letter-spacing: 0.05em;
    }
  `;
  document.head.appendChild(style);

})();
/* ==================================================
   ESTILO ADITIVO — LECTURA PDF FRONTAL
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    .pdf-reading-wrapper {
      max-width: 1000px;
      margin: 0 auto 3rem auto;
      padding: 2rem;
      background: #fafafa;
    }

    .pdf-reading-wrapper iframe,
    .pdf-reading-wrapper embed,
    .pdf-reading-wrapper object {
      box-shadow: none !important;
      background: transparent !important;
    }
  `;
  document.head.appendChild(style);

})();
/* ==================================================
   SOPORTE WEB DE LECTURA Y PUBLICIDAD
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    .article-cover {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      margin: 2rem 0;
    }

    .article-text {
      font-size: 1.15rem;
      line-height: 1.85;
      margin-top: 2rem;
    }

    .eureka-footer-ad {
      margin: 4rem auto 2rem;
      padding: 2rem;
      text-align: center;
    }

    .eureka-footer-ad img {
      max-width: 260px;
      display: block;
      margin: 0 auto;
    }
  `;
  document.head.appendChild(style);

})();
document.addEventListener("click", e => {
  const a = e.target.closest("a");
  if (!a) return;
  if (a.href.endsWith(".pdf")) {
    e.preventDefault();
    alert("Este artículo se presenta en formato de lectura web.");
  }
});
const s = document.createElement("style");
s.textContent = `
a[href$=".pdf"]::after { content: ""; }
a[href$=".pdf"] { pointer-events: auto; }
`;
document.head.appendChild(s);

