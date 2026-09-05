}

  function findEntry(dateKey) {
    return entries.find((e) => e.date === dateKey) || null;
  }

  function isBrowsingPast() {
    return weekOffset !== 0 || monthOffset !== 0;
  }

  // ——— Supabase CRUD ———
  function mapRows(rows) {
    return (rows || [])
      .filter((r) => r && r.entry_date != null && typeof r.kcal === 'number')
      .map((r) => ({ date: String(r.entry_date), kcal: Math.round(r.kcal) }));
  }

  async function fetchEntriesFromDb() {
    const { data, error } = await supabase
      .from('calorie_entries')
      .select('entry_date, kcal')
      .order('entry_date', { ascending: false });
    if (error) throw error;
    return mapRows(data);
  }

  async function upsertEntryRemote(date, kcal) {
    const { error } = await supabase.from('calorie_entries').upsert(
      { entry_date: date, kcal, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,entry_date' }
    );
    if (error) throw error;
  }

  async function deleteEntryRemote(date) {
    const { error } = await supabase.from('calorie_entries').delete().eq('entry_date', date);
    if (error) throw error;
  }

  async function migrateLocalIfNeeded() {
    const local = loadLocalEntries();
    if (local.length === 0) {
      localStorage.setItem(MIGRATED_KEY, '1');
      return;
    }
    if (entries.length > 0) {
      // User already has cloud data — keep local as backup, mark done
      localStorage.setItem(MIGRATED_KEY, '1');
