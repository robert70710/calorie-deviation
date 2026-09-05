ר ונסו שוב.';
    }
    return msg || 'שגיאת אימות';
  }

  // ——— UI render ———
  function setTotalEl(el, value) {
    el.textContent = formatSigned(value);
    el.className = 'total-value ' + signClass(value);
  }

  function renderTotals() {
    const week = getWeekBounds(selectedWeekRef());
    const monthRef = selectedMonthRef();
    const month = getMonthBounds(monthRef);
    const weekSum = sumInRange(week.start, week.end);
    const monthSum = sumInRange(month.start, month.end);

    setTotalEl(weekTotalEl, weekSum);
    setTotalEl(monthTotalEl, monthSum);
    weekRangeEl.textContent = formatShortRange(week.start, week.end);
    monthRangeEl.textContent = `${HEB_MONTHS[monthRef.getMonth()]} ${monthRef.getFullYear()}`;

    if (weekOffset === 0) {
      weekLabelEl.textContent = 'סה״כ השבוע';
      weekBadgeEl.hidden = true;
      weekCard.classList.remove('is-past');
    } else {
      weekLabelEl.textContent = 'סה״כ שבוע';
      weekBadgeEl.hidden = false;
      weekBadgeEl.textContent = weekOffset === -1 ? 'שבוע קודם' : `לפני ${-weekOffset} שבועות`;
      weekCard.classList.add('is-past');
    }

    if (monthOffset === 0) {
      monthLabelEl.textContent = 'סה״כ החודש';
      monthBadgeEl.hidden = true;
      monthCard.classList.remove('is-past');
    } else {
      monthLabelEl.textContent = 'סה״כ חודש';
      monthBadgeEl.hidden = false;
      monthBadgeEl.textContent = monthOffset === -1 ? 'חודש קודם' : `לפני ${-