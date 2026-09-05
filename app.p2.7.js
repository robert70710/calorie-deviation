lse;
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (!supabase) return;
      logoutBtn.disabled = true;
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error(err);
      } finally {
        logoutBtn.disabled = false;
        await leaveSession();
        setAuthMsg('התנתקתם', 'ok');
      }
    });
  }

  // ——— Service worker ———
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* offline / file:// — ignore */
      });
    });
  }

  // ——— Boot ———
  async function boot() {
    render();
    updateAuthModeUI();
    showAuthScreen();

    const cfg = window.CALORIE_CONFIG;
    if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      showAuthError('חסרה הגדרת Supabase (config.js).');
      setAuthMsg('חסרה הגדרת Supabase', 'error');
      return;
    }

    async function ensureSupabaseLib() {
      if (window.supabase && typeof window.supabase.createClient === 'function') return;
      await new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = 'https://unpkg.com/@supabase/supabase-js@2.49.8/dist/umd/supabase.js';
        s.async = true;
        s.onload = function () {
          if (window.supabase && typeof window.supabase.createClient === 'function') resolve();
   