y';
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

  function resetToToday() {
    weekOffset = 0;
    monthOffset = 0;
    render();
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
    if (!ready) {
      setSyncStatus('יש להתחבר תחילה', 'error');
      showAuthScreen();
      return;
    }
    editingDate = isEdit ? date : null;
    modalTitle.textContent = isEdit ? 'עריכת רישום' : 'רישום 