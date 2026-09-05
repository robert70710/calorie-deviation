ck', () => {
    if (monthOffset >= 0) return;
    monthOffset += 1;
    render();
  });

  backTodayBtn.addEventListener('click', resetToToday);

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      historyFilter = /** @type {'week' | 'month' | 'all'} */ (btn.dataset.filter);
      renderHistory();
    });
  });

  historyScopeToggle.addEventListener('click', () => {
    historyFilter = historyFilter === 'all' ? 'week' : 'all';
    renderHistory();
  });

  logTodayBtn.addEventListener('click', () => {
    const key = todayKey();
    const existing = findEntry(key);
    openModal({
      date: key,
      kcal: existing ? existing.kcal : null,
      isEdit: !!existing,
    });
  });

  addPastBtn.addEventListener('click', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    openModal({ date: toDateKey(yesterday), kcal: null, isEdit: false });
  });

  historyList.addEventListener('click', (ev) => {
    const item = ev.target.closest('.history-item');
    if (!item) return;
    const date = item.dataset.date;
    const existing = findEntry(date);
    if (!existing) return;
    openModal({ date, kcal: existing.kcal, isEdit: true });
  });

  historyList.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const item = ev.target.closest('.history-item');
    if (!item) return;
    ev.preventDefault();
    item.click()