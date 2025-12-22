function limpiarTitulo(nombre) {
  let t = nombre
    .replace(/\.(pdf|docx)$/i, "")
    .replace(/[_\-]/g, " ")
    .replace(/tom[aá]s\s+lavados?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const corr = {
    "metafiisica":"metafísica","filosofiia":"filosofía",
    "ontoloogica":"ontológica","teologiia":"teología",
    "concienciaa":"conciencia"
  };
  for (let k in corr) t = t.replace(new RegExp(k,"gi"), corr[k]);

  return t.replace(/\b\w/g, l => l.toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-title]").forEach(el => {
    el.textContent = limpiarTitulo(el.dataset.title);
  });
});

/* === Filtrado de pestañas === */
const CARPETAS_EXCLUIDAS = [
  "assets",
  "scripts",
  ".github",
  "node_modules"
];

function esCategoriaValida(nombre, archivos) {
  if (CARPETAS_EXCLUIDAS.includes(nombre)) return false;
  return archivos.some(f => f.toLowerCase().endsWith(".pdf"));
}

/* Supone que tu lógica actual genera algo como:
   categorias = [{ nombre: "filosofia", archivos: [...] }, ...]
   Este filtro se aplica ANTES de renderizar pestañas */
if (window.categorias && Array.isArray(window.categorias)) {
  window.categorias = window.categorias.filter(c =>
    esCategoriaValida(c.nombre, c.archivos || [])
  );
}
/* ======================================================
   CAPA HYLOTRÁXICA CORRECTIVA (IRREVERSIBLE)
   - Fallback de navegación
   - Fallback de títulos
   - Exclusión suave de carpetas técnicas
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* --- 1. Navegación siempre visible --- */
  const nav = document.querySelector(".nav-tabs") || document.getElementById("nav-tabs");
  if (nav) {
    nav.style.position = "sticky";
    nav.style.top = "0";
    nav.style.zIndex = "999";
    nav.style.background = "#fff";
  }

  /* --- 2. Exclusión suave de carpetas técnicas --- */
  const EXCLUIR = new Set(["assets","scripts",".github","node_modules"]);
  document.querySelectorAll(".nav-tabs a").forEach(a => {
    const t = (a.textContent || "").toLowerCase().trim();
    if (EXCLUIR.has(t)) a.remove();
  });

  /* --- 3. Fallback de títulos legibles --- */
  document.querySelectorAll("[data-title]").forEach(el => {
    if (!el.textContent || el.textContent.trim().length < 3) {
      el.textContent = el.dataset.title
        .replace(/\.(pdf|docx)$/i,"")
        .replace(/[_\-]+/g," ")
        .replace(/tom[aá]s(\s+ignacio)?\s+lavados(\s+sep[uú]lveda)?/gi,"")
        .replace(/\b\w/g,l=>l.toUpperCase());
    }
  });

});
function humanizeTitle(filename) {
  return filename
    .replace(/\.(pdf|docx)$/i, "")
    .replace(/tom[aá]s(\s+ignacio)?\s+lavados(\s+sep[uú]lveda)?/gi, "")
    .replace(/[_\-]+/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}
titleElement.textContent = humanizeTitle(file.name);

