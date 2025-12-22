(async function () {
  // 1) cargar manifest
  let manifest;
  try {
    const res = await fetch("manifest.json", { cache: "no-store" });
    manifest = await res.json();
  } catch (e) {
    console.warn("No manifest.json yet", e);
    return;
  }

  // 2) Título + bajada
  document.title = manifest.site?.title || "Didactic-Eureka";

  const heroTitle = document.querySelector("[data-de-hero-title]");
  const heroSub = document.querySelector("[data-de-hero-subtitle]");
  if (heroTitle) heroTitle.textContent = manifest.site?.title || "Didactic-Eureka";
  if (heroSub) heroSub.textContent = manifest.site?.subtitle || "Productividad Bifásica";

  // 3) construir nav
  const navRoot = document.querySelector("[data-de-tabs]");
  if (!navRoot) return;

  navRoot.classList.add("de-tabs");

  // Helper: solo mostrar nodos que tengan pdfs en algún punto
  function hasAnyPdf(node) {
    if (!node) return false;
    if (node.pdfs && node.pdfs.length) return true;
    return (node.children || []).some(hasAnyPdf);
  }

  // Para el dropdown: mostramos subcarpetas (como “sub-pestañas”) y pdfs
  function buildDropdown(node) {
    const dd = document.createElement("div");
    dd.className = "de-dropdown";

    // subcarpetas
    for (const child of (node.children || [])) {
      if (!hasAnyPdf(child)) continue;
      const a = document.createElement("a");
      a.className = "de-dropitem";
      a.href = "#";
      a.textContent = prettify(child.name);
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        // al click, “abrimos” ese subtree en el centro
        renderCenter(child);
      });
      dd.appendChild(a);
    }

    // pdfs directos
    for (const pdf of (node.pdfs || [])) {
      const a = document.createElement("a");
      a.className = "de-dropitem";
      a.href = pdf.file;
      a.target = "_self";
      a.rel = "noopener";
      a.textContent = pdf.title;
      dd.appendChild(a);
    }

    return dd;
  }

  function prettify(name) {
    return String(name || "")
      .replace(/:/g, " ")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map(w => w ? (w[0].toUpperCase() + w.slice(1).toLowerCase()) : "")
      .join(" ");
  }

  const top = manifest.tree?.children || [];
  for (const node of top) {
    if (!hasAnyPdf(node)) continue;

    const wrap = document.createElement("div");
    wrap.className = "de-tabwrap";

    const tab = document.createElement("div");
    tab.className = "de-tab";
    tab.textContent = prettify(node.name);

    tab.addEventListener("click", () => renderCenter(node));

    wrap.appendChild(tab);
    wrap.appendChild(buildDropdown(node));
    navRoot.appendChild(wrap);
  }

  // 4) Render central tipo “árbol” al centro
  function renderCenter(node) {
    const center = document.querySelector("[data-de-center]");
    if (!center) return;

    center.innerHTML = "";
    center.classList.add("de-main");

    const h = document.createElement("h2");
    h.textContent = prettify(node.name);
    center.appendChild(h);

    const list = document.createElement("div");
    list.style.display = "grid";
    list.style.gap = "10px";
    list.style.marginTop = "10px";

    // subcarpetas
    for (const child of (node.children || [])) {
      if (!hasAnyPdf(child)) continue;
      const btn = document.createElement("button");
      btn.textContent = "↳ " + prettify(child.name);
      btn.style.padding = "12px 14px";
      btn.style.borderRadius = "14px";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => renderCenter(child));
      list.appendChild(btn);
    }

    // pdfs
    for (const pdf of (node.pdfs || [])) {
      const a = document.createElement("a");
      a.href = pdf.file;
      a.textContent = "📄 " + pdf.title;
      a.style.display = "block";
      a.style.padding = "12px 14px";
      a.style.borderRadius = "14px";
      a.style.textDecoration = "none";
      list.appendChild(a);
    }

    center.appendChild(list);
  }

  // 5) Contador simple (local)
  try {
    const k = "de_visits";
    const v = (Number(localStorage.getItem(k)) || 0) + 1;
    localStorage.setItem(k, String(v));
    const el = document.querySelector("[data-de-visits]");
    if (el) el.textContent = String(v);
  } catch {}

  // 6) Ocultar “error” textual si existe en algún overlay
  document.querySelectorAll("*").forEach(el => {
    if (el && el.textContent && el.textContent.trim().toLowerCase() === "error") {
      el.style.display = "none";
    }
  });
})();
