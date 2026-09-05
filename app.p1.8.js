      return;
    }
    // Local data exists and this user has none → upsert once
    setSyncStatus('מייבא נתונים מקומיים…', 'busy');
    const rows = local.map((e) => ({
      entry_date: e.date,
      kcal: e.kcal,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('calorie_entries')
      .upsert(rows, { onConflict: 'user_id,entry_date' });
    if (error) throw error;
    localStorage.setItem(MIGRATED_KEY, '1');
    localStorage.removeItem(STORAGE_KEY);
    entries = await fetchEntriesFromDb();
  }

  function hebrewAuthError(err) {
    const msg = String((err && (err.message || err.error_description)) || err || '');
    const code = String((err && (err.code || err.error_code)) || '');
    if (/email.*confirm|confirm.*email|not confirmed/i.test(msg + code)) {
      return 'בדוק אימייל לאישור';
    }
    if (/invalid login|invalid credentials|invalid email or password/i.test(msg)) {
      return 'אימייל או סיסמה שגויים';
    }
    if (/user already registered|already been registered|already exists/i.test(msg + code)) {
      return 'המשתמש כבר רשום — נסו התחברות';
    }
    if (/password/i.test(msg) && /weak|least|characters|short/i.test(msg)) {
      return 'הסיסמה קצרה מדי (לפחות 6 תווים)';
    }
    if (/rate limit|too many/i.test(msg)) {
      return 'יותר מדי ניסיונות. נסו שוב בעוד רגע.';
    }
    if (/network|fetch/i.test(msg)) {
      return 'בעיית רשת. בדקו את החיבו