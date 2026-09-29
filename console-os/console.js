(function () {
  'use strict';

  var API_BASE = window.IVAN_PRIVATE_API_BASE;
  var asOf = document.getElementById('as-of');
  var logoutButton = document.getElementById('logout-button');
  var statusCard = document.getElementById('console-status');
  var laneContainer = document.getElementById('lane-container');
  var sourceState = document.getElementById('source-state');
  var sourceSha = document.getElementById('source-sha');
  var sourceName = document.getElementById('source-name');

  var LANE_LABELS = {
    'Shared Ivan OS': 'SHARED IVAN OS',
    Peregrine: 'PEREGRINE',
    Mortgage: 'MORTGAGE',
    Career: 'CAREER',
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function displayDate(raw) {
    var date = raw ? new Date(raw) : new Date();
    if (Number.isNaN(date.getTime())) date = new Date();
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  }

  function rowHtml(row) {
    var details = [
      row.provider_id ? '<span><b>Provider ID</b> ' + escapeHtml(row.provider_id) + '</span>' : '',
      row.proof_kind ? '<span><b>Proof</b> ' + escapeHtml(row.proof_kind) + '</span>' : '',
      row.canonical_contract ? '<span><b>Contract</b> ' + escapeHtml(row.canonical_contract) + '</span>' : '',
      row.receipt_path ? '<span><b>Receipt</b> ' + escapeHtml(row.receipt_path) + '</span>' : '',
      row.evidence_path ? '<span><b>Evidence</b> ' + escapeHtml(row.evidence_path) + '</span>' : '',
    ].filter(Boolean).join('');

    return (
      '<tr>' +
        '<td class="automation-cell">' +
          '<details>' +
            '<summary>' + escapeHtml(row.automation || '—') + '</summary>' +
            '<div class="row-details">' + details + '</div>' +
          '</details>' +
        '</td>' +
        '<td>' + escapeHtml(row.role || '—') + '</td>' +
        '<td>' + escapeHtml(row.where || '—') + '</td>' +
        '<td class="schedule-cell">' + escapeHtml(row.schedule || '—') + '</td>' +
        '<td class="runtime-cell">' + escapeHtml(row.run_time || '—') + '</td>' +
        '<td class="result-cell">' + escapeHtml(row.result || '—') + '</td>' +
        '<td class="change-cell">' + escapeHtml(row.what_happened || '—') + '</td>' +
        '<td class="ivan-cell">' + escapeHtml(row.ivan || 'No') + '</td>' +
      '</tr>'
    );
  }

  function laneHtml(group) {
    var rows = Array.isArray(group.rows) ? group.rows : [];
    return (
      '<section class="lane-card">' +
        '<div class="lane-head">' +
          '<h2>' + escapeHtml(LANE_LABELS[group.lane] || group.lane || 'OTHER') + '</h2>' +
          '<span>' + rows.length + ' automation' + (rows.length === 1 ? '' : 's') + '</span>' +
        '</div>' +
        '<div class="table-wrap">' +
          '<table>' +
            '<thead><tr>' +
              '<th>Automation</th>' +
              '<th>Role</th>' +
              '<th>Where</th>' +
              '<th>Schedule</th>' +
              '<th>Run time</th>' +
              '<th>Result</th>' +
              '<th>What happened?</th>' +
              '<th>Ivan?</th>' +
            '</tr></thead>' +
            '<tbody>' + rows.map(rowHtml).join('') + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>'
    );
  }

  function showFailure(message) {
    statusCard.hidden = false;
    statusCard.classList.add('status-error');
    statusCard.textContent = message;
    laneContainer.hidden = true;
  }

  async function loadConsole() {
    if (!API_BASE) {
      showFailure('Private API is not configured.');
      return;
    }

    var token = window.SiteGate && window.SiteGate.getToken
      ? window.SiteGate.getToken()
      : '';

    if (!token) {
      window.location.replace('/private/login.html?next=/console-os/');
      return;
    }

    try {
      var response = await fetch(API_BASE + '/os-console/automation-facts', {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
        cache: 'no-store',
      });

      var payload = await response.json().catch(function () { return {}; });

      if (response.status === 401) {
        if (window.SiteGate) window.SiteGate.clearToken();
        window.location.replace('/private/login.html?next=/console-os/');
        return;
      }

      if (!response.ok || payload.status !== 'ok' || !payload.automationFacts) {
        throw new Error(payload.message || 'Automation registry could not be loaded.');
      }

      var facts = payload.automationFacts;
      var lanes = Array.isArray(facts.lanes) ? facts.lanes : [];

      sourceName.textContent = facts.source || 'ivan-cos / registry / automations.json';
      sourceState.textContent =
        String(facts.automation_count || 0) + ' registry automations · registered proof only';
      sourceSha.textContent = facts.sha ? 'Registry ' + facts.sha.slice(0, 8) : '';
      asOf.textContent = 'Updated ' + displayDate(facts.generated_at);

      laneContainer.innerHTML = lanes.map(laneHtml).join('');
      laneContainer.hidden = false;
      statusCard.hidden = true;
    } catch (err) {
      showFailure(err && err.message ? err.message : 'Automation registry could not be loaded.');
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      if (window.SiteGate) window.SiteGate.clearToken();
      window.location.assign('/private/login.html?next=/console-os/');
    });
  }

  loadConsole();
})();
