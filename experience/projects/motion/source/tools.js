// Shared header + tool-tile renderer. Each page sets window.PAGE before loading this file.
(function(){
  if (location.search.includes('anim')) document.documentElement.classList.add('anim');
  const CUSTOM = {
    core: '<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#004288"/><path d="M14 6.5l1.9 5.6 5.6 1.9-5.6 1.9L14 21.5l-1.9-5.6L6.5 14l5.6-1.9z" fill="#fff"/></svg>',
    db2:  '<svg viewBox="0 0 28 28"><ellipse cx="14" cy="7" rx="9" ry="3.5" fill="#004288"/><path d="M5 7v14c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V7c0 1.9-4 3.5-9 3.5S5 8.9 5 7z" fill="#004288" opacity=".8"/><path d="M5 14c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5" stroke="#fff" stroke-width="1.4" fill="none"/></svg>',
    gbrain:'<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#004288"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><circle cx="14" cy="14" r="3"/><circle cx="14" cy="14" r="6.5" opacity=".7"/><circle cx="14" cy="14" r="9.5" opacity=".4"/></g></svg>',
    sadie:'<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#F7A81B"/><path d="M14 8.5a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9zM12 21.5h4" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const P = window.PAGE, b = document.body;
  b.insertAdjacentHTML('afterbegin', `<div class="hdr">
    <div class="eyebrow f" style="animation-delay:.05s">${P.eyebrow}</div>
    <h1 class="f" style="animation-delay:.12s">${P.title}</h1>
    <p class="sub f" style="animation-delay:.2s">${P.sub}</p></div>`);
  let d = .25;
  P.tools.forEach(g => {
    const tiles = g.items.map(([ic, name]) => { d += .04;
      const img = CUSTOM[ic] || `<img src="icons/${ic}.svg">`;
      return `<div class="tile f" style="animation-delay:${d.toFixed(2)}s">${img}${name}</div>`; }).join('');
    b.insertAdjacentHTML('beforeend', `<div class="grp" style="left:${g.x}px;top:${g.y}px"><div class="tl f" style="animation-delay:${d.toFixed(2)}s">${g.label}</div><div class="tiles">${tiles}</div></div>`);
  });
  window.setT = window.setT || (() => {});
})();
