fetch('APLICACION_INDEX.json')
  .then(r => r.json())
  .then(data => {
    const catCont = document.getElementById('tabs-categorias');
    const subCont = document.getElementById('tabs-subcategorias');
    const artCont = document.getElementById('lista-articulos');

    Object.keys(data).forEach(categoria => {
      const btn = document.createElement('button');
      btn.textContent = categoria;
      btn.onclick = () => mostrarSubcategorias(categoria);
      catCont.appendChild(btn);
    });

    function mostrarSubcategorias(cat) {
      subCont.innerHTML = '';
      artCont.innerHTML = '';

      Object.keys(data[cat]).forEach(sub => {
        const btn = document.createElement('button');
        btn.textContent = sub;
        btn.onclick = () => mostrarArticulos(cat, sub);
        subCont.appendChild(btn);
      });
    }

    function mostrarArticulos(cat, sub) {
      artCont.innerHTML = '';
      data[cat][sub].forEach(a => {
        const link = document.createElement('a');
        link.href = a.archivo;
        link.textContent = a.titulo;
        link.target = '_self';
        artCont.appendChild(link);
      });
    }
  });
