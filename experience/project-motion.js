// Selected Systems cards: play each short video once when it scrolls into view.
// Only the most visible card plays; the rest pause. Leaving and returning replays it.
// Reduced motion, no JS, or a failed load all fall back to the still poster.
(function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('.career-visual-card__video'));
  if (!videos.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ratio = new Map();
  var active = null;
  var played = new Set(); // played during the current visit to the viewport

  function pick() {
    var best = null, bestRatio = 0.6; // must be at least 60% visible
    videos.forEach(function (v) {
      var r = ratio.get(v) || 0;
      if (r >= bestRatio) { best = v; bestRatio = r; }
    });
    if (best === active) return;
    if (active) active.pause();
    active = best;
    if (active && !played.has(active)) {
      played.add(active);
      active.currentTime = 0;
      var p = active.play();
      if (p && p.catch) p.catch(function () {}); // autoplay refused: the poster stays
    }
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      ratio.set(e.target, e.intersectionRatio);
      if (e.intersectionRatio < 0.15) played.delete(e.target); // gone: replay next visit
    });
    pick();
  }, { threshold: [0, 0.15, 0.6, 0.8, 1] });

  videos.forEach(function (v) { io.observe(v); });
})();
