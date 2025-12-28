document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.getElementById("tabs");
  if (!tabsContainer) return;

  const categories = [
    { id: "filosofia", label: "Filosofía" },
    { id: "teologia", label: "Teología" },
    { id: "ciencia", label: "Ciencia" },
    { id: "psicologia", label: "Psicología" },
    { id: "derecho", label: "Derecho" },
    { id: "antropologia", label: "Antropología" }
  ];

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.label;
    btn.onclick = () => {
      window.location.hash = cat.id;
    };
    tabsContainer.appendChild(btn);
  });
});
const title =
  window.TITLES_MAP[slug] ||
  slug.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
