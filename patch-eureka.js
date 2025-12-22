/* =========================================================
   PATCH-EUREKA.JS — ORQUESTADOR FINAL
   Correcciones definitivas de navegación y artículos
   ========================================================= */

(async function () {

  /* =========================
     ANCLAJES ÚNICOS
     ========================= */
  const NAV_ID = "eureka-nav";
  const MAIN_ID = "eureka-main";

  // Eliminar cualquier navegación previa extra
  document.querySelectorAll("nav").forEach((n, i) => {
    if (i > 0) n.remove();
  });

  let NAV = document.getElementById(NAV_ID);
  if (!NAV) {
    NAV = document.createElement("nav");
    NAV.id = NAV_ID;
    document.body.prepend(NAV);
  }

  let MAIN = document.getElementById(MAIN_ID);
  if (!MAIN) {
    MAIN = document.createElement("main");
    MAIN.id = MAIN_ID;
    document.body.appendChild(MAIN);
  }

  /* =========================
     RESET DEFENSIVO DE ESTILOS
     ========================= */
  NAV.style.position = "fixed";
  NAV.style.top = "0";
  NAV.style.left = "0";
  NAV.style.right = "0";
  NAV.style.zIndex = "1000";
  NAV.style.background = "#020617";
  NAV.style.display = "flex";
  NAV.style.gap = "48px";
  NAV.style.padding = "16px 24px";

  MAIN.style.marginTop = "120px";
  MAIN.style.maxWidth = "900px";
  MAIN.style.marginLeft = "auto";
  MAIN.style.marginRight = "auto";
  MAIN.style.display = "block";
  MAIN.style.position = "static";

  /* =========================
     UTILIDADES
     ========================= */
  const cleanTitle = (str) =>
    str
      .replace(/[:]/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .split(" ")
      .map(w => {
        if (["de","la","el","y","en","del"].includes(w)) return w;
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ");

  const hasArticles = (node) =>
    (node.pdfs && node.pdfs.length) ||
    (node.children && node.children.some(hasArticles));

  /* =========================
     CARGAR MANIFEST
     ========================= */
  let manifest;
  try {
    const r = await fetch("manifest.json", { cache: "no-store" });
    manifest = await r.json();
  } catch {
    console.warn("patch-eureka: manifest.json no disponible");
    return;
  }

  /* =========================
     NAVEGACIÓN SUPERIOR (UNA SOLA FILA)
     ========================= */
  NAV.innerHTML = "";

  manifest.tree.children
    .filter(hasArticles)
    .forEach(category => {

      const col = document.createElement("div");
      col.style.display = "flex";
      col.style.flexDirection = "column";
      col.style.gap = "8px";
      col.style.minWidth = "160px";

      const cat = document.createElement("div");
      cat.textContent = cleanTitle(category.name);
      cat.style.fontWeight = "600";
      cat.style.cursor = "pointer";
      cat.onclick = () => renderArticles(category);
      col.appendChild(cat);

      (category.children || [])
        .filter(hasArticles)
        .forEach(sub => {
          const subEl = document.createElement("div");
          subEl.textContent = cleanTitle(sub.name);
          subEl.style.fontSize = "0.85rem";
          subEl.style.cursor = "pointer";
          subEl.style.opacity = "0.8";
          subEl.onclick = () => renderArticles(sub);
          col.appendChild(subEl);
        });

      NAV.appendChild(col);
    });

  /* =========================
     RENDER ARTÍCULOS (LISTA VERTICAL REAL)
     ========================= */
  function renderArticles(node) {
    MAIN.innerHTML = "";

    const h = document.createElement("h2");
    h.textContent = cleanTitle(node.name);
    MAIN.appendChild(h);

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "16px 0";
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "12px";

    (node.children || []).filter(hasArticles).forEach(sub => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = "↳ " + cleanTitle(sub.name);
      btn.style.textAlign = "left";
      btn.style.padding = "10px 14px";
      btn.onclick = () => renderArticles(sub);
      li.appendChild(btn);
      list.appendChild(li);
    });

    (node.pdfs || []).forEach(pdf => {
      const slug = pdf.file
        .split("/")
        .pop()
        .replace(/\.pdf$/i, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `articles/${slug}.html`;
      a.textContent = pdf.title;
      a.style.display = "block";
      a.style.padding = "12px 16px";
      a.style.borderRadius = "10px";
      a.style.background = "#020617";
      a.style.color = "#e5e7eb";
      a.style.textDecoration = "none";

      li.appendChild(a);
      list.appendChild(li);
    });

    MAIN.appendChild(list);
  }

  /* =========================
     VIDEO YOUTUBE (EL TUYO)
     ========================= */
  const video = document.createElement("section");
  video.style.margin = "48px auto";
  video.style.maxWidth = "900px";

  video.innerHTML = `
    <iframe
      width="100%"
      height="400"
      src="https://www.youtube.com/embed/Qz1BU-FPkU8?loop=1&playlist=Qz1BU-FPkU8&mute=1"
      allow="autoplay; encrypted-media"
      allowfullscreen
      style="border-radius:16px;border:none;">
    </iframe>
    <div style="margin-top:8px">
      <a href="https://www.youtube.com/watch?v=Qz1BU-FPkU8" target="_blank" rel="noopener">
        Ver en YouTube
      </a>
    </div>
  `;

  MAIN.appendChild(video);

})();
git add patches/patch-eureka.js
git commit -m "Fix overlapping nav, article list, and YouTube video"
git push
document.querySelectorAll('#articulos a').forEach(link => {
  const destino = link.getAttribute('data-path');

  if (destino) {
    link.setAttribute('href', destino);
    link.setAttribute('target', '_self');
  }
});
<a data-path="articulos/filosofia/verdad.html">
  La verdad
</a>



