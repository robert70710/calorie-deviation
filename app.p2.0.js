se {
      historyScopeToggle.textContent = 'הצג הכל';
    }
  }

  function renderHistory() {
    renderHistoryFilters();
    const sorted = filteredEntries().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    historyList.innerHTML = '';

    if (sorted.length === 0) {
      historyList.classList.add('is-empty');
      emptyState.classList.add('visible');
      if (!ready) {
        emptyState.textContent = currentUserEmail ? 'טוען נתונים…' : 'יש להתחבר כדי לראות רישומים.';
      } else if (entries.length === 0) {
        emptyState.textContent = 'אין רישומים עדיין. לחצו על «רישום היום» להתחלה.';
      } else if (historyFilter === 'week') {
        emptyState.textContent = 'אין רישומים בשבוע הנבחר.';
      } else if (historyFilter === 'month') {
        emptyState.textContent = 'אין רישומים בחודש הנבחר.';
      } else {
        emptyState.textContent = 'אין רישומים להצגה.';
      }
      return;
    }

    historyList.classList.remove('is-empty');
    emptyState.classList.remove('visible');

    const today = todayKey();
    for (const e of sorted) {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.dataset.date = e.date;
      li.setAttribute('role', 'button');
      li.tabIndex = 0;

      const left = document.createElement('div');
      left.className = 'history-item-left';

      const dayEl = document.createElement('span');
      dayEl.className = 'history-da