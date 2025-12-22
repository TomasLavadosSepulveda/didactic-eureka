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

