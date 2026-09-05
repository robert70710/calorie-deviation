       else reject(new Error('supabase global missing'));
        };
        s.onerror = function () { reject(new Error('CDN load failed')); };
        document.head.appendChild(s);
      });
    }

    try {
      await ensureSupabaseLib();
    } catch (e) {
      showAuthError('לא נטען supabase-js מה־CDN. בדקו את החיבור לרשת.');
      setAuthMsg('לא נטען supabase-js', 'error');
      return;
    }

    supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
        detectSessionInUrl: false,
      },
    });

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (bootInProgress) return;
      if (event === 'SIGNED_OUT') {
        await leaveSession();
        return;
      }
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        if (!isEmailUser(session)) return;
        if (ready && currentUserEmail === (session.user.email || null)) return;
        try {
          await enterAuthenticatedSession(session);
        } catch (err) {
          console.error(err);
          showAuthError('לא הצלחנו לטעון את הרישומים.');
          setSyncStatus('שגיאת טעינה', 'error');
        }
      }
    });

    bootInProgress = true;
    setSyncStatus('בודק התחברות…', 'busy');
    try {
      const { data: sessionData, error: 