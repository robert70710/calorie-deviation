(() => {
  'use strict';
  const N = 6;
  Promise.all(
    Array.from({ length: N }, (_, i) =>
      fetch('./app.gz.' + i + '.txt').then((r) => {
        if (!r.ok) throw new Error('app.gz.' + i);
        return r.text();
      })
    )
  )
    .then(async (parts) => {
      const b64 = parts.join('').replace(/\s+/g, '');
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      let code;
      if (typeof DecompressionStream !== 'undefined') {
        const ds = new DecompressionStream('gzip');
        const stream = new Blob([bytes]).stream().pipeThrough(ds);
        code = await new Response(stream).text();
      } else {
        throw new Error('DecompressionStream required');
      }
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
