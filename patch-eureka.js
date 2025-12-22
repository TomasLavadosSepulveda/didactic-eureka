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
