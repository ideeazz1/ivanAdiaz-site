(function () {
  'use strict';

  // Architecture contract:
  // ideeazz1/ivan-cos:docs/CONSOLE-ARCHITECTURE.md
  // Phase 1 is read-only: registry intent only. No provider state, receipts,
  // health scoring, or control actions belong in this slice.
  var REGISTRY_URL = 'https://raw.githubusercontent.com/ideeazz1/ivan-cos/main/registry/automations.json';

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
      var response = await fetch(REGISTRY_URL + '?ts=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Canonical registry returned HTTP ' + response.status + '.');
      }

      var payload = await response.json();
      var items = Array.isArray(payload) ? payload : payload.automations;

      if (!Array.isArray(items)) {
        throw new Error('Canonical registry did not return an automations array.');
      }

      renderRows(items);
      if (sourceState) sourceState.textContent = 'Connected · read-only';
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
