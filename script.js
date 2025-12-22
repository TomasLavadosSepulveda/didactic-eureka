/* =========================================================
   Didactic-Eureka — Script maestro mínimo
   Funciones:
   1) Asegura visibilidad de pestañas (links en nav)
   2) Oculta imágenes que no existen
   ========================================================= */

/* --- 1. Asegurar que las pestañas se vean --- */
document.addEventListener("DOMContentLoaded", () => {
  const navs = document.querySelectorAll("nav, #tabs, .tabs");

  navs.forEach(nav => {
    nav.style.display = "flex";
    nav.style.flexWrap = "wrap";
    nav.style.gap = "1rem";
    nav.style.padding = "1rem";
    nav.style.background = "#f5f5f5";
    nav.style.borderBottom = "1px solid #ddd";
  });

  const links = document.querySelectorAll("nav a, #tabs a, .tabs a");
  links.forEach(a => {
    a.style.display = "inline-block";
    a.style.padding = "0.5rem 1rem";
    a.style.border = "1px solid #ccc";
    a.style.borderRadius = "6px";
    a.style.background = "#fff";
    a.style.color = "#000";
    a.style.textDecoration = "none";
    a.style.fontWeight = "500";
  });
});

/* --- 2. Ocultar imágenes inexistentes --- */
document.addEventListener(
  "error",
  function (e) {
    const el = e.target;
    if (el && el.tagName === "IMG") {
      el.style.display = "none";
    }
  },
  true
);
