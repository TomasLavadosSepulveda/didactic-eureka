/* ==================================================
   DIDACTIC EUREKA — ARCHIVO SELLO
   Service Worker Editorial
   ================================================== */

const CACHE_NAME = "didactic-eureka-seal-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/style-editorial.css",
  "/patch-eureka.js",
  "/patch-design.js",
  "/assets/images/cover-didactic-eureka.jpg",
  "/assets/images/theoria-logo.png",
  "/assets/images/covers/"
];

/* INSTALACIÓN */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

/* ACTIVACIÓN */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

/* FETCH — SIEMPRE PRIORIZA CACHE */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
/* ==================================================
   SELLO V2 — CONTADOR DE VISITAS (LOCAL)
   ================================================== */

(function () {

  const KEY = "didactic-eureka-visits";

  function incrementVisits() {
    let visits = parseInt(localStorage.getItem(KEY) || "0", 10);
    visits++;
    localStorage.setItem(KEY, visits.toString());
    return visits;
  }

  function renderVisitCounter(visits) {
    if (document.querySelector(".eureka-visit-counter")) return;

    const counter = document.createElement("div");
    counter.className = "eureka-visit-counter";
    counter.innerHTML = `
      <span>Visitas:</span>
      <strong>${visits}</strong>
    `;
    document.body.appendChild(counter);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const visits = incrementVisits();
    renderVisitCounter(visits);
  });

})();
/* ==================================================
   SELLO V2 — MOSAICOS GEOMÉTRICOS EDITORIALES
   ================================================== */

(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    /* --- MOSAICO DE FONDO SUAVE --- */
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      background-image:
        linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.03) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.03) 75%);
      background-size: 40px 40px;
      background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
    }

    /* --- CONTADOR DE VISITAS --- */
    .eureka-visit-counter {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.9);
      border: 1px solid #000;
      padding: 0.6rem 0.9rem;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      color: #000;
      z-index: 999;
    }

    .eureka-visit-counter strong {
      color: #b00020;
      margin-left: 0.3rem;
    }
  `;
  document.head.appendChild(style);

})();
