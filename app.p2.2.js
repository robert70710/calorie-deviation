סטייה';
    entryDate.value = date;
    entryDate.disabled = isEdit;
    if (kcal !== null && kcal !== undefined) {
      setSign(kcal < 0 ? -1 : 1);
      entryKcal.value = String(Math.abs(kcal));
    } else {
      setSign(1);
      entryKcal.value = '';
    }
    modalDelete.hidden = !isEdit;
    modalOverlay.hidden = false;
    setTimeout(() => entryKcal.focus(), 50);
  }

  function closeModal() {
    modalOverlay.hidden = true;
    editingDate = null;
    entryDate.disabled = false;
    entryKcal.value = '';
    setSign(1);
  }

  async function upsertEntry(date, kcal) {
    const prev = entries.map((e) => ({ ...e }));
    const idx = entries.findIndex((e) => e.date === date);
    if (idx >= 0) {
      entries[idx] = { date, kcal };
    } else {
      entries.push({ date, kcal });
    }
    render();
    syncBusy = true;
    setSyncStatus('שומר…', 'busy');
    try {
      await upsertEntryRemote(date, kcal);
      setSyncStatus('נשמר בענן', 'ok');
    } catch (err) {
      entries = prev;
      render();
      setSyncStatus('שגיאת שמירה', 'error');
      console.error(err);
      alert('לא הצלחנו לשמור את הרישום. בדקו את החיבור ונסו שוב.');
    } finally {
      syncBusy = false;
    }
  }

  async function deleteEntry(date) {
    const prev = entries.map((e) => ({ ...e }));
    entries = entries.filter((e) => e.date !== date);
    render();
    syncBusy = true;
    setSyncStatus('מוחק…', 'busy');
    try {
      await d