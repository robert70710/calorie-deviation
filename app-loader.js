(() => {
  'use strict';
  function fail(err) {
    console.error(err);
    const el = document.getElementById('authError');
    if (el) {
      el.hidden = false;
      el.textContent = 'שגיאה בטעינת האפליקציה. רעננו את העמוד.';
    }
    const msg = document.getElementById('authMsg');
    if (msg) {
      msg.hidden = false;
      msg.className = 'auth-msg error';
      msg.textContent = 'שגיאה בטעינת האפליקציה';
    }
  }
  const s = document.createElement('script');
  s.src = './app.js';
  s.async = false;
  s.onerror = () => fail(new Error('app.js load failed'));
  document.head.appendChild(s);
})();
