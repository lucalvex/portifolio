// Hero: a 3D skeleton built from the 17 keypoints used by YOLO11n-Pose.
// It assembles point by point, follows the cursor, gestures for each question
// and strikes poses on its own when nobody is interacting.
import { GESTURES, REACTIONS, IDLE_POSES, vector } from './poses.js';
import { createBubble } from './bubble.js';
import { prefersReducedMotion } from '../motion.js';

export function initHero() {
  if (!window.THREE) return;

  var canvas = document.getElementById('pose-canvas');
  var stage = canvas.parentElement;
  var detectionBox = document.getElementById('detection-box');
  var reduceMotion = prefersReducedMotion();
  var heroSection = document.getElementById('home');
  var heroVisible = true;
  new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(heroSection);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 1.0, 5.0);
  camera.lookAt(0, 0.98, 0);

  // 17 COCO keypoints: nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles
  var base = [
    [0, 1.6, 0.1], [0.045, 1.655, 0.07], [-0.045, 1.655, 0.07], [0.1, 1.635, -0.01], [-0.1, 1.635, -0.01],
    [0.2, 1.42, 0], [-0.2, 1.42, 0], [0.27, 1.13, 0.03], [-0.27, 1.13, 0.03],
    [0.25, 0.87, 0.12], [-0.25, 0.87, 0.12], [0.12, 0.95, 0], [-0.12, 0.95, 0],
    [0.13, 0.5, 0.04], [-0.13, 0.5, 0.04], [0.14, 0.06, -0.02], [-0.14, 0.06, -0.02]
  ].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
  var bones = [[15,13],[13,11],[16,14],[14,12],[11,12],[5,11],[6,12],[5,6],[5,7],[6,8],[7,9],[8,10],[1,2],[0,1],[0,2],[1,3],[2,4],[3,5],[4,6]];
  // reveal order: from face to feet, like a detector locking on
  var revealOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  var pointMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--accent') });
  var boneMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--bones') });
  var shadowMaterial = new THREE.MeshBasicMaterial({ color: cssVar('--bones'), transparent: true, opacity: 0.06 });

  var figure = new THREE.Group();
  scene.add(figure);
  var pointGeometry = new THREE.SphereGeometry(0.026, 20, 14);
  var points = base.map(function () { var m = new THREE.Mesh(pointGeometry, pointMaterial); m.scale.setScalar(0.0001); figure.add(m); return m; });
  var boneGeometry = new THREE.CylinderGeometry(0.0075, 0.0075, 1, 10);
  var boneMeshes = bones.map(function () { var m = new THREE.Mesh(boneGeometry, boneMaterial); m.visible = false; figure.add(m); return m; });
  var shadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), shadowMaterial);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.0; scene.add(shadow);

  function updateColors() {
    pointMaterial.color.set(cssVar('--accent'));
    boneMaterial.color.set(cssVar('--bones'));
    shadowMaterial.color.set(cssVar('--bones'));
  }
  document.addEventListener('themechange', updateColors);

  // pointer normalized to -1..1, relative to the stage
  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  function trackPointer(cx, cy) {
    var r = canvas.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((cx - r.left) / r.width) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, ((cy - r.top) / r.height) * 2 - 1));
  }
  window.addEventListener('pointermove', function (e) { trackPointer(e.clientX, e.clientY); }, { passive: true });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var axisY = new THREE.Vector3(0, 1, 0), axisX = new THREE.Vector3(1, 0, 0), axisZ = new THREE.Vector3(0, 0, 1);
  var current = base.map(function (p) { return p.clone(); });
  var tmp = new THREE.Vector3(), direction = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  function rotateAround(indices, pivot, axis, angle) {
    indices.forEach(function (i) { current[i].sub(pivot).applyAxisAngle(axis, angle).add(pivot); });
  }

  var V = vector;
  var currentQuestion = null, idlePose = null, lastPose = '', nextIdleAt = 0, idleEndsAt = 0;
  var lastInteraction = performance.now();
  function markInteraction() { lastInteraction = performance.now(); }
  window.addEventListener('pointermove', markInteraction, { passive: true });
  window.addEventListener('scroll', markInteraction, { passive: true });
  window.addEventListener('keydown', markInteraction);
  window.addEventListener('touchstart', markInteraction, { passive: true });

  var bubble = createBubble(document.getElementById('bubble'), document.getElementById('reaction'), reduceMotion);
  var showBubble = bubble.show;

  document.addEventListener('gesture', function (e) {
    markInteraction();
    idlePose = null;
    currentQuestion = e.detail ? GESTURES[e.detail] : null;
    showBubble(e.detail ? REACTIONS[e.detail] : null);
  });

  function currentGesture(now) {
    if (currentQuestion) return currentQuestion;
    if (reduceMotion) return null;
    var idle = now - lastInteraction > 7000;
    if (!idle) {
      if (idlePose) { idlePose = null; showBubble(null); }
      nextIdleAt = 0;
      return null;
    }
    if (!idlePose && now >= nextIdleAt) {
      var options = IDLE_POSES.filter(function (o) { return o.name !== lastPose; });
      idlePose = options[Math.floor(Math.random() * options.length)];
      lastPose = idlePose.name;
      idleEndsAt = now + (idlePose.dance ? 3600 : 2800);
      showBubble(idlePose.reaction);
    } else if (idlePose && now >= idleEndsAt) {
      idlePose = null;
      showBubble(null);
      nextIdleAt = now + 2600;
    }
    return idlePose;
  }

  var smoothed = {}, headTiltSmooth = 0, leanSmooth = 0;
  function vec(x, y, z) { return new THREE.Vector3(x, y, z); }

  var startTime = performance.now();
  var POINTS_DURATION = 1400, BONES_DURATION = 700, WAVE_DURATION = 1800;
  if (reduceMotion) startTime -= 10000;

  function pose(t, assemblyTime, now) {
    for (var i = 0; i < base.length; i++) current[i].copy(base[i]);
    var alive = reduceMotion ? 0 : 1;
    // breathing
    var breath = Math.sin(t * 1.6) * 0.006 * alive;
    [0,1,2,3,4,5,6,7,8,9,10].forEach(function (i) { current[i].y += breath; });
    // relaxed arm sway
    rotateAround([7, 9], current[5], axisZ, Math.sin(t * 1.1) * 0.035 * alive);
    rotateAround([8, 10], current[6], axisZ, -Math.sin(t * 1.1 + 0.6) * 0.035 * alive);
    // a single wave with the figure's right arm, right after it assembles
    var a = (assemblyTime - POINTS_DURATION - BONES_DURATION) / WAVE_DURATION;
    if (!reduceMotion && a > 0 && a < 1) {
      var env = Math.sin(a * Math.PI);
      rotateAround([8, 10], current[6], axisZ, -2.3 * env);
      rotateAround([10], current[8], axisZ, Math.sin(a * Math.PI * 6) * 0.45 * env);
    }
    // question gesture or idle pose, smoothly blending between any two poses
    var g = assemblyTime > POINTS_DURATION + BONES_DURATION + WAVE_DURATION ? currentGesture(now) : null;
    var targets = g ? g.p : {};
    if (g && g.dance) {
      var d = Math.sin(t * 5.2);
      targets = { 7: vec(0.4, 1.5 + 0.06 * d, 0.06), 9: vec(0.47, 1.76 + 0.09 * d, 0.06), 8: vec(-0.4, 1.5 - 0.06 * d, 0.06), 10: vec(-0.47, 1.76 - 0.09 * d, 0.06) };
    }
    [7, 8, 9, 10].forEach(function (k) {
      var desired = targets[k] || current[k];
      if (!smoothed[k]) smoothed[k] = current[k].clone();
      // with reduced motion, gestures still blend, just more slowly
      var rate = g || smoothed[k].distanceTo(desired) > 0.004 ? (reduceMotion ? 0.05 : 0.085) : 1;
      smoothed[k].lerp(desired, rate);
      current[k].copy(smoothed[k]);
    });
    var targetHeadTilt = g ? (g.headTilt || 0) : 0;
    var targetLean = g ? (g.lean || 0) + (g.dance ? Math.sin(t * 2.6) * 0.09 : 0) : 0;
    headTiltSmooth += (targetHeadTilt - headTiltSmooth) * (reduceMotion ? 0.05 : 0.085);
    leanSmooth += (targetLean - leanSmooth) * (reduceMotion ? 0.05 : 0.085);
    // torso leans toward the cursor
    var hips = tmp.copy(current[11]).add(current[12]).multiplyScalar(0.5).clone();
    rotateAround([0,1,2,3,4,5,6,7,8,9,10], hips, axisZ, -curX * 0.07 + leanSmooth);
    // head follows the cursor
    var neck = current[5].clone().add(current[6]).multiplyScalar(0.5); neck.y += 0.08;
    rotateAround([0,1,2,3,4], neck, axisY, curX * 0.55);
    rotateAround([0,1,2,3,4], neck, axisX, curY * 0.3 + headTiltSmooth);
  }

  var projected = new THREE.Vector3();
  function frame(now) {
    if (!heroVisible) { requestAnimationFrame(frame); return; }
    var assemblyTime = now - startTime;
    var t = now / 1000;
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    pose(t, assemblyTime, now);
    var scrollProgress = reduceMotion ? 0 : Math.max(0, Math.min(1, window.scrollY / (heroSection.offsetHeight * 0.85)));
    figure.rotation.y = curX * 0.45 + (reduceMotion ? 0 : Math.sin(t * 0.35) * 0.08) + scrollProgress * 1.5;
    figure.position.y = -scrollProgress * 0.35;

    // keypoints pop in one by one
    for (var k = 0; k < revealOrder.length; k++) {
      var i = revealOrder[k];
      var p = Math.max(0, Math.min(1, (assemblyTime - k * (POINTS_DURATION / revealOrder.length)) / 220));
      var s = p < 1 ? (1 - Math.pow(1 - p, 3)) * (1 + 0.6 * Math.sin(p * Math.PI)) : 1;
      points[i].scale.setScalar(Math.max(0.0001, s));
      points[i].position.copy(current[i]);
    }
    // bones connect
    var bonesProgress = Math.max(0, Math.min(1, (assemblyTime - POINTS_DURATION) / BONES_DURATION));
    for (var j = 0; j < bones.length; j++) {
      var m = boneMeshes[j];
      var phase = Math.max(0, Math.min(1, bonesProgress * 1.6 - (j / bones.length) * 0.6));
      if (phase <= 0) { m.visible = false; continue; }
      var A = current[bones[j][0]], B = current[bones[j][1]];
      direction.subVectors(B, A);
      var segmentLength = direction.length() * phase;
      direction.normalize();
      m.visible = true;
      m.scale.set(1, Math.max(0.0001, segmentLength), 1);
      m.position.copy(A).addScaledVector(direction, segmentLength / 2);
      m.quaternion.setFromUnitVectors(up, direction);
    }

    renderer.render(scene, camera);

    // detection box follows the figure
    if (bonesProgress >= 1) {
      var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      figure.updateMatrixWorld();
      for (var q = 0; q < current.length; q++) {
        projected.copy(current[q]).applyMatrix4(figure.matrixWorld).project(camera);
        var x = (projected.x + 1) / 2 * w, y = (1 - projected.y) / 2 * h;
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      var pad = 18;
      detectionBox.style.left = (minX - pad) + 'px';
      detectionBox.style.top = (minY - pad - 6) + 'px';
      detectionBox.style.width = (maxX - minX + pad * 2) + 'px';
      detectionBox.style.height = (maxY - minY + pad * 2 + 6) + 'px';
      detectionBox.classList.add('visible');
      detectionBox.style.opacity = String(Math.max(0, 1 - scrollProgress * 2.5));
      // bubble comes out of the top of the head
      projected.copy(current[3]).add(current[4]).multiplyScalar(0.5);
      projected.y += 0.1;
      projected.applyMatrix4(figure.matrixWorld).project(camera);
      bubble.place((projected.x + 1) / 2 * w + 10, (1 - projected.y) / 2 * h);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
