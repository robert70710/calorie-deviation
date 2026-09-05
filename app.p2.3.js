eleteEntryRemote(date);
      setSyncStatus('נמחק', 'ok');
    } catch (err) {
      entries = prev;
      render();
      setSyncStatus('שגיאת מחיקה', 'error');
      console.error(err);
      alert('לא הצלחנו למחוק את הרישום. בדקו את החיבור ונסו שוב.');
    } finally {
      syncBusy = false;
    }
  }

  async function enterAuthenticatedSession(session) {
    const email = (session && session.user && session.user.email) || '';
    hideAuthError();
    setAuthMsg('');
    hideAuthScreen();
    updateUserBar(email);
    setSyncStatus('טוען רישומים…', 'busy');
    entries = await fetchEntriesFromDb();
    await migrateLocalIfNeeded();
    ready = true;
    if (footerTextEl) {
      footerTextEl.textContent = 'הנתונים נשמרים בענן (Supabase) · מחובר לפי משתמש';
    }
    setSyncStatus('מסונכרן', 'ok');
    render();
  }

  async function leaveSession() {
    ready = false;
    entries = [];
    updateUserBar(null);
    showAuthScreen();
    if (footerTextEl) {
      footerTextEl.textContent = 'יש להתחבר כדי לשמור נתונים בענן';
    }
    setSyncStatus('');
    render();
  }

  // ——— Events ———
  weekPrevBtn.addEventListener('click', () => {
    weekOffset -= 1;
    render();
  });

  weekNextBtn.addEventListener('click', () => {
    if (weekOffset >= 0) return;
    weekOffset += 1;
    render();
  });

  monthPrevBtn.addEventListener('click', () => {
    monthOffset -= 1;
    render();
  });

  monthNextBtn.addEventListener('cli