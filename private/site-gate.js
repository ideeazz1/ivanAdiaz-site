/**
 * Soft gate for private ivanadiaz.com pages (hierarchy, workflow-map, Peregrine, prospect decks, etc.).
 * Homepage, /proposal/*, and /portal/* stay public / client-auth.
 * Note: GitHub Pages HTML is still fetchable without this; gate stops casual browsing.
 */
(function (global) {
  var TOKEN_KEY = 'ivan-site-gate-token';
  var LOGIN_PATH = '/private/login.html';

  function getToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function setToken(token) {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (_) {}
  }

  function clearToken() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (_) {}
  }

  function isLoginPage() {
    return (
      typeof location !== 'undefined' &&
      /\/private\/login\.html$/i.test(location.pathname)
    );
  }

  function isLocalHierarchyDev() {
    if (typeof location === 'undefined') return false;
    var host = location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') return false;
    if (/^\/hierarchy\/projects\.html$/i.test(location.pathname)) return false;
    return /^\/hierarchy(\/|$)/i.test(location.pathname);
  }

  function markGateOk() {
    document.documentElement.classList.remove('site-gate-pending');
    document.documentElement.classList.add('site-gate-ok');
  }

  function redirectToLogin() {
    var next = location.pathname + location.search + location.hash;
    location.replace(LOGIN_PATH + '?next=' + encodeURIComponent(next));
  }

  function requireAuth() {
    if (isLoginPage()) return true;
    if (getToken()) {
      document.documentElement.classList.add('site-gate-ok');
      return true;
    }
    redirectToLogin();
    return false;
  }

  global.SiteGate = {
    TOKEN_KEY: TOKEN_KEY,
    getToken: getToken,
    setToken: setToken,
    clearToken: clearToken,
    requireAuth: requireAuth,
  };

  if (!isLoginPage()) {
    document.documentElement.classList.add('site-gate-pending');
    if (isLocalHierarchyDev()) {
      markGateOk();
    } else if (!getToken()) {
      redirectToLogin();
    } else {
      markGateOk();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
