// Pixel-art background drawn on <canvas>: a dithered banded sky,
// clouds, far hills and near hills. Each layer becomes a background
// image of the element and moves at its own speed (parallax).
export function applyPixelBackground(sticky) {
  // Palettes and layer drawing
  var PALETTES = {
    light: { sky: ['#CFDCF2', '#D9E3F5', '#E2E9F4', '#E8EDF1'], cloud: '#F8FAFD', cloudShadow: '#E3EAF4', far: '#CDD8EA', near: '#BCCAE0', ridge: '#D7E0EF' },
    dark: { sky: ['#0C131E', '#0F1823', '#121B26', '#121A23'], cloud: '#223047', cloudShadow: '#1A2638', far: '#162236', near: '#1B2A41', ridge: '#26385A', star: '#5D7196' }
  };
  function pixelArt(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); draw(g, w, h); return c.toDataURL('image/png');
  }
  function pixelCloud(g, x, y, e, palette) {
    [[0, 4, 22, 5], [4, 1, 8, 4], [11, 0, 7, 5], [17, 2, 6, 3]].forEach(function (b) {
      g.fillStyle = palette.cloud; g.fillRect(Math.round(x + b[0] * e), Math.round(y + b[1] * e), Math.round(b[2] * e), Math.round(b[3] * e));
    });
    g.fillStyle = palette.cloudShadow; g.fillRect(Math.round(x + e), Math.round(y + 8 * e), Math.round(20 * e), Math.max(1, Math.round(e)));
  }
  function skyLayer(palette) {
    return pixelArt(240, 135, function (g, w, h) {
      var n = palette.sky.length, dither = [[0.125, 0.625], [0.875, 0.375]];
      for (var y = 0; y < h; y++) {
        var f = y / h * (n - 1), i = Math.floor(f), fr = f - i;
        for (var x = 0; x < w; x++) { var useNext = fr < 0.4 ? false : fr > 0.6 ? true : dither[y % 2][x % 2] < 0.5; g.fillStyle = useNext ? palette.sky[Math.min(i + 1, n - 1)] : palette.sky[i]; g.fillRect(x, y, 1, 1); }
      }
      if (palette.star) { var seed = 7; g.fillStyle = palette.star; for (var k = 0; k < 46; k++) { seed = (seed * 9301 + 49297) % 233280; var sx = seed % w; seed = (seed * 9301 + 49297) % 233280; g.fillRect(sx, seed % Math.floor(h * 0.55), 1, 1); } }
      [[18, 20, 1], [92, 12, 0.8], [150, 28, 1.15], [206, 10, 0.7]].forEach(function (c) { pixelCloud(g, c[0], c[1], c[2], palette); });
    });
  }
  function hillLayer(palette, cssVar, base, waves) {
    return pixelArt(240, 135, function (g, w, h) {
      for (var x = 0; x < w; x++) {
        var a = h * base;
        waves.forEach(function (o) { a += o[0] * Math.sin(2 * Math.PI * x / w * o[1] + o[2]); });
        a = Math.round(a / 2) * 2;
        g.fillStyle = palette.ridge; g.fillRect(x, a, 1, 1);
        g.fillStyle = cssVar; g.fillRect(x, a + 1, 1, h - a);
      }
    });
  }
  var backgroundTile = 0;
  function buildBackground() {
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.getAttribute('data-theme') !== 'light';
    if (document.documentElement.getAttribute('data-theme') === 'dark') dark = true;
    var palette = dark ? PALETTES.dark : PALETTES.light;
    var near = hillLayer(palette, palette.near, 0.8, [[6, 3, 2], [3, 7, 0.5]]);
    var far = hillLayer(palette, palette.far, 0.64, [[8, 2, 0], [5, 5, 1]]);
    sticky.style.backgroundImage = 'url(' + near + '), url(' + far + '), url(' + skyLayer(palette) + ')';
    sticky.style.backgroundRepeat = 'repeat-x';
    sticky.style.backgroundSize = 'auto 100%';
    sticky.style.imageRendering = 'pixelated';
  }

  buildBackground();
  document.addEventListener('themechange', buildBackground);

  // p goes from 0 to 1 along the timeline
  function parallax(p) {
    const tileWidth = sticky.clientHeight * 240 / 135;
    sticky.style.backgroundPosition =
      `${-p * tileWidth * 1.3}px bottom, ${-p * tileWidth * 0.6}px bottom, ${-p * tileWidth * 0.2}px top`;
  }

  return { parallax };
}
