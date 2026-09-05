 (authPassword && authPassword.value) || '';
      if (!email || !password) {
        setAuthMsg('נא למלא אימייל וסיסמה', 'error');
        return;
      }
      if (password.length < 6) {
        setAuthMsg('הסיסמה חייבת לפחות 6 תווים', 'error');
        return;
      }
      authSubmit.disabled = true;
      setAuthMsg(authMode === 'signup' ? 'נרשמים…' : 'מתחברים…', 'busy');
      try {
        if (authMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          if (data.session && isEmailUser(data.session)) {
            setAuthMsg('נרשמתם בהצלחה', 'ok');
            await enterAuthenticatedSession(data.session);
          } else {
            // Email confirmation required — no session yet
            setAuthMsg('בדוק אימייל לאישור', 'ok');
            authMode = 'login';
            updateAuthModeUI();
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (!data.session || !isEmailUser(data.session)) {
            throw new Error('לא התקבלה התחברות תקינה');
          }
          setAuthMsg('מחוברים', 'ok');
          await enterAuthenticatedSession(data.session);
        }
      } catch (err) {
        console.error(err);
        setAuthMsg(hebrewAuthError(err), 'error');
      } finally {
        authSubmit.disabled = fa