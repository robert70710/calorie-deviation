(() => {
  'use strict';
  Promise.all([
    fetch('./app.part1.js').then((r) => { if (!r.ok) throw new Error('p1'); return r.text(); }),
    fetch('./app.part2.js').then((r) => { if (!r.ok) throw new Error('p2'); return r.text(); }),
  ]).then(([a, b]) => {
    const code = a + b;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => URL.revokeObjectURL(url);
    document.head.appendChild(s);
  }).catch((err) => {
    console.error(err);
    const el = document.getElementById('authError');
    if (el) { el.hidden = false; el.textContent = 'שגיאה בטעינת האפליקציה. רעננו את העמוד.'; }
  });
})();
