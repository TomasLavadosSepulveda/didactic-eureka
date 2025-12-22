import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

const OUT_DIR = "articles";
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugFromPath(p) {
  return p
    .split("/")
    .pop()
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function htmlTemplate({ title, pdfPath }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title} · Didactic-Eureka</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title}">
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #020617;
      color: #e5e7eb;
    }
    header {
      max-width: 960px;
      margin: 0 auto;
      padding: 24px 16px 8px;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 2rem;
    }
    a.back {
      color: #93c5fd;
      text-decoration: none;
      font-size: 0.95rem;
    }
    main {
      max-width: 960px;
      margin: 0 auto;
      padding: 16px;
    }
    iframe {
      width: 100%;
      height: 90vh;
      border: none;
      border-radius: 16px;
      background: #fff;
    }
  </style>
</head>
<body>
  <header>
    <a class="back" href="../index.html">← Volver a Didactic-Eureka</a>
    <h1>${title}</h1>
  </header>
  <main>
    <iframe src="../${pdfPath}"></iframe>
  </main>
</body>
</html>`;
}

function walk(node) {
  // artículos directos
  (node.pdfs || []).forEach(pdf => {
    const slug = slugFromPath(pdf.file);
    const outPath = path.join(OUT_DIR, `${slug}.html`);
    const html = htmlTemplate({
      title: pdf.title,
      pdfPath: pdf.file
    });
    fs.writeFileSync(outPath, html, "utf8");
    console.log("✔ generado:", outPath);
  });

  // subcategorías
  (node.children || []).forEach(walk);
}

// recorrer árbol
(manifest.tree.children || []).forEach(walk);

console.log("✔ Artículos HTML generados correctamente.");
