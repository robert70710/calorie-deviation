l.textContent = '';
      }, 1800);
    }
  }

  function showAuthError(message) {
    if (!authErrorEl) return;
    authErrorEl.hidden = false;
    authErrorEl.textContent = message;
  }

  function hideAuthError() {
    if (!authErrorEl) return;
    authErrorEl.hidden = true;
    authErrorEl.textContent = '';
  }

  function setAuthMsg(message, kind = '') {
    if (!authMsg) return;
    authMsg.textContent = message || '';
    authMsg.hidden = !message;
    authMsg.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }

  function isEmailUser(session) {
    if (!session || !session.user) return false;
    const u = session.user;
    if (u.is_anonymous === true) return false;
    const identities = u.identities || [];
    if (identities.length && identities.every((id) => id.provider === 'anonymous')) return false;
    return !!(u.email || (identities.length && identities.some((id) => id.provider === 'email')));
  }

  function shortEmailLabel(email) {
    if (!email) return 'משתמש';
    if (email.length <= 28) return email;
    const at = email.indexOf('@');
    if (at <= 0) return email.slice(0, 24) + '…';
    const local = email.slice(0, at);
    const domain = email.slice(at);
    if (local.length <= 12) return email;
    return local.slice(0, 10) + '…' + domain;
  }

  function showAuthScreen() {
    if (authScreen) authScreen.hidden = false;
    if (appRoot) appRoot.classList.add('app-locked');
    if (userBar) userBar.h