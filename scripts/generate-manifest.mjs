import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// reglas: qué carpetas ignorar
const IGNORE_DIRS = new Set([
  ".git", ".github", "node_modules", "scripts",
]);

// archivos que ignorar
const IGNORE_FILES = new Set([
  "index.html", "manifest.json",
]);

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function listDir(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
}

// “Título”: sin ":" y con Inicial Mayúscula por palabra, sin tu nombre.
function toTitleCase(raw) {
  const cleaned = raw
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/:/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const forbidden = ["tomas", "lavados", "sepulveda"];
  const words = cleaned.split(" ").filter(w => !forbidden.includes(w.toLowerCase()));

  return words.map(w => {
    const lower = w.toLowerCase();
    // conserva siglas
    if (w === w.toUpperCase() && w.length <= 5) return w;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}

// buscamos PDFs dentro de carpetas (solo mostrar pestañas que terminan en PDFs)
function scanForPdfs(dir) {
  const out = [];
  for (const ent of listDir(dir)) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      out.push(...scanForPdfs(full));
    } else if (ent.isFile() && ent.name.toLowerCase().endsWith(".pdf")) {
      out.push(full);
    }
  }
  return out;
}

// construye árbol de navegación por carpetas, pero SOLO si hay PDFs debajo
function buildTree(dir, rel = "") {
  const node = { name: path.basename(dir), path: rel, children: [], pdfs: [] };

  for (const ent of listDir(dir)) {
    const full = path.join(dir, ent.name);
    const childRel = rel ? `${rel}/${ent.name}` : ent.name;

    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      const hasPdf = scanForPdfs(full).length > 0;
      if (!hasPdf) continue; // regla: pestañas solo para rutas que conducen a PDFs
      node.children.push(buildTree(full, childRel));
      continue;
    }

    if (ent.isFile()) {
      if (IGNORE_FILES.has(ent.name)) continue;
      if (ent.name.toLowerCase().endsWith(".pdf")) {
        node.pdfs.push({
          file: childRel,
          title: toTitleCase(ent.name),
        });
      }
    }
  }

  // ordenar: primero carpetas, luego pdfs
  node.children.sort((a,b)=>a.name.localeCompare(b.name));
  node.pdfs.sort((a,b)=>a.title.localeCompare(b.title));

  return node;
}

const tree = buildTree(ROOT, "");

const manifest = {
  site: {
    title: "Didactic-Eureka",
    subtitle: "Productividad Bifásica",
  },
  generatedAt: new Date().toISOString(),
  tree,
};

fs.writeFileSync(path.join(ROOT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log("manifest.json generated OK");
