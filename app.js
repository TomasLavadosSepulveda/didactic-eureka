/* Didactic-Eureka · app.js
   - Pestañas: solo carpetas con PDFs (directo o recursivo)
   - Hover: muestra subcategorías “en el lugar”
   - Click artículo: abre article.html como página nueva
*/

const OWNER  = "TomasLavadosSepulveda";
const REPO   = "didactic-eureka";
const BRANCH = "main";

const tabsEl     = document.getElementById("tabs");
const subtabsEl  = document.getElementById("subtabs");
const articlesEl = document.getElementById("articles");
const catTitleEl = document.getElementById("categoria-titulo");

function titleCase(str){
  return (str || "")
    .replace(/[:]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

// API GitHub: listar contenido de una carpeta
async function fetchDir(path=""){
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const r = await fetch(url);
  if (!r.ok) return [];
  return await r.json();
}

// ¿existen PDFs en esta carpeta o sus subcarpetas?
async function folderHasPdf(path){
  const items = await fetchDir(path);
  for (const it of items){
    if (it.type === "file" && /\.pdf$/i.test(it.name)) return true;
    if (it.type === "dir"){
      const ok = await folderHasPdf(it.path);
      if (ok) return true;
    }
  }
  return false;
}

// construir “modelo” de carpeta: subcarpetas + pdfs directos
async function buildNode(path){
  const items = await fetchDir(path);
  const dirs = items.filter(x => x.type === "dir" && !x.name.startsWith("."));
  const pdfs = items.filter(x => x.type === "file" && /\.pdf$/i.test(x.name));

  // subcarpetas que (recursivo) sí tengan PDF
  const subcats = [];
  for (const d of dirs){
    if (await folderHasPdf(d.path)){
      subcats.push({ name: d.name, path: d.path });
    }
  }

  return { path, subcats, pdfs };
}

function clearUI(){
  subtabsEl.innerHTML = "";
  articlesEl.innerHTML = "";
}

function articleLink(pdf){
  const raw = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${pdf.path}`;
  const t = titleCase(pdf.name.replace(/\.pdf$/i,""));
  const a = document.createElement("a");
  a.className = "article";
  a.href = `article.html?file=${encodeURIComponent(raw)}&title=${encodeURIComponent(t)}`;
  a.textContent = t;

  const small = document.createElement("small");
  small.textContent = pdf.path;
  a.appendChild(small);
  return a;
}

async function renderCategory(categoryPath, categoryName){
  clearUI();
  catTitleEl.textContent = titleCase(categoryName || categoryPath || "Categorías");

  const node = await buildNode(categoryPath);

  // Subcategorías “en el lugar”
  node.subcats.forEach((s) => {
    const b = document.createElement("button");
    b.className = "subtab";
    b.textContent = titleCase(s.name);
    b.onclick = async () => {
      [...subtabsEl.querySelectorAll(".subtab")].forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      await renderSubcategory(s.path, s.name);
    };
    subtabsEl.appendChild(b);
  });

  // PDFs directos de la categoría (si existen)
  node.pdfs.forEach(pdf => articlesEl.appendChild(articleLink(pdf)));

  // Si hay subcategorías, abre la primera automáticamente (mejor UX)
  if (node.subcats.length){
    const first = subtabsEl.querySelector(".subtab");
    if (first) first.click();
  }
}

async function renderSubcategory(path, name){
  articlesEl.innerHTML = "";
  catTitleEl.textContent = titleCase(name);

  const node = await buildNode(path);

  // En subcategoría: muestra PDFs directos
  node.pdfs.forEach(pdf => articlesEl.appendChild(articleLink(pdf)));

  // Y si todavía hay sub-subcarpetas con PDFs, las mostramos como “mini-subtabs”
  // (solo si te interesa escalar; si no, puedes comentar esto)
  if (node.subcats.length){
    node.subcats.forEach((s) => {
      const b = document.createElement("button");
      b.className = "subtab";
      b.textContent = "▸ " + titleCase(s.name);
      b.onclick = async () => {
        await renderSubcategory(s.path, s.name);
      };
      subtabsEl.appendChild(b);
    });
  }
}

async function init(){
  // Raíz: categorías = carpetas con PDFs
  const root = await fetchDir("");
  const dirs = root.filter(x => x.type === "dir" && !x.name.startsWith("."));

  const categories = [];
  for (const d of dirs){
    if (await folderHasPdf(d.path)){
      categories.push(d);
    }
  }

  // Render tabs
  tabsEl.innerHTML = "";
  categories.forEach((c, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "tabwrap";

    const tab = document.createElement("button");
    tab.className = "tab";
    tab.textContent = titleCase(c.name);

    const drop = document.createElement("div");
    drop.className = "dropdown";

    // Dropdown: subcategorías con PDFs
    (async () => {
      const node = await buildNode(c.path);
      node.subcats.forEach(s => {
        const item = document.createElement("div");
        item.className = "dropitem";
        item.textContent = titleCase(s.name);
        item.onclick = () => renderSubcategory(s.path, s.name);
        drop.appendChild(item);
      });
    })();

    tab.onclick = async () => {
      [...tabsEl.querySelectorAll(".tab")].forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      await renderCategory(c.path, c.name);
    };

    wrap.appendChild(tab);
    wrap.appendChild(drop);
    tabsEl.appendChild(wrap);

    if (idx === 0) tab.click();
  });
}

init();
