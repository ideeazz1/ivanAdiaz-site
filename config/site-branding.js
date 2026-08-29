'use strict';

/**
 * Shared Ivan Diaz site branding (favicon + theme).
 * Include in <head> before other styles: <script src="/config/site-branding.js"></script>
 * Or use the static tags in config/site-branding-head.html on each page.
 */
(function () {
  const head = document.head;
  if (!head || head.querySelector('link[data-ivan-branding="icon"]')) return;

  function link(rel, href, extra) {
    const el = document.createElement('link');
    el.rel = rel;
    el.href = href;
    el.setAttribute('data-ivan-branding', extra || rel);
    head.appendChild(el);
  }

  link('icon', '/favicon.png', 'icon');
  link('apple-touch-icon', '/preview-card.png', 'apple');

  if (!head.querySelector('meta[name="theme-color"]')) {
    const theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#343A40';
    head.appendChild(theme);
  }
})();
