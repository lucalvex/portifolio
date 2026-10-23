// Entry point: each part of the page lives in its own module.
// three.js is loaded first, by a classic <script> tag in index.html.
import { initTheme } from './theme.js';
import { initMotionToggle } from './motion.js';
import { initNavigation } from './navigation.js';
import { initPortrait } from './portrait.js';
import { initQuestions } from './questions.js';
import { initHero } from './hero/hero.js';
import { initReveal } from './reveal.js';
import { initTimeline } from './timeline/timeline.js';

initTheme();
initMotionToggle();
initNavigation();
initPortrait();
initQuestions();
initHero();
initReveal();
initTimeline();
