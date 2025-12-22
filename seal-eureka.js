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
