/**
 * Ram editz — Background layers (tuned for smooth performance)
 */
(function () {
  'use strict';

  var mount = document.querySelector('.bg-effects');
  if (!mount || mount.dataset.bgEnhanced) return;
  mount.dataset.bgEnhanced = '1';

  var isLite = document.documentElement.classList.contains('perf-lite');
  var particleCount = isLite ? 0 : 8;
  var particles = '';

  for (var i = 0; i < particleCount; i++) {
    var size = 1 + Math.random() * 2;
    var left = Math.random() * 100;
    var duration = 22 + Math.random() * 18;
    var delay = Math.random() * duration;
    var drift = (Math.random() - 0.5) * 60;
    var opacity = 0.12 + Math.random() * 0.25;
    particles +=
      '<span class="bg-particle" style="' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + left + '%;' +
        'bottom:-' + (Math.random() * 10) + '%;' +
        'animation-duration:' + duration + 's;' +
        'animation-delay:-' + delay + 's;' +
        '--particle-drift:' + drift + 'px;' +
        '--particle-opacity:' + opacity + ';' +
      '"></span>';
  }

  var extras =
    '<div class="bg-mesh">' +
      '<div class="bg-mesh-blob bg-mesh-blob-1"></div>' +
      '<div class="bg-mesh-blob bg-mesh-blob-2"></div>' +
      '<div class="bg-mesh-blob bg-mesh-blob-3"></div>' +
    '</div>' +
    '<div class="bg-aurora"></div>' +
    '<div class="bg-grid"></div>';

  if (!isLite) {
    extras +=
      '<div class="bg-light-leak bg-light-leak-1"></div>' +
      '<div class="bg-light-leak bg-light-leak-2"></div>';
  }

  if (particles) {
    extras += '<div class="bg-particles">' + particles + '</div>';
  }

  mount.insertAdjacentHTML('afterbegin', extras);

  if (!isLite) {
    mount.insertAdjacentHTML('beforeend',
      '<div class="bokeh bokeh-6"></div>' +
      '<div class="bokeh bokeh-7"></div>'
    );
  }
})();
