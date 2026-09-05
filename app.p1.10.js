monthOffset} חודשים`;
      monthCard.classList.add('is-past');
    }

    weekNextBtn.disabled = weekOffset >= 0;
    monthNextBtn.disabled = monthOffset >= 0;
    backTodayWrap.hidden = !isBrowsingPast();
  }

  function renderToday() {
    const key = todayKey();
    todayDateEl.textContent = formatHebrewDate(key);
    const entry = findEntry(key);
    if (entry) {
      todayValueEl.textContent = formatSigned(entry.kcal);
      todayValueEl.className = 'today-value ' + signClass(entry.kcal);
      logTodayBtn.textContent = 'עריכת היום';
    } else {
      todayValueEl.textContent = '—';
      todayValueEl.className = 'today-value empty';
      logTodayBtn.textContent = 'רישום היום';
    }
  }

  function filteredEntries() {
    if (historyFilter === 'all') return [...entries];
    if (historyFilter === 'week') {
      const week = getWeekBounds(selectedWeekRef());
      return entries.filter((e) => inRange(e.date, week.start, week.end));
    }
    const month = getMonthBounds(selectedMonthRef());
    return entries.filter((e) => inRange(e.date, month.start, month.end));
  }

  function renderHistoryFilters() {
    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === historyFilter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (historyFilter === 'all') {
      historyScopeToggle.textContent = 'רק השבוע הנבחר';
    } el