(() => {
  'use strict';
  const P1 = 4;
  const P2 = 5;
  function load(prefix, n) {
    return Promise.all(
      Array.from({ length: n }, (_, i) =>
        fetch('./' + prefix + '.' + i + '.js').then((r) => {
          if (!r.ok) throw new Error(prefix + '.' + i);
          return r.text();
        })
      )
    ).then((parts) => parts.join(''));
  }
  Promise.all([load('app.p1', P1), load('app.p2', P2)])
    .then(([a, b]) => {
      const code = a + b;
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => URL.revokeObjectURL(url);
      document.head.appendChild(s);
    })
    .catch((err) => {
      console.error(err);
      const el = document.getElementById('authError');
      if (el) {
        el.hidden = false;
        el.textContent = 'שגיאה בטעינת האפליקציה. רעננו את העמוד.';
      }
    });
})();
