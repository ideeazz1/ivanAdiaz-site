(function () {
  var bar = document.querySelector('.top-bar');
  var pill = document.querySelector('.top-bar__pill');
  var toggle = document.querySelector('.top-bar__menu-toggle');
  var nav = document.getElementById('top-bar-nav');
  var compactAt = 40;

  if (!bar) return;

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
