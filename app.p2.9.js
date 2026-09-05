sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const session = sessionData.session;
      if (session && isEmailUser(session)) {
        await enterAuthenticatedSession(session);
      } else {
        if (session && !isEmailUser(session)) {
          // Drop leftover anonymous session — login required
          try { await supabase.auth.signOut(); } catch (_) { /* ignore */ }
        }
        await leaveSession();
        setSyncStatus('');
      }
    } catch (err) {
      console.error(err);
      ready = false;
      showAuthScreen();
      showAuthError('לא הצלחנו להתחבר ל־Supabase. בדקו את החיבור ונסו לרענן.');
      setAuthMsg('שגיאת חיבור', 'error');
      setSyncStatus('שגיאת חיבור', 'error');
      render();
    } finally {
      bootInProgress = false;
    }
  }

  boot();
})();
