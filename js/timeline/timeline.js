// Scroll-driven 3D timeline: the camera travels from 2023 to today
// over three parallel lanes, and the card shows the experience in focus.
// Without WebGL, the page shows the plain list instead. With reduced motion,
// the scene still follows the scroll, but without easing, hopping or parallax.
import { TODAY, items, years } from './data.js';
import { applyPixelBackground } from './pixel-background.js';
import { createCapybara } from './capybara.js';
import { prefersReducedMotion } from '../motion.js';

export function initTimeline() {
  if (!window.THREE) return;
  var reduceMotion = prefersReducedMotion();

  var canvas = document.getElementById('timeline-canvas');
  var probe = document.createElement('canvas');
  if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return;
  document.documentElement.classList.add('has-3d');
  document.getElementById('experience-intro').textContent =
    'Role para avançar no tempo, de 2023 até hoje. Experiências que aconteceram ao mesmo tempo correm em trilhas paralelas.';

  var track = document.getElementById('track');
  var labels = document.getElementById('labels');
  var card = document.getElementById('card');
  var progress = document.getElementById('progress');

  var SCALE = 0.32;
  function monthToX(m) { return m * SCALE; }
  function laneZ(tr) { return -tr * 0.9; }

  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);

  var baseMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--bones') });
  var activeMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--accent') });
  var guideMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--line') });
  var nodeMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--accent') });

  // lane guides
  var segmentLength = monthToX(TODAY + 4);
  for (var tr = 0; tr < 3; tr++) {
    var guide = new THREE.Mesh(new THREE.BoxGeometry(segmentLength, 0.012, 0.012), guideMaterial);
    guide.position.set(segmentLength / 2 - monthToX(2), -0.06, laneZ(tr));
    scene.add(guide);
  }
  // year markers crossing the lanes
  years.forEach(function (a) {
    var marker = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, 2.4), guideMaterial);
    marker.position.set(monthToX(a.m), -0.06, -0.9);
    scene.add(marker);
  });
  // bars and nodes
  var bars = items.map(function (it) {
    var len = monthToX(it.end - it.start);
    var b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.09, 0.09), baseMaterial);
    b.userData = { len: len, x0: monthToX(it.start) };
    b.position.set(monthToX(it.start) + len / 2, 0, laneZ(it.lane));
    var node = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), nodeMaterial);
    node.position.set(monthToX(it.start), 0, laneZ(it.lane));
    scene.add(b); scene.add(node);
    return b;
  });

  // projected HTML labels
  var itemLabels = items.map(function (it) { var s = document.createElement('span'); s.textContent = it.short; labels.appendChild(s); return s; });
  var yearLabels = years.map(function (a) { var s = document.createElement('span'); s.className = 'year-label'; s.textContent = a.t; labels.appendChild(s); return s; });

  function updateColors() { baseMaterial.color.set(cssVar('--bones')); activeMaterial.color.set(cssVar('--accent')); guideMaterial.color.set(cssVar('--line')); nodeMaterial.color.set(cssVar('--accent')); }
  document.addEventListener('themechange', updateColors);

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var visible = false;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(track);

  var currentActive = -1, focus = 0, v = new THREE.Vector3();
  function show(i) {
    var it = items[i];
    card.classList.add('swap');
    setTimeout(function () {
      card.innerHTML = '';
      var t = document.createElement('time'); t.textContent = it.date;
      var h = document.createElement('h3'); h.textContent = it.title;
      var o = document.createElement('p'); o.className = 'org'; o.textContent = it.org;
      var d = document.createElement('p'); d.className = 'description'; d.textContent = it.description;
      card.appendChild(t); card.appendChild(h); card.appendChild(o); card.appendChild(d);
      card.classList.remove('swap');
    }, currentActive === -1 ? 0 : 200);
    progress.textContent = (i + 1) + ' de ' + items.length;
    currentActive = i;
  }

  var sticky = canvas.parentElement;
  var background = applyPixelBackground(sticky);
  var capybara = createCapybara(scene);

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    var r = track.getBoundingClientRect();
    var total = track.offsetHeight - window.innerHeight;
    var p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
    var target = p * (TODAY - 1);
    focus += (target - focus) * (reduceMotion ? 1 : 0.08);

    // active item: the latest one that has started at the focused point in time
    var active = 0;
    for (var i = 0; i < items.length; i++) if (items[i].start <= focus + 0.6) active = i;
    if (active !== currentActive) show(active);

    // bars grow as time advances
    bars.forEach(function (b, i) {
      var it = items[i];
      var elapsed = Math.max(0.0001, Math.min(it.end, Math.max(it.start, focus + 3)) - it.start);
      var len = monthToX(elapsed);
      b.scale.x = Math.max(0.0001, len);
      b.position.x = b.userData.x0 + len / 2;
      b.material = (i === active) ? activeMaterial : baseMaterial;
    });

    var narrow = canvas.clientWidth < 700;
    var fx = monthToX(focus);
    if (narrow) { camera.position.set(fx - 0.5, 2.1, 4.4); camera.lookAt(fx - 0.15, -0.35, -0.9); }
    else { camera.position.set(fx - 1.8, 1.4, 3.0); camera.lookAt(fx - 0.3, -0.05, -0.9); }
    capybara.update(focus, monthToX(focus) + 0.05, laneZ, items[active].lane, reduceMotion);
    if (!reduceMotion) background.parallax(focus / TODAY);

    renderer.render(scene, camera);

    var w = canvas.clientWidth, h = canvas.clientHeight;
    function placeLabel(span, x, y, z) {
      v.set(x, y, z).project(camera);
      var onScreen = v.z < 1 && v.x > -1.2 && v.x < 1.2;
      span.style.left = ((v.x + 1) / 2 * w) + 'px';
      span.style.top = ((1 - v.y) / 2 * h) + 'px';
      return onScreen;
    }
    items.forEach(function (it, i) {
      var s = itemLabels[i];
      var ok = placeLabel(s, monthToX(it.start), 0.16, laneZ(it.lane));
      var near = Math.abs(it.start - focus) < 14;
      s.style.opacity = ok && near && it.start <= focus + 6 ? (i === active ? 1 : 0.7) : 0;
      s.classList.toggle('active', i === active);
    });
    years.forEach(function (a, i) {
      var ok = placeLabel(yearLabels[i], monthToX(a.m), -0.06, 0.3);
      yearLabels[i].style.opacity = ok ? 0.55 : 0;
    });
  }
  requestAnimationFrame(frame);
}
