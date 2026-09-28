(function () {
  'use strict';

  // Architecture contract:
  // ideeazz1/ivan-cos:docs/CONSOLE-ARCHITECTURE.md
  // Phase 1 is read-only registry intent only. The browser never receives the
  // private GitHub credential and never reads the private repo directly.
  var API_BASE = '';

  var asOf = document.getElementById('as-of');
  var logoutButton = document.getElementById('logout-button');
  var sourceState = document.getElementById('source-state');
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

  async function ready() {
    try {
      if (window.IVAN_PROPOSAL_API_BASE_READY) {
        await window.IVAN_PROPOSAL_API_BASE_READY;
      }
    } catch (_) {}
    API_BASE = String(window.IVAN_PROPOSAL_API_BASE || '').replace(/\/$/, '');
  }

  function osConsoleUrl(path) {
    var suffix = '/os-console' + path;
    if (!API_BASE) return '/api/database2' + suffix;
    if (/\/api\/database2$/i.test(API_BASE)) return API_BASE + suffix;
    return API_BASE + '/api/database2' + suffix;
  }

  function expectedState(item) {
    if (item.provider_state === 'active') return 'Expected active';
    if (item.provider_state === 'paused') return 'Expected paused';
    return item.provider_state ? 'Expected ' + item.provider_state : 'UNPROVEN';
  }

  function renderRows(items) {
    var shared = items.filter(function (item) {
      return item && item.lane === 'Shared Ivan OS';
    });

    if (sectionCount) {
      sectionCount.textContent = shared.length + (shared.length === 1 ? ' registry row' : ' registry rows');
    }

    if (!registryBody) return;

    if (!shared.length) {
      registryBody.innerHTML =
        '<tr class="empty-row"><td colspan="6">' +
        '<strong>No Shared Ivan OS rows found.</strong>' +
        '<span>The console does not invent missing registry records.</span>' +
        '</td></tr>';
      return;
    }

    registryBody.innerHTML = shared.map(function (item) {
      return '<tr>' +
        '<td><strong>' + escapeHtml(item.name || 'Unnamed automation') + '</strong></td>' +
        '<td>' + escapeHtml(item.role || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.provider || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.purpose || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(item.schedule || 'UNPROVEN') + '</td>' +
        '<td>' + escapeHtml(expectedState(item)) + '</td>' +
        '</tr>';
    }).join('');
  }

  function showRegistryError(message) {
    if (sourceState) sourceState.textContent = 'Registry unavailable';
    if (sectionCount) sectionCount.textContent = 'UNAVAILABLE';
    if (registryBody) {
      registryBody.innerHTML =
        '<tr class="empty-row"><td colspan="6">' +
        '<strong>Registry unavailable.</strong>' +
        '<span>' + escapeHtml(message) + '</span>' +
        '</td></tr>';
    }
  }

  async function loadRegistry() {
    try {
      await ready();
      var response = await fetch(osConsoleUrl('/canonical-registry'), {
        method: 'GET',
        cache: 'no-store',
        headers: authHeaders()
      });

      var payload = await response.json().catch(function () {
        return { status: 'failed', message: 'Registry API returned invalid JSON.' };
      });

      if (response.status === 401) {
        if (window.SiteGate) window.SiteGate.clearToken();
        window.location.replace('/private/login.html?next=' + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!response.ok || payload.status !== 'ok') {
        throw new Error(payload.message || 'Canonical registry API request failed.');
      }

      var registry = payload.registry || {};
      if (!Array.isArray(registry.automations)) {
        throw new Error('Canonical registry API did not return an automations array.');
      }

      renderRows(registry.automations);
      if (sourceState) {
        sourceState.textContent =
          'Connected · read-only' +
          (registry.sha ? ' · ' + String(registry.sha).slice(0, 7) : '');
      }
    } catch (error) {
      showRegistryError(error && error.message ? error.message : 'Unable to read canonical registry.');
    }
  }

  if (asOf) {
    asOf.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'long',
      month: 'long',
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

  loadRegistry();
})();
