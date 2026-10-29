// First-view reveal for pages in the locked visual system (STYLE.md):
// each [data-reveal] element fades in and rises 32px over 0.9s the first time it
// scrolls into view, once per visit; items arriving together follow 140ms apart.
// Reduced motion or no IntersectionObserver: everything simply shows.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!items.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var REVEAL_MS = 900, STAGGER_MS = 140, last = 0;
  items.forEach(function (el) { el.classList.add('pm-item'); });
  document.documentElement.classList.add('pm-reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.sort(function (a, b) { return items.indexOf(a.target) - items.indexOf(b.target); });
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, now = performance.now(), delay = Math.max(0, last + STAGGER_MS - now);
      last = now + delay;
      io.unobserve(el);
      setTimeout(function () { el.classList.add('is-in'); }, delay);
      setTimeout(function () { el.classList.add('is-done'); }, delay + REVEAL_MS + 1800);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
