/* Shared "Keep exploring" footer for every /experience/ system page.
   One list, one place: add a new system here and every page links to it.
   Usage: <script src="/experience/systems-footer.js" defer></script> before </body>. */
(function () {
  var SYSTEMS = [
    ['Database 2.0', 'One household record. Every relationship connected.', '/experience/database-2/', 'database-2'],
    ['Audit & Security', 'Nothing counts as done until the evidence says so.', '/experience/audit-security/', 'audit-security'],
    ['Dream', 'Every lesson captured. Every night, a little wiser.', '/experience/dream/', 'dream'],
    ['The Org Chart', 'Every role has a job description.', '/experience/org-chart/', 'org-chart'],
    ['Registry & Console', 'Every automation reports back with a receipt.', '/console-os/', 'registry-console'],
    ['Mortgage Intelligence Core', 'Years of email, read before 7 AM.', '/experience/mortgage-intelligence/', 'mortgage-intelligence'],
    ['Daily Follow Up & EOD', 'Right people. Right time. Complete the loop.', '/experience/daily-follow-up-eod/', 'daily-followup-eod'],
    ['Lead Generation & Enrichment', 'Every lead checked, scored and routed.', '/experience/lead-generation/', 'lead-generation']
  ];
  var here = location.pathname.replace(/index\.html$/, '');
  if (here.charAt(here.length - 1) !== '/') here += '/';
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var cards = SYSTEMS.filter(function (s) { return s[2] !== here; }).map(function (s) {
    return '<a class="sxf-card" href="' + s[2] + '"><img src="/experience/projects/motion/' + s[3] + '.webp" alt="" loading="lazy" width="1600" height="800">' +
      '<span class="sxf-title">' + esc(s[0]) + '</span><span class="sxf-sub">' + esc(s[1]) + '</span></a>';
  }).join('');
  var css = 'nav.sxf{position:relative;z-index:5;background:#F6F7F9;color:#1D1D1F;font-family:Inter,system-ui,-apple-system,sans-serif;padding:56px max(16px,env(safe-area-inset-right,0px)) 64px max(16px,env(safe-area-inset-left,0px));border-top:1px solid #E3E6EB}' +
    'nav.sxf .sxf-in{max-width:1120px;margin:0 auto;display:grid;gap:22px}' +
    'nav.sxf .sxf-head{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:baseline;justify-content:space-between}' +
    'nav.sxf .sxf-eyebrow{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#004288}' +
    'nav.sxf h2{margin:6px 0 0;font-size:clamp(24px,4vw,32px);font-weight:700;letter-spacing:-.03em;color:#1D1D1F}' +
    'nav.sxf .sxf-all{font-size:15px;font-weight:600;color:#004288!important;text-decoration:none}' +
    'nav.sxf .sxf-all:hover,nav.sxf .sxf-all:focus-visible{text-decoration:underline}' +
    'nav.sxf .sxf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}' +
    'nav.sxf .sxf-card{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:6px;background:#fff;border-radius:18px;padding:10px 10px 16px;text-decoration:none!important;color:#1D1D1F!important;box-shadow:0 1px 2px rgba(16,24,40,.04),0 10px 26px -14px rgba(16,24,40,.18);transition:transform .2s cubic-bezier(.22,.61,.36,1),box-shadow .2s}' +
    'nav.sxf .sxf-card:hover,nav.sxf .sxf-card:focus-visible{transform:translateY(-3px);box-shadow:0 1px 2px rgba(16,24,40,.05),0 16px 32px -14px rgba(16,24,40,.26)}' +
    'nav.sxf .sxf-card:focus-visible{outline:3px solid #004288;outline-offset:3px}' +
    'nav.sxf .sxf-card img{width:100%;height:auto;aspect-ratio:2/1;object-fit:contain;border-radius:12px;background:#F6F7F9;display:block}' +
    'nav.sxf .sxf-title{font-size:16px;font-weight:700;letter-spacing:-.01em;padding:4px 6px 0;color:#1D1D1F;margin:0;line-height:1.3}' +
    'nav.sxf .sxf-sub{font-size:14px;line-height:1.4;color:#5B5B60;padding:0 6px;margin:0}' +
    '@media (prefers-reduced-motion:reduce){.sxf-card{transition:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var nav = document.createElement('nav');
  nav.className = 'sxf'; nav.setAttribute('aria-label', 'More systems');
  nav.innerHTML = '<div class="sxf-in"><div class="sxf-head"><div><div class="sxf-eyebrow">Systems &amp; Work</div><h2>Keep exploring</h2></div>' +
    '<a class="sxf-all" href="/experience/">← All Systems &amp; Work</a></div><div class="sxf-grid">' + cards + '</div></div>';
  document.body.appendChild(nav);
})();
