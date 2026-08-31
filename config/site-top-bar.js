(function () {
  var bar = document.querySelector('.top-bar');
  var pill = document.querySelector('.top-bar__pill');
  var toggle = document.querySelector('.top-bar__menu-toggle');
  var nav = document.getElementById('top-bar-nav');
  var brand = document.querySelector('.top-bar__brand');
  var compactAt = 40;
  var path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (!bar) return;

  if (path === '/mortgage') {
    if (brand) brand.setAttribute('href', '/mortgage/');

    if (nav) {
      nav.innerHTML = [
        '<li><a href="/mortgage/" aria-current="page">Mortgage Home</a></li>',
        '<li><a href="/texas/">Texas</a></li>',
        '<li><a href="/california/">California</a></li>',
        '<li><a href="https://assurancemortgage.com/assurance_officers/ivan-diaz/" target="_blank" rel="noopener noreferrer">Apply</a></li>',
        '<li><a href="/portal/login.html">Client Portal</a></li>',
        '<li><a href="#contact">Contact</a></li>'
      ].join('');
    }

    var intro = document.querySelector('.intro');
    var nmls = intro && intro.querySelector('.nmls');
    if (intro && nmls && !intro.querySelector('.mortgage-identity')) {
      var style = document.createElement('style');
      style.textContent = [
        '.mortgage-identity{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:10px;flex-wrap:wrap}',
        '.mortgage-state-links,.mortgage-social-links{display:flex;align-items:center;gap:8px}',
        '.mortgage-state-link{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:28px;padding:0 10px;border:1px solid rgba(52,58,64,.14);border-radius:999px;color:var(--ink);font-size:11px;font-weight:800;letter-spacing:.08em;text-decoration:none;background:rgba(255,255,255,.42);transition:transform .16s ease,background .16s ease}',
        '.mortgage-state-link:hover{transform:translateY(-1px);background:rgba(255,255,255,.75)}',
        '.mortgage-social-link{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;color:var(--ink);opacity:.58;text-decoration:none;transition:opacity .16s ease,transform .16s ease}',
        '.mortgage-social-link:hover{opacity:.92;transform:translateY(-1px)}',
        '.mortgage-social-link svg{width:18px;height:18px;display:block;fill:currentColor}',
        '@media (max-width:720px){.mortgage-identity{margin-top:12px;gap:10px}.mortgage-state-link{height:30px}.mortgage-social-link{width:30px;height:30px}}'
      ].join('');
      document.head.appendChild(style);

      var identity = document.createElement('div');
      identity.className = 'mortgage-identity';
      identity.setAttribute('aria-label', 'Mortgage licenses and social links');
      identity.innerHTML = [
        '<div class="mortgage-state-links" aria-label="State mortgage resources">',
          '<a class="mortgage-state-link" href="/texas/" aria-label="Texas mortgage resources">TX</a>',
          '<a class="mortgage-state-link" href="/california/" aria-label="California mortgage resources">CA</a>',
        '</div>',
        '<div class="mortgage-social-links" aria-label="Social media">',
          '<a class="mortgage-social-link" href="https://www.linkedin.com/in/ivanadiaz" target="_blank" rel="noopener noreferrer" aria-label="Ivan Diaz on LinkedIn">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5ZM.35 8h4.3v14H.35V8Zm6.75 0h4.12v1.91h.06c.57-1.09 1.98-2.24 4.08-2.24 4.36 0 5.17 2.87 5.17 6.61V22h-4.29v-6.84c0-1.63-.03-3.73-2.27-3.73-2.27 0-2.62 1.77-2.62 3.61V22H7.1V8Z"/></svg>',
          '</a>',
          '<a class="mortgage-social-link" href="https://www.instagram.com/ivandiazmortgage/" target="_blank" rel="noopener noreferrer" aria-label="Ivan Diaz Mortgage on Instagram">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>',
          '</a>',
        '</div>'
      ].join('');
      nmls.insertAdjacentElement('afterend', identity);
    }
  }

  function onScroll() {
    var pinned = document.documentElement.classList.contains('header-compact');
    bar.classList.toggle('is-compact', pinned || window.scrollY > compactAt);
  }

  function setMenuOpen(open) {
    bar.classList.toggle('is-menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    document.body.classList.toggle('top-bar-menu-open', open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenuOpen(!bar.classList.contains('is-menu-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  if (pill) {
    pill.addEventListener('mousemove', function (e) {
      var rect = pill.getBoundingClientRect();
      pill.style.setProperty('--blob-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      pill.style.setProperty('--blob-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
    pill.addEventListener('mouseleave', function () {
      pill.style.setProperty('--blob-x', '50%');
      pill.style.setProperty('--blob-y', '50%');
    });
  }
})();
