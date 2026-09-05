= document.getElementById('historyList');
  const emptyState = document.getElementById('emptyState');
  const addPastBtn = document.getElementById('addPastBtn');
  const historyScopeToggle = document.getElementById('historyScopeToggle');
  const filterButtons = document.querySelectorAll('.segment[data-filter]');
  const syncStatusEl = document.getElementById('syncStatus');
  const authErrorEl = document.getElementById('authError');
  const footerTextEl = document.getElementById('footerText');
  const userBar = document.getElementById('userBar');
  const userEmailEl = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  const authScreen = document.getElementById('authScreen');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authSubmit = document.getElementById('authSubmit');
  const authToggle = document.getElementById('authToggle');
  const authTitle = document.getElementById('authTitle');
  const authMsg = document.getElementById('authMsg');
  const authModeHint = document.getElementById('authModeHint');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const entryDate = document.getElementById('entryDate');
  const entryKcal = document.getElementById('entryKcal');
  co