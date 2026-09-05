nst signOver = document.getElementById('signOver');
  const signUnder = document.getElementById('signUnder');
  const modalCancel = document.getElementById('modalCancel');
  const modalSave = document.getElementById('modalSave');
  const modalDelete = document.getElementById('modalDelete');

  /** @type {Entry[]} */
  let entries = [];
  /** @type {string | null} */
  let editingDate = null;
  /** @type {1 | -1} */
  let entrySign = 1;
  /** Weeks relative to current (0 = this week, -1 = previous, …) */
  let weekOffset = 0;
  /** Months relative to current (0 = this month, -1 = previous, …) */
  let monthOffset = 0;
  /** @type {'week' | 'month' | 'all'} */
  let historyFilter = 'week';
  /** @type {import('@supabase/supabase-js').SupabaseClient | null} */
  let supabase = null;
  let syncBusy = false;
  let ready = false;
  /** @type {'login' | 'signup'} */
  let authMode = 'login';
  /** @type {string | null} */
  let currentUserEmail = null;
  let bootInProgress = false;

  // ——— Sync / auth UI ———
  let syncHideTimer = null;
  function setSyncStatus(text, kind = '') {
    if (!syncStatusEl) return;
    syncStatusEl.textContent = text || '';
    syncStatusEl.hidden = !text;
    syncStatusEl.className = 'sync-status' + (kind ? ' ' + kind : '');
    if (syncHideTimer) clearTimeout(syncHideTimer);
    if (text && kind === 'ok') {
      syncHideTimer = setTimeout(() => {
        syncStatusEl.hidden = true;
        syncStatusE