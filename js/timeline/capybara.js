// Pixel-art capybara (16 × 12 pixels) that walks on the timeline bars:
// it walks while the page scrolls, faces the scroll direction, sits and blinks when
// scrolling stops, and hops in an arc when the active experience changes lanes.
export function createCapybara(scene) {
  // Sprite frames and texture
  var CAPYBARA_PALETTE = { B: '#A86B3C', L: '#C98E5A', D: '#6E4426', N: '#3A2416', E: '#1B1B1B' };
  var BODY = [
    '................',
    '..........DD....',
    '....LLLLLLLLLL..',
    '..BBBBBBBBBBBBB.',
    '.BBBBBBBBBBBEBBB',
    '.BBBBBBBBBBBBBBN',
    '.BBBBBBBBBBBBBB.',
    '.BBBBBBBBBBBBB..',
    '..BBBBBBBBBBB...'
  ];
  var FRAMES = {
    walkA: BODY.concat(['..DD......DD....', '..DD......DD....', '................']),
    walkB: BODY.concat(['....DD......DD..', '....DD......DD..', '................']),
    sitting: ['................'].concat(BODY, ['..DDDD....DDDD..', '................']).slice(0, 12)
  };
  var capybaraCanvas = document.createElement('canvas'); capybaraCanvas.width = 16; capybaraCanvas.height = 12;
  var capybaraCtx = capybaraCanvas.getContext('2d');
  var capybaraTexture = new THREE.CanvasTexture(capybaraCanvas);
  capybaraTexture.magFilter = THREE.NearestFilter; capybaraTexture.minFilter = THREE.NearestFilter; capybaraTexture.generateMipmaps = false;
  capybaraTexture.wrapS = THREE.RepeatWrapping;
  var capybaraSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: capybaraTexture, transparent: true }));
  capybaraSprite.center.set(0.5, 0);
  capybaraSprite.scale.set(0.42, 0.315, 1);
  scene.add(capybaraSprite);
  var currentFrame = '';
  function drawCapybara(name, blinking) {
    var key = name + (blinking ? '-blink' : '');
    if (key === currentFrame) return;
    currentFrame = key;
    capybaraCtx.clearRect(0, 0, 16, 12);
    FRAMES[name].forEach(function (row, y) {
      for (var x = 0; x < 16; x++) {
        var c = row[x];
        if (c === '.') continue;
        if (c === 'E' && blinking) c = 'B';
        capybaraCtx.fillStyle = CAPYBARA_PALETTE[c]; capybaraCtx.fillRect(x, y, 1, 1);
      }
    });
    capybaraTexture.needsUpdate = true;
  }
  drawCapybara('sitting', false);
  var currentLane = 0, targetLane = 0, hopStart = -1, hopFrom = 0, lastMove = 0, previousFocus = 0, facing = 1;

  // focus: point in time, in months; x: position in the scene; laneToZ: converts a lane to z;
  // reduceMotion: it still walks while the visitor scrolls, but slides between lanes
  // instead of hopping, doesn't bob while walking and doesn't blink on its own
  function update(focus, x, laneToZ, activeLane, reduceMotion) {
    // walk while scrolling, sit when idle, hop between lanes
    var nowMs = performance.now();
    var step = focus - previousFocus; previousFocus = focus;
    if (Math.abs(step) > 0.004) { lastMove = nowMs; facing = step > 0 ? 1 : -1; }
    var walking = nowMs - lastMove < 260;
    if (walking) drawCapybara(Math.floor(nowMs / 140) % 2 ? 'walkA' : 'walkB', false);
    else drawCapybara('sitting', !reduceMotion && (nowMs % 3200) < 160);
    capybaraTexture.repeat.x = facing; capybaraTexture.offset.x = facing < 0 ? 1 : 0;
    var newLane = activeLane;
    if (newLane !== targetLane) { hopFrom = currentLane; targetLane = newLane; hopStart = nowMs; }
    var hopHeight = 0;
    if (hopStart >= 0) {
      var ts = Math.min(1, (nowMs - hopStart) / 480);
      currentLane = hopFrom + (targetLane - hopFrom) * (ts * ts * (3 - 2 * ts));
      hopHeight = reduceMotion ? 0 : Math.sin(ts * Math.PI) * 0.35;
      if (ts >= 1) hopStart = -1;
    } else currentLane = targetLane;
    capybaraSprite.position.set(x, 0.045 + hopHeight + (walking && !reduceMotion ? Math.abs(Math.sin(nowMs / 70)) * 0.015 : 0), laneToZ(currentLane));
  }

  return { update };
}
