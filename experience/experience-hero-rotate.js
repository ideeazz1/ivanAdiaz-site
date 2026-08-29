'use strict';

/**
 * Optimus-style rotating hero word — text only, no canvas/graphics.
 * Respects prefers-reduced-motion.
 */
(function initExperienceHeroRotate() {
  const root = document.querySelector('[data-hero-rotate]');
  if (!root) return;

  const words = (root.dataset.words || '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
  if (!words.length) return;

  const wordEl = root.querySelector('[data-hero-word]');
  const section = root.closest('.experience-hero');
  if (!wordEl || !section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intervalMs = Number(root.dataset.interval) || 2500;
  const charDelayMs = Number(root.dataset.charDelay) || 50;
  let index = 0;

  function renderWord(word) {
    wordEl.replaceChildren();
    if (reducedMotion) {
      wordEl.textContent = word;
      return;
    }
    [...word].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'experience-hero__char';
      span.style.animationDelay = `${i * charDelayMs}ms`;
      span.textContent = char;
      wordEl.appendChild(span);
    });
  }

  function tick() {
    index = (index + 1) % words.length;
    renderWord(words[index]);
  }

  requestAnimationFrame(() => {
    section.classList.add('is-hero-ready');
    renderWord(words[0]);
    if (!reducedMotion && words.length > 1) {
      window.setInterval(tick, intervalMs);
    }
  });
})();
