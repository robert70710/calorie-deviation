idden = true;
    ready = false;
    currentUserEmail = null;
  }

  function hideAuthScreen() {
    if (authScreen) authScreen.hidden = true;
    if (appRoot) appRoot.classList.remove('app-locked');
  }

  function updateAuthModeUI() {
    const isSignup = authMode === 'signup';
    if (authTitle) authTitle.textContent = isSignup ? 'הרשמה' : 'התחברות';
    if (authSubmit) authSubmit.textContent = isSignup ? 'הרשמה' : 'התחברות';
    if (authToggle) {
      authToggle.textContent = isSignup ? 'כבר רשומים? התחברות' : 'אין חשבון? הרשמה';
    }
    if (authModeHint) {
      authModeHint.textContent = isSignup
        ? 'צרו חשבון עם אימייל וסיסמה'
        : 'התחברו עם האימייל והסיסמה שלכם';
    }
  }

  function updateUserBar(email) {
    currentUserEmail = email || null;
    if (!userBar) return;
    if (email) {
      userBar.hidden = false;
      if (userEmailEl) {
        userEmailEl.textContent = shortEmailLabel(email);
        userEmailEl.title = email;
      }
    } else {
      userBar.hidden = true;
      if (userEmailEl) {
        userEmailEl.textContent = '';
        userEmailEl.title = '';
      }
    }
  }

  // ——— LocalStorage helpers (migration only) ———
  function loadLocalEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((e) => e && typeof e.dat