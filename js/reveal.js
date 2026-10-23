// Text and lists ease in while scrolling, in both directions,
// and reset when they leave the viewport.
export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('anim');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) { el.classList.remove('above'); el.classList.add('seen'); }
      else { el.classList.remove('seen'); el.classList.toggle('above', e.boundingClientRect.top < 0); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
}
