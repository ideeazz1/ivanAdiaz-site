// Selected Systems cards (Ivan, 2026-11-16: "they should load once and stay fixed").
// Every card is visible from the start: no scroll fade-in. Each video loads with the page
// and plays once, the first time its card is at least half on screen. It is never paused,
// rewound or replayed: scrolling away lets it finish, and a card already played this visit
// (remembered for the browser session) shows its final frame straight away.
// Reduced motion, no JS, or a failed load show the still poster (the final frame).
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.career-visual-card'));
  if (!cards.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var KEY = 'ivan-cards-played';
  var played = {};
  try { played = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { played = {}; }
  function remember(src) {
    played[src] = 1;
    try { sessionStorage.setItem(KEY, JSON.stringify(played)); } catch (e) { /* private mode: fine */ }
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || e.intersectionRatio < 0.5) return;
      var v = e.target.querySelector('.career-visual-card__video');
      io.unobserve(e.target); // one chance only
      if (!v) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster stays */ });
    });
  }, { threshold: [0, 0.5] });

  cards.forEach(function (card) {
    var v = card.querySelector('.career-visual-card__video');
    if (!v) return;
    var src = (v.querySelector('source') || v).getAttribute('src') || '';
    v.removeAttribute('loop');
    if (played[src]) return; // already played this visit: keep the final-frame poster
    v.preload = 'auto';
    v.addEventListener('ended', function () { remember(src); });
    io.observe(card);
  });
})();
