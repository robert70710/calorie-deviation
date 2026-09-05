(() => {
  'use strict';

  const STORAGE_KEY = 'calorie-deviation-entries-v1';
  const MIGRATED_KEY = 'calorie-deviation-migrated-to-supabase-v1';

  /** @typedef {{ date: string, kcal: number }} Entry */

  // ——— DOM ———
  const appRoot = document.querySelector('.app');
  const weekTotalEl = document.getElementById('weekTotal');
  const monthTotalEl = document.getElementById('monthTotal');
  const weekRangeEl = document.getElementById('weekRange');
  const monthRangeEl = document.getElementById('monthRange');
  const weekLabelEl = document.getElementById('weekLabel');
  const monthLabelEl = document.getElementById('monthLabel');
  const weekBadgeEl = document.getElementById('weekBadge');
  const monthBadgeEl = document.getElementById('monthBadge');
  const weekCard = document.getElementById('weekCard');
  const monthCard = document.getElementById('monthCard');
  const weekPrevBtn = document.getElementById('weekPrev');
  const weekNextBtn = document.getElementById('weekNext');
  const monthPrevBtn = document.getElementById('monthPrev');
  const monthNextBtn = document.getElementById('monthNext');
  const backTodayWrap = document.getElementById('backTodayWrap');
  const backTodayBtn = document.getElementById('backTodayBtn');
  const todayDateEl = document.getElementById('todayDate');
  const todayValueEl = document.getElementById('todayValue');
  const logTodayBtn = document.getElementById('logTodayBtn');
  const historyList 