e === 'string' && typeof e.kcal === 'number' && !Number.isNaN(e.kcal))
        .map((e) => ({ date: e.date, kcal: Math.round(e.kcal) }));
    } catch {
      return [];
    }
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

  function addDays(d, n) {
    const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    out.setDate(out.getDate() + n);
    return out;
  }

  function addMonths(d, n) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
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
    return { start, e