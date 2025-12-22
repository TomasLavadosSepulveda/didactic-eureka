(function () {
  // ===== Principio de no-repetición (dedupe visual) + encuadramiento funcional =====
  function uniqueByText(elements) {
    const seen = new Set();
    return elements.filter(el => {
      const t = (el.textContent || "").trim().toLowerCase();
      if (!t) return false;
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });
  }

  function normalizeLabel(s) {
    // Quita ":" en el texto (si viene incrustado) sin reescribir fuentes
    return (s || "").replace(/:/g, "").trim();
  }

  function makeSafeHref(href) {
    if (!href) return "";
    const h = href.trim();
    if (h === "#" || h.toLowerCase().startsWith("javascript:")) return "";
    return h;
  }

  function ensureArticleLinksOpen() {
    // Regla: todo link en #articulos debe tener href válido o data-path
    const scope = document.querySelector("#articulos") || document;
    const links = Array.from(scope.querySelectorAll("a"));

    links.forEach(a => {
      const dataPath = a.getAttribute("data-path") || a.dataset?.path;
      const currentHref = makeSafeHref(a.getAttribute("href"));

      if (!currentHref && dataPath) {
        a.setAttribute("href", dataPath);
      }

      // Si aun no hay href, no inventamos: solo lo marcamos para diagnóstico visual
      if (!makeSafeHref(a.getAttribute("href"))) {
        a.classList.add("link-invalido");
      } else {
        a.classList.remove("link-invalido");
        a.setAttribute("target", "_self");
      }
    });
  }

  function renderTopCategoryTabsFromExisting() {
    // Intenta "leer" categorías ya renderizadas en cualquier parte, y solo muestra una vez en la barra canónica.
    const tabs = document.querySelector("#tabs-categorias");
    if (!tabs) return;

    // Buscar posibles títulos de categorías existentes (tolerante a tus clases reales)
    const candidates = Array.from(document.querySelectorAll(
      ".categoria-titulo, .titulo-categoria, [data-categoria], h3.categoria, h2.categoria"
    ));

    const uniques = uniqueByText(candidates).map(el => {
      const label = normalizeLabel(el.textContent);
      // Si el elemento trae un destino, lo reutilizamos. Si no, usamos ancla por label.
      const href = makeSafeHref(el.closest("a")?.getAttribute("href")) || ("#articulos");
      return { label, href };
    }).filter(x => x.label);

    // Si no encontramos nada, no rompemos: dejamos tabs vacío (iteración siguiente lo conectamos al manifest)
    if (!uniques.length) return;

    // Construir tabs canónicos (sin duplicar)
    tabs.innerHTML = ""; // runtime, no toca tu HTML fuente
    uniques.forEach((c, i) => {
      const a = document.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      a.className = i === 0 ? "is-active" : "";
      a.addEventListener("click", () => {
        Array.from(tabs.querySelectorAll("a")).forEach(x => x.classList.remove("is-active"));
        a.classList.add("is-active");
      });
      tabs.appendChild(a);
    });
  }

  function hideDuplicateNavBlocks() {
    // No-repetición: si hay dos bloques de navegación parecidos, ocultamos el segundo por heurística
    const navs = Array.from(document.querySelectorAll("nav, .nav, .tabs, .tabbar"));
    if (navs.length <= 1) return;

    // Mantén el primero visible, oculta los siguientes SOLO si parecen duplicados (muchos links)
    navs.slice(1).forEach(n => {
      const links = n.querySelectorAll("a").length;
      if (links >= 3) n.style.display = "none";
    });
  }

  function forceArticlesColumnLayout() {
    // Evita “uno encima del otro”: columna y separación
    const art = document.querySelector("#articulos") || document;
    const lists = art.querySelectorAll("ul, .lista-articulos, .articulos, .articles");
    lists.forEach(l => {
      l.style.display = "flex";
      l.style.flexDirection = "column";
      l.style.gap = "10px";
    });
  }

  // ===== Arranque =====
  document.addEventListener("DOMContentLoaded", () => {
    hideDuplicateNavBlocks();
    renderTopCategoryTabsFromExisting();
    ensureArticleLinksOpen();
    forceArticlesColumnLayout();
  });

})();
