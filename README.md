# Portfolio — Lucas Alves de Lima

Personal portfolio of a front-end developer, featuring 3D animations built with three.js.

**Live site:** https://lucalvex.github.io

## About

The centerpiece is **Hero**, a 3D figure made of the 17 body keypoints used by YOLO11n-Pose, the pose estimation model from my undergraduate thesis on detecting motor stereotypies. When the page loads, the keypoints appear one by one, like a detector locking onto a body, and then connect to form the figure.

Hero is more than decoration: it answers questions about my background, reacts to the cursor and comes alive on its own when nobody is interacting.

## Features

- **Interactive Hero:** its head follows the cursor and its torso leans toward it.
- **Questions and answers:** each question makes Hero strike a different gesture (hand on chin, open arms, hand on heart) and opens a thought bubble that grows dot by dot, ending in an emoji reaction.
- **Idle poses:** after a few seconds without interaction, Hero stretches, crosses its arms, checks its watch or dances, always blending smoothly between poses.
- **Winking photo:** on hover, the photo flips like a coin and reveals a face that winks and releases hearts.
- **Scroll-driven 3D timeline:** the camera travels from 2023 to today over parallel lanes, showing experiences that happened at the same time.
- **Pixel-art capybara:** walks along the timeline bars as the page scrolls, sits down when scrolling stops and hops between lanes, over a pixel-art background with three parallax layers.
- **Light and dark themes:** follows the system setting by default, with a toggle to switch manually. The choice is saved in the browser.

## Accessibility

- With reduced motion enabled in the operating system, the page switches to a calmer mode: no automatic animations, parallax or bounces, while interactions use gentle fades. The 3D timeline still follows the scroll.
- When the system asks for reduced motion, a motion toggle appears next to the theme toggle, so visitors whose computer has animations turned off by default (common on work machines) can turn the full experience on. The choice is saved in the browser.
- Without WebGL support, the timeline becomes a plain list.
- Every control works with the keyboard, with a visible focus ring.
- Hero's answers are announced by screen readers, while the purely visual 3D elements are hidden from them.
- Responsive layout for phones, tablets and desktops.

## Tech stack

- HTML, CSS and JavaScript, with no framework and no build step
- [three.js](https://threejs.org/) (r128) for the 3D scenes
- Pixel art drawn in code on `<canvas>`
- [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), the latter designed by the Braille Institute for maximum legibility

## Project structure

```
├── index.html                page markup
├── assets/photo.jpg
├── css/
│   ├── tokens.css            light and dark theme colors
│   ├── base.css              global styles, navigation, sections and contact
│   ├── hero.css              hero, winking photo, thought bubble and questions
│   ├── projects.css
│   └── timeline.css          experience list and 3D timeline
└── js/
    ├── main.js               entry point, initializes each part
    ├── theme.js              light and dark theme toggle
    ├── motion.js             motion preference and motion toggle
    ├── navigation.js         menu scrolling and footer year
    ├── portrait.js           photo flip on tap
    ├── questions.js          Hero's questions and answers
    ├── reveal.js             scroll reveal animations
    ├── hero/
    │   ├── hero.js           3D skeleton, cursor tracking, gestures and poses
    │   ├── poses.js          target positions for every gesture and pose
    │   └── bubble.js         thought bubble
    └── timeline/
        ├── timeline.js       scroll-driven 3D scene
        ├── data.js           experiences and dates
        ├── pixel-background.js  pixel-art background with parallax
        └── capybara.js       the capybara walking on the bars
```

The JavaScript uses ES modules (`import` and `export`), which run natively in the browser without a build step. Modules talk to each other through DOM events (`gesture` and `themechange`) instead of global variables.

## Running locally

Because it uses ES modules, the page must be served by a local server: opening `index.html` directly from the file system will not load the scripts. From the project folder, run one of these commands and open the address shown in the terminal:

```bash
npx serve .
# or
python -m http.server
```

## Deployment

The site is published with GitHub Pages from the `main` branch. Every push to that branch updates the site automatically.

## Contact

- Email: lucalvex25@gmail.com
- LinkedIn: [linkedin.com/in/lucalvex](https://www.linkedin.com/in/lucalvex/)
- GitHub: [github.com/lucalvex](https://github.com/lucalvex)
