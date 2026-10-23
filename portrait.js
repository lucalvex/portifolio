// Photo that flips and winks. The animation is pure CSS (css/hero.css);
// here we only toggle the state on tap, since phones have no hover.
export function initPortrait() {
  var r = document.getElementById('portrait');
  r.addEventListener('click', function () {
    var pressed = r.getAttribute('aria-pressed') === 'true';
    r.setAttribute('aria-pressed', pressed ? 'false' : 'true');
  });
}
