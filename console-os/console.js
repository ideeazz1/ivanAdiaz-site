(function () {
  'use strict';

  var API_BASE = String(window.IVAN_PRIVATE_API_BASE || '').replace(/\/$/, '');

  var asOf = document.getElementById('as-of');
  var logoutButton = document.getElementById('logout-button');
  var sectionCount = document.getElementById('section-count');
  var registryBody = document.getElementById('registry-body');

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function authHeaders() {
    var headers = { Accept: 'application/json' };
    var token = window.SiteGate && window.SiteGate.getToken();
    if (token) headers.Authorization = 'Bearer ' + token;
    return headers;
  }

  function osConsoleUrl(path) {
    var suffix = '/os-console' + path;
    if (!API_BASE) return '/api/database2' + suffix;
    if (/\/api\/database2$/i.test(API_BASE)) return API_BASE + suffix;
    return API_BASE + '/api/database2' + suffix;
  }

  function renderRows(rows) {
    if (sectionCount) sectionCount.textContent = rows.length + ' automations';
    if (!registryBody) return;

    registryBody.innerHTML = rows.map(function (item) {
      var receipt = item.receipt || {};
      return '<tr>' +
        '<td><strong>' + escapeHtml(item.name || 'UNPROVEN') + '</strong></td>' +
        '<td>' + escapeHtml(item.role || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.provider || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.purpose || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.schedule || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(receipt.ran || 'UNPROVEN') + '</td>' +
        '<td><strong>' + escapeHtml(receipt.status || 'UNPROVEN') + '</strong></td>' +
        '<td>' + escapeHtml(receipt.what_changed || '—') + '</td>' +
        '<td>' + escapeHtml(receipt.ivan || 'No') + '</td>' +
        '</tr>';
    }).join('');
  }

  function showError(message) {
    if (sectionCount) sectionCount.textContent = 'UNAVAILABLE';
    if (registryBody) {
      registryBody.innerHTML =
        '<tr class="empty-row"><td colspan="9"><strong>UNAVAILABLE</strong><span>' +
        escapeHtml(message) +
        '</span></td></tr>';
    }
  }

  async function loadRows() {
    try {
      var response = await fetch(osConsoleUrl('/shared-os-starter'), {
        method: 'GET',
        cache: 'no-store',
        headers: authHeaders()
      });

      var payload = await response.json().catch(function () {
        return { status: 'failed', message: 'Invalid API response.' };
      });

      if (response.status === 401) {
        if (window.SiteGate) window.SiteGate.clearToken();
        window.location.replace('/private/login.html?next=' + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!response.ok || payload.status !== 'ok') {
        throw new Error(payload.message || 'Shared OS data unavailable.');
      }

      var rows = payload.sharedOs && payload.sharedOs.rows;
      if (!Array.isArray(rows)) throw new Error('Shared OS rows unavailable.');
      renderRows(rows);
    } catch (error) {
      showError(error && error.message ? error.message : 'Shared OS data unavailable.');
    }
  }

  if (asOf) {
    asOf.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      if (window.SiteGate) window.SiteGate.clearToken();
      window.location.assign('/private/login.html?next=/console-os/');
    });
  }

  loadRows();
})();
