/**
 * K D Engineering Solutions - Card Scroll Animation
 * Smooth, staggered scroll reveal for all cards across the website.
 */
(function() {
  'use strict';

  // Mark HTML element so CSS knows JS is active
  if (document.documentElement) {
    document.documentElement.classList.add('js-scroll-animate');
  }

  function initCardScrollAnimation() {
    var cardSelectors = [
      '.initiative-card',
      '.category-card',
      '.service-card',
      '.quote-form-card',
      '.pillar-col',
      '.stat-pill-box',
      '.aeline-prod-card',
      '.prod-gallery-card',
      '.prod-info-card',
      '.prod-tabs-container',
      '.card-animate',
      '[data-card]'
    ];

    var cards = document.querySelectorAll(cardSelectors.join(', '));
    if (!cards || cards.length === 0) return;

    // Group cards by parent to assign staggered delay
    var parents = new Map();
    cards.forEach(function(card) {
      var parent = card.parentElement || document.body;
      if (!parents.has(parent)) {
        parents.set(parent, []);
      }
      parents.get(parent).push(card);
    });

    parents.forEach(function(children) {
      children.forEach(function(card, idx) {
        var delay = (idx % 4) * 0.08;
        card.style.setProperty('--card-delay', delay + 's');
      });
    });

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function(card) {
        card.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.classList.add('is-revealed');
      } else {
        observer.observe(card);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardScrollAnimation);
  } else {
    initCardScrollAnimation();
  }
})();
