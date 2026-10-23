// Thought bubble: the enter animation (dot by dot) and the exit animation
// live in CSS, as transitions on .bubble in css/hero.css. This module controls
// which reaction shows up and where the bubble sits, following Hero's head.
export function createBubble(element, reaction, reduceMotion) {
  let currentEmoji = null;
  let swapTimer = null;

  function show(emoji) {
    if (emoji === currentEmoji) return;
    clearTimeout(swapTimer);
    const hadOne = currentEmoji !== null;
    currentEmoji = emoji;
    if (!emoji) { element.classList.remove('active'); return; }
    if (hadOne && !reduceMotion) {
      // collapse the current bubble before opening the new one
      element.classList.remove('active');
      swapTimer = setTimeout(() => { reaction.textContent = emoji; element.classList.add('active'); }, 420);
    } else {
      reaction.textContent = emoji;
      element.classList.add('active');
    }
  }

  function place(x, y) {
    element.style.transform = `translate(${x}px, ${y}px)`;
  }

  return { show, place };
}
