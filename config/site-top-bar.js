(function () {
  var bar = document.querySelector('.top-bar');
  var pill = document.querySelector('.top-bar__pill');
  var toggle = document.querySelector('.top-bar__menu-toggle');
  var nav = document.getElementById('top-bar-nav');
  var brand = document.querySelector('.top-bar__brand');
  var mark = document.querySelector('.top-bar__mark');
  var hold = document.querySelector('[data-header-hold]');
  var compactAt = 40;
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var isMortgageHome = path === '/mortgage';
  var isTexas = path === '/mortgage/texas';
  var isCalifornia = path === '/mortgage/california';
  var isMortgagePath = path === '/mortgage' || path.indexOf('/mortgage/') === 0;
  var pinWhileCollapse = !!(hold && hold.hasAttribute('data-header-pin-collapse'));
  var heroHoldMs = 280; // match the longest header collapse transition
  var collapsing = false;
  var collapseTimer = null;
  var reduceMotion = false;

  if (!bar) return;

  if (isMortgagePath) {
    if (brand) brand.setAttribute('href', '/');

    if (mark) {
      fetch('/', { cache: 'force-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Unable to load homepage portrait');
          return response.text();
        })
        .then(function (html) {
          var source = new DOMParser().parseFromString(html, 'text/html');
          var avatar = source.querySelector('.avatar-wrap img');
          var avatarSrc = avatar && avatar.getAttribute('src');
          if (!avatarSrc) return;

          mark.src = avatarSrc;
          mark.alt = 'Ivan Diaz';
          mark.classList.add('top-bar__mark--portrait');
          mark.style.borderRadius = '50%';
          mark.style.objectFit = 'cover';
          mark.style.objectPosition = 'top center';
          mark.style.filter = 'none';
          mark.style.opacity = '1';
          mark.style.background = '#fff';
        })
        .catch(function () {
          /* Keep the existing ID logo as a safe fallback. */
        });
    }

    if (nav) {
      var navItems = [
        '<li><a href="/mortgage/"' + (isMortgageHome ? ' aria-current="page"' : '') + '>Mortgage Home</a></li>',
        '<li><a href="/mortgage/texas/"' + (isTexas ? ' aria-current="page"' : '') + '>Texas</a></li>'
      ];

      if (!isTexas) {
        navItems.push('<li><a href="/mortgage/california/"' + (isCalifornia ? ' aria-current="page"' : '') + '>California</a></li>');
      }

      navItems.push(
        '<li><a href="https://assurancemortgage.com/assurance_officers/ivan-diaz/" target="_blank" rel="noopener noreferrer">Apply</a></li>',
        '<li><a href="https://idp.elliemae.com/authorize?client_id=srtrz0d2&site_id=9548862087&response_type=code&redirect_uri=https%3A%2F%2Fassurance.mymortgage-online.com%2Fborrower-app%2Flogin%2F%3Flar%3Didiaz%26workFlowId%3D67079%26_gl%3D1*dl3shk*_ga*MTAxMDgxMjc1OC4xNzI5MTA1NjI3*_ga_1PDFYSY743*MTcyOTg3OTM2Mi42LjEuMTcyOTg3OTk5Ni40MC4wLjA.%26dest%3D%2Floan-app%2F%26siteId%3D9548862087&scope=ccbp%20cc&instance_id=be11130424&logo_url=https%3A%2F%2Fstore.asset.ellieservices.com%2F6a134995-5f29-4900-9172-ccf8d134940f&logo_alt_text=Logo&logo_is_disabled&bust=393&apiBaseUrl=https://api.elliemae.com" target="_blank" rel="noopener noreferrer">Log In / Sign Documents</a></li>'
      );

      if (!isTexas) {
        navItems.push('<li><a href="' + (isMortgageHome ? '#contact' : '/mortgage/#contact') + '">Contact</a></li>');
      }

      nav.innerHTML = navItems.join('');
    }

    if (isMortgageHome) {
      var intro = document.querySelector('.intro');
      if (intro) {
        var identityStyle = document.createElement('style');
        identityStyle.textContent = [
          '.mortgage-profile{margin:28px 0 30px;text-align:center;flex:0 0 auto}',
          '.mortgage-profile .mortgage-profile__title{font-family:var(--display);font-size:36px;font-weight:800;line-height:1.05;letter-spacing:-.03em;color:var(--ink);margin:0 0 4px}',
          '.mortgage-profile .mortgage-profile__nmls{font-family:var(--display);font-size:11.5px;font-weight:500;letter-spacing:.02em;color:var(--ink);opacity:.45;margin:0 0 10px}',
          '.mortgage-profile__states{display:flex;justify-content:center;align-items:flex-start;gap:16px;margin:0 0 10px;flex-wrap:nowrap}',
          '.mortgage-profile .state-badge{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:inherit;min-width:44px}',
          '.mortgage-profile .state-svg{width:44px;height:44px;display:block;object-fit:contain;opacity:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.15));transition:opacity .18s ease,transform .2s cubic-bezier(.34,1.56,.64,1),filter .2s}',
          '.mortgage-profile .state-svg.is-ready{opacity:1}',
          '.mortgage-profile a.state-badge:hover .state-svg{transform:scale(1.15) translateY(-2px);filter:drop-shadow(0 3px 8px rgba(0,0,0,.25))}',
          '.mortgage-profile .state-code{font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--ink);opacity:.6}',
          '.mortgage-profile__socials{display:flex;justify-content:center;align-items:center;gap:14px;margin:0}',
          '.mortgage-profile .social-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.90);border:1px solid #DEE2E6;color:var(--ink);text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.07);transition:background .15s,transform .12s}',
          '.mortgage-profile .social-btn:hover{background:#E9ECEF;transform:scale(1.06)}',
          '.mortgage-profile .social-btn svg{width:17px;height:17px;fill:currentColor;display:block}',
          '@media(max-width:720px){.mortgage-profile{margin:20px 0 24px}.mortgage-profile .mortgage-profile__title{font-size:32px}.mortgage-profile__states{gap:14px}.mortgage-profile .state-svg{width:42px;height:42px}}'
        ].join('');
        document.head.appendChild(identityStyle);

        intro.classList.add('mortgage-profile');
        intro.innerHTML = [
          '<h1 class="mortgage-profile__title">Mortgage Advisor</h1>',
          '<p class="mortgage-profile__nmls">NMLS #501968</p>',
          '<div class="mortgage-profile__states" aria-label="State mortgage resources">',
            '<a class="state-badge" href="/mortgage/texas/" aria-label="Texas mortgage resources"><img class="state-svg" data-state-index="0" alt="Texas"><span class="state-code">TX</span></a>',
            '<a class="state-badge" href="/mortgage/california/" aria-label="California mortgage resources"><img class="state-svg" data-state-index="1" alt="California"><span class="state-code">CA</span></a>',
            '<div class="state-badge" aria-label="Arkansas"><img class="state-svg" data-state-index="2" alt="Arkansas"><span class="state-code">AR</span></div>',
            '<div class="state-badge" aria-label="New Mexico"><img class="state-svg" data-state-index="3" alt="New Mexico"><span class="state-code">NM</span></div>',
          '</div>',
          '<div class="mortgage-profile__socials" aria-label="Social media">',
            '<a class="social-btn" href="https://www.linkedin.com/in/ivanadiaz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>',
            '<a class="social-btn" href="https://www.instagram.com/ivandiazmortgage/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>',
          '</div>'
        ].join('');

        fetch('/', { cache: 'force-cache' })
          .then(function (response) {
            if (!response.ok) throw new Error('Unable to load homepage state assets');
            return response.text();
          })
          .then(function (html) {
            var source = new DOMParser().parseFromString(html, 'text/html');
            var sourceStates = source.querySelectorAll('.state-svg');
            intro.querySelectorAll('.state-svg[data-state-index]').forEach(function (targetState) {
              var index = Number(targetState.getAttribute('data-state-index'));
              var sourceState = sourceStates[index];
              if (sourceState) {
                targetState.src = sourceState.getAttribute('src');
                targetState.classList.add('is-ready');
              }
            });
          })
          .catch(function () {
            /* Keep the mortgage tools usable even if state assets fail to load. */
          });
      }
    }
  }

  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {
    reduceMotion = false;
  }

  function heroTuckingUnder() {
    if (!hold) return window.scrollY > compactAt;
    var barBox = bar.getBoundingClientRect();
    return hold.getBoundingClientRect().top < barBox.bottom - 4;
  }

  function onScroll() {
    var pinned = document.documentElement.classList.contains('header-compact');
    bar.classList.toggle('is-compact', pinned || heroTuckingUnder());
  }

  function pinHero() {
    if (!hold || hold.hasAttribute('data-header-pinned')) return;
    var rect = hold.getBoundingClientRect();
    var spacer = document.createElement('div');
    spacer.setAttribute('data-header-pin-spacer', '');
    spacer.style.height = rect.height + 'px';
    spacer.style.width = '100%';
    hold.parentNode.insertBefore(spacer, hold);
    hold.style.position = 'fixed';
    hold.style.top = rect.top + 'px';
    hold.style.left = rect.left + 'px';
    hold.style.width = rect.width + 'px';
    hold.style.margin = '0';
    hold.style.zIndex = '5';
    hold.setAttribute('data-header-pinned', '');
  }

  function unpinHero() {
    if (!hold) return;
    var spacer = document.querySelector('[data-header-pin-spacer]');
    if (spacer && spacer.parentNode) spacer.parentNode.removeChild(spacer);
    hold.style.position = '';
    hold.style.top = '';
    hold.style.left = '';
    hold.style.width = '';
    hold.style.margin = '';
    hold.style.zIndex = '';
    hold.removeAttribute('data-header-pinned');
  }

  function finishCollapse() {
    if (!collapsing) return;
    collapsing = false;
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
    unpinHero();
  }

  function startCollapse() {
    if (collapsing || bar.classList.contains('is-compact')) return;
    collapsing = true;
    pinHero();
    bar.classList.add('is-compact');
    if (reduceMotion) {
      finishCollapse();
    } else {
      collapseTimer = setTimeout(finishCollapse, heroHoldMs);
    }
  }

  function expandAtTop() {
    if (collapsing) return;
    if (window.scrollY <= 8 && bar.classList.contains('is-compact')) {
      bar.classList.remove('is-compact');
    }
  }

  function shouldInterceptFirstScroll() {
    if (!pinWhileCollapse) return false;
    if (window.scrollY > 1) return false;
    if (collapsing) return true;
    if (!bar.classList.contains('is-compact')) return true;
    return false;
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

  if (pinWhileCollapse) {
    window.addEventListener(
      'wheel',
      function (e) {
        if (!shouldInterceptFirstScroll()) return;
        if (e.deltaY <= 0 && !collapsing) return;
        e.preventDefault();
        if (!collapsing) startCollapse();
      },
      { passive: false }
    );

    var touchStartY = null;
    window.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    window.addEventListener(
      'touchmove',
      function (e) {
        if (touchStartY == null || !shouldInterceptFirstScroll()) return;
        var dy = touchStartY - e.touches[0].clientY;
        if (collapsing || dy > 8) {
          e.preventDefault();
          if (!collapsing && dy > 8) startCollapse();
        }
      },
      { passive: false }
    );

    window.addEventListener('keydown', function (e) {
      if (!shouldInterceptFirstScroll()) return;
      if (e.key !== 'PageDown' && e.key !== 'ArrowDown' && e.key !== ' ' && e.key !== 'Spacebar') {
        return;
      }
      e.preventDefault();
      if (!collapsing) startCollapse();
    });

    window.addEventListener('scroll', expandAtTop, { passive: true });
    expandAtTop();
  } else {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

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
