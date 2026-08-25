(function () {
  'use strict';
  var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!motionOK) return;

  document.documentElement.classList.add('motion-ok');

  /* Reveal anything that has reached the viewport, including elements the page
     jumped straight past (anchor links, a restored scroll position, a fast
     flick). An IntersectionObserver reports changes in intersection, so a jump
     over an element fires nothing and would leave it invisible for good. */
  var pending = [].slice.call(document.querySelectorAll('.reveal'));
  var queued = false;

  function sweep() {
    queued = false;
    var limit = window.innerHeight - 40;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top >= limit) return true;
      el.classList.add('revealed');
      return false;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sweep();

  /* Hero leaf video. The poster is a real <img> so it is the LCP element and
     loads at full priority; the video fades in over it only once it plays. */
  var video = document.querySelector('video.hero-video');
  if (video && !(navigator.connection && navigator.connection.saveData)) {
    video.querySelectorAll('source[data-src]').forEach(function (s) {
      s.src = s.getAttribute('data-src');
    });
    video.load();
    video.play().then(function () {
      video.classList.add('playing');
    }).catch(function () {});
  }
})();
