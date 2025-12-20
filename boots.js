(function(){

  /* 1. Inyectar CSS editorial */
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "style-editorial.css";
  document.head.appendChild(css);

  /* 2. Mostrar portada si no hay artículo abierto */
  window.addEventListener("load", () => {
    const content = document.getElementById("content");
    if(!content) return;

    // Si sigue mostrando lista (no iframe), mostramos portada
    if(!content.querySelector("iframe")){
      fetch("home.html", {cache:"no-store"})
        .then(r=>r.text())
        .then(html=>{
          // solo si aún no hay artículo
          if(!content.querySelector("iframe")){
            content.innerHTML = html;
          }
        })
        .catch(()=>{});
    }
  });

})();
