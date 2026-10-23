// Motion preference. By default the page follows the system setting
// (prefers-reduced-motion), but visitors can override it with the motion toggle.
// Work computers often have animations turned off by IT, so the toggle lets
// someone who never asked for reduced motion turn the full experience back on.
// The choice is applied early by a short script in the <head> of index.html
// (data-motion on <html>), so CSS and every module agree from the first frame.

const STORAGE_KEY = 'motion';
const systemQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export function systemPrefersReducedMotion() {
  return systemQuery.matches;
}

// The effective preference: the visitor's choice if there is one, otherwise the system's.
export function prefersReducedMotion() {
  const choice = document.documentElement.getAttribute('data-motion');
  if (choice === 'full') return false;
  if (choice === 'reduced') return true;
  return systemPrefersReducedMotion();
}

export function initMotionToggle() {
  const button = document.getElementById('motion-toggle');
  const root = document.documentElement;

  // Only offer the toggle when it matters: the system asks for reduced motion,
  // or the visitor has already made a choice and may want to undo it.
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (!systemPrefersReducedMotion() && !saved) return;

  function updateLabel() {
    const reduced = prefersReducedMotion();
    button.textContent = reduced ? 'Ativar animações' : 'Reduzir animações';
    button.setAttribute('aria-pressed', reduced ? 'false' : 'true');
  }

  button.hidden = false;
  updateLabel();
  button.addEventListener('click', () => {
    const next = prefersReducedMotion() ? 'full' : 'reduced';
    root.setAttribute('data-motion', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    // The 3D scenes read the preference when they start, so reload to rebuild
    // them in the new mode. Browsers keep the scroll position on reload.
    location.reload();
  });
}
