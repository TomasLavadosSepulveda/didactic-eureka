/**
 * DIDACTIC-EUREKA · PDF → HTML
 * Iteración 3 · Modo 1
 *
 * Genera un HTML espejo por cada PDF,
 * sin borrar ni modificar PDFs.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function titleCase(str) {
  return str
    .replace(/[:]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(full);
    } else if (
      item.isFile() &&
      item.name.toLowerCase().endsWith(".pdf")
    ) {
      generateHTML(full);
    }
  }
}

function generateHTML(pdfPath) {
  const dir = path.dirname(pdfPath);
  const pdfName = path.basename(pdfPath);
  const base = pdfName.replace(/\.pdf$/i, "");
  const htmlPath = path.join(dir, base + ".html");

  if (fs.existsSync(htmlPath)) return; // no sobrescribir

  const title = titleCase(base);

  const relPdf = "./" + pdfName;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · Didactic-Eureka</title>
<link rel="stylesheet" href="/didactic-eureka/style-editorial.css">
<style>
body {
  background: #020617;
  color: #e5e7eb;
  margin: 0;
  font-family: system-ui, sans-serif;
}
header {
  padding: 24px;
  text-align: center;
}
header a {
  color: #93c5fd;
  text-decoration: none;
  font-size: 0.9rem;
}
h1 {
  margin: 12px 0;
  font-size: 2rem;
}
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}
iframe {
  width: 100%;
  height: 85vh;
  border: none;
  border-radius: 12px;
  background: #000;
}
</style>
</head>

<body>

<header>
  <a href="/didactic-eureka/">← Volver a Didactic-Eureka</a>
  <h1>${title}</h1>
</header>

<main>
  <iframe src="${relPdf}" loading="lazy"></iframe>
</main>

</body>
</html>
`;

  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("✓ HTML creado:", htmlPath);
}

/* ---------- Ejecutar ---------- */
walk(ROOT);
console.log("✔ Generación completada");
