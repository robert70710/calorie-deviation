nd };
  }

  function selectedWeekRef() {
    return addDays(new Date(), weekOffset * 7);
  }

  function selectedMonthRef() {
    return addMonths(new Date(), monthOffset);
  }

  const HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const HEB_MONTHS = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
  ];

  function formatHebrewDate(key) {
    const d = parseDateKey(key);
    return `${HEB_DAYS[d.getDay()]}, ${d.getDate()} ב${HEB_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatShortRange(start, end) {
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return `${start.getDate()}–${end.getDate()} ב${HEB_MONTHS[start.getMonth()]}`;
    }
    return `${start.getDate()} ב${HEB_MONTHS[start.getMonth()]} – ${end.getDate()} ב${HEB_MONTHS[end.getMonth()]}`;
  }

  function formatSigned(n) {
    if (n > 0) return `+${n}`;
    return String(n);
  }

  function signClass(n) {
    if (n > 0) return 'positive';
    if (n < 0) return 'negative';
    return 'zero';
  }

  function inRange(key, start, end) {
    const t = parseDateKey(key).getTime();
    return t >= start.getTime() && t <= end.getTime();
  }

  function sumInRange(start, end) {
    return entries
      .filter((e) => inRange(e.date, start, end))
      .reduce((s, e) => s + e.kcal, 0);
  