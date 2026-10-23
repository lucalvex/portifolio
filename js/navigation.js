// Menu links scroll to their section without changing the page URL,
// and the footer shows the current year.
export function initNavigation() {
  document.querySelectorAll('[data-target]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('data-target'));
      if (target) { e.preventDefault(); target.scrollIntoView({ block: 'start' }); }
    });
  });
  document.getElementById('year').textContent = new Date().getFullYear();
}
