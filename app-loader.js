(() => {
  'use strict';
  const N = 6;
  Promise.all(
    Array.from({ length: N }, (_, i) =>
      fetch('./app.b64.' + i + '.txt').then((r) => {
        if (!r.ok) throw new Error('chunk ' + i);
        return r.text();
      })
    )
  )
    .then((parts) => {
      const b64 = parts.join('');
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const code = new TextDecoder('utf-8').decode(bytes);
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
