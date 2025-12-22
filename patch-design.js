/* ==================================================
   DIDACTIC EUREKA — PATCH DESIGN
   Diseño gráfico editorial
   Inspiración: Landing moderna (HubSpot-like)
   ================================================== */

(function () {

  /* -------- INYECTAR CSS GRÁFICO -------- */
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background: #0b0b0b;
      color: #e6e6e6;
      font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    }

    main {
      max-width: 960px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem;
    }

    article {
      max-width: 720px;
      margin: 0 auto;
      font-size: 1.05rem;
      line-height: 1.75;
    }

    h1 {
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 2.5rem;
      letter-spacing: 0.04em;
    }

    h2 {
      font-size: 1.8rem;
      margin-top: 3rem;
    }

    h3 {
      font-size: 1.4rem;
      margin-top: 2rem;
    }

    p {
      margin-bottom: 1.4rem;
    }

    a {
      color: #9ad0ff;
      text-decoration: none;
    }

    a:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    hr {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4rem 0;
    }

    /* ===== PUBLICIDAD INSTITUCIONAL ===== */

    .institutional-ad {
      margin-top: 6rem;
      padding: 3rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.12);
      text-align: center;
      opacity: 0.9;
    }

    .institutional-ad img {
      max-width: 150px;
      margin-bottom: 1.2rem;
    }

    .institutional-ad .ad-text {
      font-size: 0.85rem;
      letter-spacing: 0.28em;
      color: #b5b5b5;
    }
  `;
  document.head.appendChild(style);

  /* -------- INYECTAR BLOQUE PUBLICITARIO -------- */
  function waitFor(selector, cb) {
    const i = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(i);
        cb(el);
      }
    }, 100);
  }

  waitFor("main", (main) => {
    if (document.querySelector(".institutional-ad")) return;

    const ad = document.createElement("section");
    ad.className = "institutional-ad";
    ad.innerHTML = `
      <img src="assets/images/theoria-logo.png"
           alt="Theōría Productora Creativa" />
      <div class="ad-text">
        THEŌRÍA · PRODUCTORA CREATIVA
      </div>
    `;

    main.appendChild(ad);
  });

})();
