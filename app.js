(() => {
  'use strict';

  const STORAGE_KEY = 'calorie-deviation-entries-v1';

  /** @typedef {{ date: string, kcal: number }} Entry */

  // ——— DOM ———
  const weekTotalEl = document.getElementById('weekTotal');
  const monthTotalEl = document.getElementById('monthTotal');
  const weekRangeEl = document.getElementById('weekRange');
  const monthRangeEl = document.getElementById('monthRange');
  const todayDateEl = document.getElementById('todayDate');
  const todayValueEl = document.getElementById('todayValue');
  const logTodayBtn = document.getElementById('logTodayBtn');
  const historyList = document.getElementById('historyList');
  const emptyState = document.getElementById('emptyState');
  const addPastBtn = document.getElementById('addPastBtn');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const entryDate = document.getElementById('entryDate');
  const entryKcal = document.getElementById('entryKcal');
  const signOver = document.getElementById('signOver');
  const signUnder = document.getElementById('signUnder');
  const modalCancel = document.getElementById('modalCancel');
  const modalSave = document.getElementById('modalSave');
  const modalDelete = document.getElementById('modalDelete');

  /** @type {Entry[]} */
  let entries = loadEntries();
  /** @type {string | null} */
  let editingDate = null;
  /** @type {1 | -1} */
  let entrySign = 1;

  // ——— Storage ———
  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((e) => e && typeof e.date === 'string' && typeof e.kcal === 'number' && !Number.isNaN(e.kcal))
        .map((e) => ({ date: e.date, kcal: Math.round(e.kcal) }));
    } catch {
      return [];
    }
  }

  function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // ——— Date helpers (local timezone) ———
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  /** YYYY-MM-DD in local time */
  function toDateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function parseDateKey(key) {
    const [y, m, day] = key.split('-').map(Number);
    return new Date(y, m - 1, day);
  }

  function todayKey() {
    return toDateKey(new Date());
  }

  /** Israeli week: Sunday (0) – Saturday (6) */
  function getWeekBounds(ref = new Date()) {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    const day = d.getDay(); // 0 = Sunday
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  function getMonthBounds(ref = new Date()) {
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
    return { start, end };
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
  }

  function findEntry(dateKey) {
    return entries.find((e) => e.date === dateKey) || null;
  }

  // ——— UI render ———
  function setTotalEl(el, value) {
    el.textContent = formatSigned(value);
    el.className = 'total-value ' + signClass(value);
  }

  function renderTotals() {
    const now = new Date();
    const week = getWeekBounds(now);
    const month = getMonthBounds(now);
    const weekSum = sumInRange(week.start, week.end);
    const monthSum = sumInRange(month.start, month.end);

    setTotalEl(weekTotalEl, weekSum);
    setTotalEl(monthTotalEl, monthSum);
    weekRangeEl.textContent = formatShortRange(week.start, week.end);
    monthRangeEl.textContent = `${HEB_MONTHS[now.getMonth()]} ${now.getFullYear()}`;
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

  function renderHistory() {
    const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    historyList.innerHTML = '';

    if (sorted.length === 0) {
      historyList.classList.add('is-empty');
      emptyState.classList.add('visible');
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
      dayEl.className = 'history-day';
      const d = parseDateKey(e.date);
      dayEl.textContent = e.date === today ? 'היום' : `יום ${HEB_DAYS[d.getDay()]}`;

      const dateEl = document.createElement('span');
      dateEl.className = 'history-date';
      dateEl.textContent = `${d.getDate()} ב${HEB_MONTHS[d.getMonth()]} ${d.getFullYear()}`;

      left.appendChild(dayEl);
      left.appendChild(dateEl);

      const kcalEl = document.createElement('span');
      kcalEl.className = 'history-kcal ' + signClass(e.kcal);
      kcalEl.textContent = formatSigned(e.kcal);

      li.appendChild(left);
      li.appendChild(kcalEl);
      historyList.appendChild(li);
    }
  }

  function render() {
    renderTotals();
    renderToday();
    renderHistory();
  }

  // ——— Modal ———
  function setSign(sign) {
    entrySign = sign === -1 ? -1 : 1;
    signOver.setAttribute('aria-pressed', entrySign === 1 ? 'true' : 'false');
    signUnder.setAttribute('aria-pressed', entrySign === -1 ? 'true' : 'false');
    signOver.classList.toggle('active', entrySign === 1);
    signUnder.classList.toggle('active', entrySign === -1);
  }

  function openModal({ date, kcal, isEdit }) {
    editingDate = isEdit ? date : null;
    modalTitle.textContent = isEdit ? 'עריכת רישום' : 'רישום סטייה';
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

  function upsertEntry(date, kcal) {
    const idx = entries.findIndex((e) => e.date === date);
    if (idx >= 0) {
      entries[idx] = { date, kcal };
    } else {
      entries.push({ date, kcal });
    }
    saveEntries();
    render();
  }

  function deleteEntry(date) {
    entries = entries.filter((e) => e.date !== date);
    saveEntries();
    render();
  }

  // ——— Events ———
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
    item.click();
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
    upsertEntry(date, kcal);
    closeModal();
  });

  modalDelete.addEventListener('click', () => {
    const date = editingDate || entryDate.value;
    if (!date) return;
    if (!confirm('למחוק את הרישום לתאריך זה?')) return;
    deleteEntry(date);
    closeModal();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  // ——— Service worker ———
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* offline / file:// — ignore */
      });
    });
  }

  render();
})();
