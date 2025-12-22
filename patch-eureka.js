/* ============================
   DIDACTIC EUREKA — PATCH ÚNICO
   Modo 1 · No destructivo
============================ */

/* 1. TÍTULO → VOLVER AL INICIO */
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("h1");
  if (title && !title.querySelector("a")) {
    const text = title.textContent;
    title.innerHTML = `<a href="./" style="text-decoration:none;color:inherit">${text}</a>`;
  }
});

/* 2. CORRECCIÓN VISUAL DE TÍTULOS */
const style = document.createElement("style");
style.innerHTML = `
  h2, h3, .article-title {
    text-transform: none !important;
    font-size: 1.6rem;
    line-height: 1.35;
    margin: 1.5rem 0 1.2rem 0;
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
  }
`;
document.head.appendChild(style);

/* 3. IMAGEN DE PORTADA (SOLO EN HOME) */
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (main && !document.querySelector(".cover-image")) {
    const img = document.createElement("img");
    img.src = "assets/images/cover-didactic-eureka.jpg";
    img.alt = "Didactic Eureka";
    img.className = "cover-image";
    main.prepend(img);
  }
});

/* 4. IMAGEN AUTOMÁTICA POR ARTÍCULO (SEGÚN CATEGORÍA) */
document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector("article");
  if (!article) return;

  const path = window.location.pathname.toLowerCase();
  const categorias = [
    "filosofia","teologia","ciencia","psicologia",
    "ensayos","antropologia","derecho","linguistica","yoga"
  ];

  const categoria = categorias.find(c => path.includes(c));
  if (!categoria) return;

  if (!article.querySelector(".article-cover")) {
    const img = document.createElement("img");
    img.src = `assets/images/covers/${categoria}.jpg`;
    img.className = "article-cover";
    article.prepend(img);
  }
});

/* 5. DESACTIVAR DESCARGA SIMPLE */
document.addEventListener("contextmenu", e => e.preventDefault());

/* 6. CONTADOR DE VISITAS (GOATCOUNTER) */
(function () {
  const s = document.createElement("script");
  s.src = "//gc.zgo.at/count.js";
  s.async = true;
  s.setAttribute("data-goatcounter", "https://didactic-eureka.goatcounter.com/count");
  document.body.appendChild(s);

  const footer = document.querySelector("footer") || document.body;
  const counter = document.createElement("div");
  counter.className = "visit-counter";
  counter.innerHTML = `Visitas: <span data-goatcounter-total></span>`;
  footer.appendChild(counter);
})();
