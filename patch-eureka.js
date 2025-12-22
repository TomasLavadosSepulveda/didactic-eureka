/* =========================================================
   PATCH-EUREKA.JS
   Orquestador final · Iteración 2
   ========================================================= */

(async function () {

  const NAV = document.getElementById("eureka-nav");
  const MAIN = document.getElementById("eureka-main");
  if (!NAV || !MAIN) return;

  /* ---------- utilidades ---------- */
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

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  };

  const hasArticles = (node) =>
    (node.pdfs && node.pdfs.length) ||
    (node.children && node.children.some(hasArticles));

  /* ---------- cargar manifest ---------- */
  let manifest;
  try {
    const r = await fetch("manifest.json", { cache: "no-store" });
    manifest = await r.json();
  } catch {
    return;
  }

  /* ======================================================
     NAVEGACIÓN SUPERIOR (COLUMNAS REALES)
     ====================================================== */

  NAV.innerHTML = "";
  NAV.style.display = "flex";
  NAV.style.gap = "48px";
  NAV.style.padding = "16px 24px";
  NAV.style.position = "fixed";
  NAV.style.top = "0";
  NAV.style.width = "100%";
  NAV.style.background = "#020617";
  NAV.style.zIndex = "1000";

  manifest.tree.children
    .filter(hasArticles)
    .forEach(category => {

      const col = el("div", "eureka-col");
      col.style.display = "flex";
      col.style.flexDirection = "column";
      col.style.gap = "8px";
      col.style.minWidth = "160px";

      const cat = el("div", "eureka-cat", cleanTitle(category.name));
      cat.style.fontWeight = "600";
      cat.style.cursor = "pointer";

      col.appendChild(cat);

      (category.children || [])
        .filter(hasArticles)
        .forEach(sub => {
          const subEl = el("div", "eureka-sub", cleanTitle(sub.name));
          subEl.style.fontSize = "0.85rem";
          subEl.style.cursor = "pointer";
          subEl.onclick = () => renderArticles(sub);
          col.appendChild(subEl);
        });

      cat.onclick = () => renderArticles(category);
      NAV.appendChild(col);
    });

  /* ======================================================
     RENDER DE ARTÍCULOS (LISTA VERTICAL, CLICKEABLE)
     ====================================================== */

  function renderArticles(node) {
    MAIN.innerHTML = "";
    MAIN.style.marginTop = "120px";
    MAIN.style.maxWidth = "900px";
    MAIN.style.marginLeft = "auto";
    MAIN.style.marginRight = "auto";
    MAIN.style.display = "flex";
    MAIN.style.flexDirection = "column";
    MAIN.style.gap = "16px";

    const title = el("h2", null, cleanTitle(node.name));
    MAIN.appendChild(title);

    const list = el("div", "eureka-article-list");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "12px";

    /* subcategorías */
    (node.children || []).filter(hasArticles).forEach(sub => {
      const btn = el("button", "eureka-sub-btn", "↳ " + cleanTitle(sub.name));
      btn.style.textAlign = "left";
      btn.onclick = () => renderArticles(sub);
      list.appendChild(btn);
    });

    /* artículos */
    (node.pdfs || []).forEach(pdf => {
      const slug = pdf.file
        .split("/")
        .pop()
        .replace(/\.pdf$/i, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      const link = el("a", "eureka-article-link", pdf.title);
      link.href = `articles/${slug}.html`;
      link.style.textDecoration = "none";
      link.style.padding = "12px 16px";
      link.style.borderRadius = "10px";
      link.style.background = "#020617";
      link.style.color = "#e5e7eb";
      list.appendChild(link);
    });

    MAIN.appendChild(list);
  }

})();


