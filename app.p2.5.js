;
  });

  modalCancel.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (ev) => {
    if (ev.target === modalOverlay) closeModal();
  });

  signOver.addEventListener('click', () => setSign(1));
  signUnder.addEventListener('click', () => setSign(-1));

  modalSave.addEventListener('click', () => {
    const date = entryDate.value;
    if (!date) {
      entryDate.focus();
      return;
    }
    const raw = entryKcal.value.trim();
    const abs = Number(raw);
    if (raw === '' || Number.isNaN(abs) || abs < 0) {
      entryKcal.focus();
      return;
    }
    const kcal = Math.round(abs) * entrySign;
    closeModal();
    upsertEntry(date, kcal);
  });

  modalDelete.addEventListener('click', () => {
    const date = editingDate || entryDate.value;
    if (!date) return;
    if (!confirm('למחוק את הרישום לתאריך זה?')) return;
    closeModal();
    deleteEntry(date);
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  if (authToggle) {
    authToggle.addEventListener('click', () => {
      authMode = authMode === 'login' ? 'signup' : 'login';
      setAuthMsg('');
      updateAuthModeUI();
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!supabase) return;
      const email = (authEmail && authEmail.value || '').trim();
      const password =