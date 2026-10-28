// Selected Systems cards.
// 1. Reveal: each card fades in, rises and comes into focus the first time it scrolls into view.
// 2. Play: each card's video plays once per visit, starting just after its reveal, and then
//    stays on its final frame. Only the most visible card plays; a card scrolled away mid-play
//    pauses and resumes where it left off. Nothing replays when you scroll back.
// Reduced motion, no JS, or a failed load show the still poster with no effects.
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.career-visual-card'));
  if (!cards.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var REVEAL_MS = 800;
  var section = cards[0].parentElement;
  section.classList.add('pm-reveal');

  var info = new Map(); // card -> { ratio, revealedAt, video, done }
  cards.forEach(function (c) {
    var v = c.querySelector('.career-visual-card__video');
    info.set(c, { ratio: 0, revealedAt: 0, video: v, done: !v });
    if (v) v.addEventListener('ended', function () { info.get(c).done = true; active = null; pick(); });
  });

  var active = null, timer = null;

  function reveal(c, i) {
    if (i.revealedAt) return;
    i.revealedAt = performance.now();
    c.classList.add('is-in');
    setTimeout(function () { c.classList.add('is-done'); }, REVEAL_MS + 100);
  }

  function pick() {
    var best = null, bestRatio = 0.6; // at least 60% visible
    cards.forEach(function (c) {
      var i = info.get(c);
      if (!i.done && i.ratio >= bestRatio) { best = c; bestRatio = i.ratio; }
    });
    if (best === active) return;
    clearTimeout(timer);
    if (active) info.get(active).video.pause();
    active = best;
    if (!active) return;
    var i = info.get(active);
    var wait = Math.max(0, i.revealedAt + REVEAL_MS - performance.now());
    timer = setTimeout(function () {
      var p = i.video.play();
      if (p && p.catch) p.catch(function () { i.done = true; }); // autoplay refused: keep the poster
    }, wait);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var i = info.get(e.target);
      i.ratio = e.intersectionRatio;
      if (e.intersectionRatio >= 0.12) reveal(e.target, i);
    });
    pick();
  }, { threshold: [0, 0.12, 0.6, 0.8, 1] });

  cards.forEach(function (c) { io.observe(c); });
})();
