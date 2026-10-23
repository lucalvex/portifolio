// Light and dark theme toggle.
// The saved theme is applied earlier, by a short script in the <head> of index.html,
// so the page never flashes the wrong theme while loading.
export function initTheme() {
  var button = document.getElementById('theme-toggle');
  var root = document.documentElement;
  function isDarkNow() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function updateLabel() { button.setAttribute('aria-label', isDarkNow() ? 'Ativar tema claro' : 'Ativar tema escuro'); }
  button.addEventListener('click', function () {
    var next = isDarkNow() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateLabel();
    document.dispatchEvent(new CustomEvent('themechange'));
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { updateLabel(); document.dispatchEvent(new CustomEvent('themechange')); });
  updateLabel();
}
