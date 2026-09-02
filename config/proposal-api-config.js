/**
 * Resolves IVAN_PROPOSAL_API_BASE before proposal-engine runs.
 * Local: localhost:8080. Production: gitignored proposal-api-base.json (Cloud Run image)
 * or committed proposal-api-base.example.json (GitHub Pages).
 */
(function (global) {
  var host = typeof location !== 'undefined' ? location.hostname : '';
  var isLocal = host === 'localhost' || host === '127.0.0.1';

  function setBase(url) {
    if (url) global.IVAN_PROPOSAL_API_BASE = String(url).replace(/\/$/, '');
  }

  function loadJson(path) {
    return fetch(path, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' missing');
      return res.json();
    });
  }

  if (isLocal) {
    setBase(global.IVAN_PROPOSAL_API_BASE || 'http://localhost:8080/api/database2');
    global.IVAN_PROPOSAL_API_BASE_READY = Promise.resolve(global.IVAN_PROPOSAL_API_BASE);
    return;
  }

  global.IVAN_PROPOSAL_API_BASE_READY = loadJson('/config/proposal-api-base.json')
    .catch(function () {
      return loadJson('/config/proposal-api-base.example.json');
    })
    .then(function (cfg) {
      var base = (cfg && cfg.apiBase) || global.IVAN_PROPOSAL_API_BASE || '';
      if (!base) {
        throw new Error('Production API base is not configured. Run scripts/deploy-database2-cloud-run.ps1');
      }
      setBase(base);
      return global.IVAN_PROPOSAL_API_BASE;
    })
    .catch(function (err) {
      console.error('[proposal-api-config]', err.message || err);
      throw err;
    });
})(typeof window !== 'undefined' ? window : global);
