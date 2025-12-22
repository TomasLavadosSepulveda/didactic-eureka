/* ==================================================
   DIDACTIC EUREKA — PDF → HTML
   Extracción mínima, preservando estructura
   ================================================== */

const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { JSDOM } = require("jsdom");

const ROOT = process.cwd();
const EXTS = [".pdf"];

function walk(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (EXTS.includes(path.extname(item).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function convert(pdfPath) {
  const htmlPath = pdfPath.replace(/\.pdf$/i, ".html");
  if (fs.existsSync(htmlPath)) return; // no sobreescribe

  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);

  const dom = new JSDOM(`<!doctype html><html><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${path.basename(pdfPath, ".pdf")}</title>
  </head><body></body></html>`);

  const { document } = dom.window;

  const article = document.createElement("article");
  const h1 = document.createElement("h1");
  h1.textContent = path.basename(pdfPath, ".pdf");
  article.appendChild(h1);

  data.text.split("\n\n").forEach(p => {
    const para = document.createElement("p");
    para.textContent = p.trim();
    if (para.textContent) article.appendChild(para);
  });

  document.body.appendChild(article);

  fs.writeFileSync(htmlPath, dom.serialize(), "utf8");
  console.log("✔", htmlPath);
}

(async () => {
  const pdfs = walk(ROOT).filter(p => !p.includes("node_modules"));
  for (const p of pdfs) await convert(p);
})();
fs.readdirSync(dir, { withFileTypes: true })

