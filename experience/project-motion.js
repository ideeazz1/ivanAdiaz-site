// Selected Systems section.
// 1. Reveal: the heading, intro line and each card fade in and rise the first time they
//    scroll into view; items arriving together follow one another.
// 2. Play: each card's video plays once per visit, starting just after its card settles, and
//    then stays on its final frame. Only the most visible card plays; a card scrolled away
//    mid-play pauses and resumes where it left off. Nothing replays when you scroll back.
// Reduced motion, no JS, or a failed load show the still poster with no effects.
(function () {
  var section = document.querySelector('.career-selected');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.career-visual-card'));
  if (!section || !cards.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var REVEAL_MS = 900, STAGGER_MS = 140;
  var items = Array.prototype.slice.call(section.querySelectorAll('h2, .section-lede')).concat(cards);
  items.forEach(function (el) { el.classList.add('pm-item'); });
  section.classList.add('pm-reveal');

  var state = new Map(); // element -> { ratio, settledAt, video, done }
  items.forEach(function (el) {
    var v = el.querySelector && el.querySelector('.career-visual-card__video');
    state.set(el, { ratio: 0, settledAt: 0, video: v, done: !v });
    if (v) v.addEventListener('ended', function () { state.get(el).done = true; active = null; pick(); });
  });

  var active = null, timer = null, lastReveal = 0;
  var generation = 0; // invalidate pending playback when the active card changes

  function reveal(el, s) {
    if (s.settledAt) return;
    var now = performance.now();
    var delay = Math.max(0, lastReveal + STAGGER_MS - now); // follow the previous item
    lastReveal = now + delay;
    s.settledAt = now + delay + REVEAL_MS;
    setTimeout(function () { el.classList.add('is-in'); }, delay);
    setTimeout(function () { el.classList.add('is-done'); }, delay + REVEAL_MS + 100);
  }

  function pick() {
    var best = null, bestRatio = 0.6; // at least 60% visible
    cards.forEach(function (c) {
      var s = state.get(c);
      if (!s.done && s.ratio >= bestRatio) { best = c; bestRatio = s.ratio; }
    });
    if (best === active) return;
    ++generation;
    clearTimeout(timer);
    if (active) state.get(active).video.pause();
    active = best;
    if (!active) return;
    var s = state.get(active);
    var selected = active;
    var ticket = generation;
    timer = setTimeout(function () {
      // An earlier delayed start must never play after scroll selected another card.
      if (ticket !== generation || active !== selected || s.done || s.ratio < 0.6) return;
      var p = s.video.play();
      if (p && p.catch) p.catch(function () {
        // Interrupted play() promises are normal on mobile when scrolling.
        // Only genuine autoplay failures of the selected card retire it.
        if (ticket === generation && active === selected) {
          s.done = true;
          active = null;
          pick();
        }
      });
    }, Math.max(0, s.settledAt - performance.now()));
  }

  var io = new IntersectionObserver(function (entries) {
    entries.sort(function (a, b) { return items.indexOf(a.target) - items.indexOf(b.target); });
    entries.forEach(function (e) {
      var s = state.get(e.target);
      s.ratio = e.intersectionRatio;
      if (e.isIntersecting && e.intersectionRatio >= 0.1) reveal(e.target, s);
    });
    pick();
  }, { threshold: [0, 0.1, 0.6, 0.8, 1], rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();
