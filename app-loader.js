(() => {
  'use strict';
  const N = 15;
  Promise.all(
    Array.from({ length: N }, (_, i) =>
      fetch('./app.c.' + i + '.js').then((r) => {
        if (!r.ok) throw new Error('app.c.' + i);
        return r.text();
      })
    )
  )
    .then((parts) => {
      const code = parts.join('');
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const s = document.createElement('scr' + 'ipt');
      s.src = url;
      s.onload = () => URL.revokeObjectURL(url);
      document.head.appendChild(s);
    })
    .catch((err) => {
      console.error(err);
      const el = document.getElementById('authError');
      if (el) { el.hidden = false; el.textContent = 'שגיאה בטעינת האפליקציה. רעננו את העמוד.'; }
    });
})();
