/**
 * Ram editz — Lightweight mouse parallax (mesh + corners only)
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.classList.contains('perf-lite')) return;

  var pointer = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
  var running = true;
  var layers = [];

  function registerLayers() {
    var specs = [
      { sel: '.bg-mesh-blob-1', px: 36, py: 26, depth: 0.22 },
      { sel: '.bg-mesh-blob-2', px: -32, py: -24, depth: 0.2 },
      { sel: '.bg-mesh-blob-3', px: 22, py: 18, depth: 0.16 },
      { sel: '.glass-corner-tl', px: 10, py: 8, depth: 0.3 },
      { sel: '.glass-corner-br', px: -10, py: -8, depth: 0.3 }
    ];

    specs.forEach(function (spec) {
      document.querySelectorAll(spec.sel).forEach(function (el) {
        layers.push({
          el: el,
          px: spec.px,
          py: spec.py,
          depth: spec.depth
        });
      });
    });

    if (layers.length) {
      document.body.classList.add('motion-active');
    }
  }

  function tick() {
    if (!running) return;

    pointer.sx += (pointer.x - pointer.sx) * 0.07;
    pointer.sy += (pointer.y - pointer.sy) * 0.07;

    var mx = (pointer.sx - 0.5) * 2;
    var my = (pointer.sy - 0.5) * 2;

    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var dx = mx * layer.px * layer.depth;
      var dy = my * layer.py * layer.depth;
      layer.el.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
    }

    requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', function (e) {
    pointer.x = e.clientX / window.innerWidth;
    pointer.y = e.clientY / window.innerHeight;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  registerLayers();
  if (layers.length) requestAnimationFrame(tick);
})();
