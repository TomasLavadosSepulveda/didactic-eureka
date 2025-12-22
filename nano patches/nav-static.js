/* =========================================================
   NAV-STATIC.JS
   Iteración 2 · Archivo 1
   Navegación superior fija, categorial y estática
   ========================================================= */

(async function () {

  const MANIFEST_PATH = "manifest.json";

  function $(sel, root=document) {
    return root.querySelector(sel);
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function titleCase(str) {
    return str
      .replace(/[:]/g, "")
      .replace(/[-_]/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function hasArticles(node) {
    if (node.pdfs && node.pdfs.length) return true;
    if (node.children) return node.children.some(hasArticles);
    return false;
  }

  /* ===== Cargar manifest ===== */
  let manifest;
  try {
    const r = await fetch(MANIFEST_PATH, { cache: "no-store" });
    manifest = await r.json();
  } catch (e) {
    console.warn("nav-static: manifest.json no disponible");
    return;
  }

  /* ===== Crear NAV si no existe ===== */
  let nav = $(".de-nav-static");
  if (!nav) {
    nav = el("nav", "de-nav-static");
    document.body.prepend(nav);
  }

  const inner = el("div", "de-nav-inner");
  nav.appendChild(inner);

  /* ===== Construir categorías ===== */
  (manifest.tree.children || [])
    .filter(hasArticles)
    .forEach(category => {

      const catWrap = el("div", "de-nav-cat");
      const catTitle = el("div", "de-nav-cat-title", titleCase(category.name));

      catWrap.appendChild(catTitle);

      /* Subcategorías */
      const subWrap = el("div", "de-nav-sub");

      (category.children || [])
        .filter(hasArticles)
        .forEach(sub => {
          const subItem = el(
            "div",
            "de-nav-sub-item",
            titleCase(sub.name)
          );
          subItem.onclick = () => {
            window.dispatchEvent(
              new CustomEvent("de:navigate", { detail: sub })
            );
          };
          subWrap.appendChild(subItem);
        });

      catWrap.appendChild(subWrap);
      inner.appendChild(catWrap);

      /* Click en categoría */
      catTitle.onclick = () => {
        window.dispatchEvent(
          new CustomEvent("de:navigate", { detail: category })
        );
      };

    });

})();
