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

    var mortgageStyle = document.createElement('style');
    mortgageStyle.textContent = [
      'body{background-color:#F8F9FA;background-image:radial-gradient(ellipse 100% 70% at 50% 8%,rgba(196,178,152,.12) 0%,transparent 52%),radial-gradient(ellipse 120% 80% at 15% 0%,rgba(72,120,95,.10) 0%,transparent 55%),radial-gradient(ellipse 90% 60% at 88% 12%,rgba(120,140,220,.13) 0%,transparent 50%),radial-gradient(ellipse 100% 90% at 50% 100%,rgba(72,98,128,.08) 0%,transparent 48%),radial-gradient(ellipse 80% 55% at 20% 78%,rgba(160,180,255,.11) 0%,transparent 45%),linear-gradient(165deg,#FAFBFC 0%,#EEF0F5 42%,#F8F9FA 72%,#DEE2E6 100%)}',
      'body::before{background:radial-gradient(circle at 20% 30%,rgba(88,145,118,.09) 0%,transparent 42%),radial-gradient(circle at 82% 18%,rgba(130,150,230,.15) 0%,transparent 40%),radial-gradient(circle at 45% 60%,rgba(210,195,175,.09) 0%,transparent 36%),radial-gradient(circle at 55% 78%,rgba(180,190,255,.13) 0%,transparent 38%),radial-gradient(circle at 60% 85%,rgba(72,120,95,.10) 0%,transparent 40%)}',
      '.page{width:min(1000px,calc(100% - 32px));margin:18px auto 12px}',
      '.intro{position:relative;isolation:isolate;overflow:hidden;margin-bottom:18px;padding:24px 28px 20px;border:1px solid rgba(255,255,255,.78);border-radius:30px;background:rgba(255,255,255,.50);backdrop-filter:blur(18px) saturate(135%);-webkit-backdrop-filter:blur(18px) saturate(135%);box-shadow:0 16px 44px rgba(55,64,76,.08),inset 0 1px 0 rgba(255,255,255,.82)}',
      '.intro::before{content:"";position:absolute;inset:-35%;z-index:-1;pointer-events:none;background:radial-gradient(circle at 22% 32%,rgba(102,170,139,.16) 0%,transparent 32%),radial-gradient(circle at 78% 24%,rgba(142,164,242,.22) 0%,transparent 34%),radial-gradient(circle at 52% 82%,rgba(213,195,168,.15) 0%,transparent 32%);filter:blur(24px)}',
      '.intro h1{font-size:46px;line-height:1;letter-spacing:-.045em;text-wrap:balance}',
      '.intro>p:not(.nmls){font-size:17px;margin-top:9px;opacity:.64}',
      '.nmls{margin-top:8px;opacity:.42}',
      '.mortgage-identity{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:13px;flex-wrap:wrap}',
      '.mortgage-state-links,.mortgage-social-links{display:flex;align-items:center;gap:8px}',
      '.mortgage-state-link{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:30px;padding:0 11px;border:1px solid rgba(52,58,64,.12);border-radius:999px;color:var(--ink);font-size:11px;font-weight:800;letter-spacing:.08em;text-decoration:none;background:rgba(255,255,255,.64);box-shadow:0 3px 10px rgba(52,58,64,.05);transition:transform .16s ease,background .16s ease,box-shadow .16s ease}',
      '.mortgage-state-link:hover{transform:translateY(-2px);background:rgba(255,255,255,.92);box-shadow:0 6px 16px rgba(52,58,64,.09)}',
      '.mortgage-social-link{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;color:var(--ink);opacity:.62;text-decoration:none;background:rgba(255,255,255,.42);transition:opacity .16s ease,transform .16s ease,background .16s ease}',
      '.mortgage-social-link:hover{opacity:.95;transform:translateY(-2px);background:rgba(255,255,255,.86)}',
      '.mortgage-social-link svg{width:17px;height:17px;display:block;fill:currentColor}',
      '.carousel{gap:16px}',
      '.carousel__rail{height:248px}',
      '.carousel__stage{height:264px}',
      '.carousel__track{gap:16px}',
      '.carousel__mark{width:7px;height:7px;background:rgba(52,58,64,.18)}',
      '.carousel__mark[aria-current="true"]{height:25px;background:rgba(52,58,64,.82)}',
      '.split-card{height:248px;min-height:248px;border-radius:30px;background:rgba(255,255,255,.74);border:1px solid rgba(255,255,255,.78);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);box-shadow:0 14px 38px rgba(55,64,76,.09),0 2px 5px rgba(52,58,64,.05);transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,--blob-x .3s ease-out,--blob-y .3s ease-out}',
      '.split-card::before{opacity:.13}',
      '.split-card:hover{transform:translateY(-3px) scale(1.008);box-shadow:0 22px 48px rgba(55,64,76,.14),0 3px 8px rgba(52,58,64,.06)}',
      '.split-card:hover::before{opacity:.92}',
      '.split-card__details{padding:34px 40px;gap:8px}',
      '.split-card h2{font-size:30px;letter-spacing:-.04em}',
      '.brand{font-size:14px;opacity:.64}',
      '.site{opacity:.42}',
      '.kicker{opacity:.48}',
      '.cta-pill{margin-top:8px;padding:9px 15px;background:rgba(255,255,255,.72);border-color:rgba(52,58,64,.10);box-shadow:0 3px 10px rgba(52,58,64,.05)}',
      '.split-card__media{height:248px;border-color:rgba(52,58,64,.08);background:rgba(244,246,248,.62)}',
      '.split-card__media>img{transition:transform .38s cubic-bezier(.22,1,.36,1),filter .28s ease}',
      '.split-card:hover .split-card__media>img{transform:scale(1.018);filter:saturate(1.03)}',
      '.split-card:has(.is-inset) .split-card__media>img{transform:none}',
      '.top-bar.is-compact .top-bar__pill{background:rgba(248,249,250,.90);backdrop-filter:blur(14px) saturate(130%);-webkit-backdrop-filter:blur(14px) saturate(130%)}',
      '@media(max-width:720px){body{background-attachment:scroll}.page{width:min(960px,calc(100% - 24px));margin:14px auto 0}.intro{padding:23px 18px 20px;border-radius:24px;margin-bottom:18px}.intro h1{font-size:36px}.intro>p:not(.nmls){font-size:15px;line-height:1.4}.mortgage-identity{margin-top:12px;gap:10px}.mortgage-state-link{height:30px}.mortgage-social-link{width:30px;height:30px}.carousel__stage{height:auto}.split-card,.split-card.is-swap{height:auto;min-height:0;border-radius:26px}.split-card__details{padding:26px 22px}.split-card h2{font-size:24px}.split-card__media,.split-card.is-swap .split-card__media{height:auto;min-height:180px;max-height:220px}.split-card:hover{transform:none}}'
    ].join('');
    document.head.appendChild(mortgageStyle);

    var intro = document.querySelector('.intro');
    var nmls = intro && intro.querySelector('.nmls');
    if (intro) {
      var introCopy = intro.querySelector('p:not(.nmls)');
      if (introCopy) introCopy.textContent = 'Guidance, client access, home search, and reviews — all in one place.';
    }

    if (intro && nmls && !intro.querySelector('.mortgage-identity')) {
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
