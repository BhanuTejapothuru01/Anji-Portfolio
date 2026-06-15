/**
 * Ram editz — Premium page loader
 */
(function () {
  'use strict';

  var loader = document.getElementById('pageLoader');
  if (!loader || loader.dataset.loaderBuilt) return;

  if (sessionStorage.getItem('ram-editz-visited') === '1') {
    loader.classList.add('hidden');
    document.body.classList.remove('is-loading');
    loader.dataset.loaderBuilt = '1';
    requestAnimationFrame(function () {
      window.dispatchEvent(new CustomEvent('rameditz:loader-complete'));
    });
    return;
  }

  loader.dataset.loaderBuilt = '1';

  var config = window.RAM_EDITZ_CONFIG || {};
  var tagline = config.tagline || 'We Make Brands Move';
  var siteLine1 = config.logoLine1 || 'Ram';
  var siteLine2 = config.logoLine2 || 'editz';

  var frames = '';
  for (var i = 0; i < 16; i++) {
    frames += '<div class="loader-film-frame"></div>';
  }

  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', 'Loading page');
  document.body.classList.add('is-loading');

  loader.innerHTML =
    '<div class="loader-backdrop">' +
      '<div class="loader-glow loader-glow-1"></div>' +
      '<div class="loader-glow loader-glow-2"></div>' +
      '<div class="loader-scanline"></div>' +
    '</div>' +
    '<span class="loader-corner loader-corner-tl"></span>' +
    '<span class="loader-corner loader-corner-br"></span>' +
    '<div class="loader-inner">' +
      '<div class="loader-film-track">' +
        '<div class="loader-film-strip">' + frames + frames + '</div>' +
      '</div>' +
      '<div class="loader-reel-wrap">' +
        '<svg class="loader-reel-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<radialGradient id="loaderMetal" cx="35%" cy="30%" r="65%">' +
              '<stop offset="0%" stop-color="#b0b0b8"/>' +
              '<stop offset="50%" stop-color="#505058"/>' +
              '<stop offset="100%" stop-color="#282830"/>' +
            '</radialGradient>' +
            '<radialGradient id="loaderRim" cx="30%" cy="25%" r="50%">' +
              '<stop offset="0%" stop-color="#fff" stop-opacity="0.3"/>' +
              '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>' +
            '</radialGradient>' +
          '</defs>' +
          '<circle cx="60" cy="60" r="54" fill="#222228" stroke="#1a1a20" stroke-width="1"/>' +
          '<g class="loader-reel-spin">' +
            '<circle cx="60" cy="60" r="54" fill="url(#loaderMetal)"/>' +
            '<circle cx="60" cy="60" r="54" fill="url(#loaderRim)"/>' +
            '<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>' +
            '<circle cx="60" cy="60" r="46" fill="none" stroke="#0a0a0e" stroke-width="4"/>' +
            '<circle cx="60" cy="60" r="38" fill="#101014" stroke="#0c0c10" stroke-width="1"/>' +
            '<circle cx="60" cy="60" r="30" fill="none" stroke="#08080c" stroke-width="3"/>' +
            '<circle cx="60" cy="60" r="22" fill="#0e0e12"/>' +
            '<circle cx="60" cy="60" r="18" fill="#353540" stroke="#252530" stroke-width="1"/>' +
            '<g stroke="#888890" stroke-width="2.5" stroke-linecap="round">' +
              '<line x1="60" y1="60" x2="60" y2="44"/>' +
              '<line x1="60" y1="60" x2="72" y2="52"/>' +
              '<line x1="60" y1="60" x2="68" y2="72"/>' +
              '<line x1="60" y1="60" x2="52" y2="72"/>' +
              '<line x1="60" y1="60" x2="48" y2="52"/>' +
            '</g>' +
            '<circle cx="60" cy="60" r="8" fill="#0a0a0e" stroke="#404048" stroke-width="1"/>' +
            '<circle cx="57" cy="57" r="3" fill="rgba(255,255,255,0.2)"/>' +
          '</g>' +
        '</svg>' +
      '</div>' +
      '<div class="loader-brand">' +
        '<span class="loader-brand-line">' + siteLine1 + '</span>' +
        '<span class="loader-brand-line loader-brand-accent">' + siteLine2 + '</span>' +
      '</div>' +
      '<p class="loader-tagline">' + tagline + '</p>' +
      '<div class="loader-progress-wrap">' +
        '<div class="loader-progress">' +
          '<div class="loader-progress-bar" id="loaderBar"></div>' +
        '</div>' +
        '<div class="loader-meta">' +
          '<span class="loader-percent" id="loaderPercent">0%</span>' +
          '<span class="loader-status" id="loaderStatus">Rolling film</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  var bar = document.getElementById('loaderBar');
  var percentEl = document.getElementById('loaderPercent');
  var statusEl = document.getElementById('loaderStatus');
  var progress = 0;
  var statusIndex = 0;
  var statuses = [
    'Rolling film',
    'Loading frames',
    'Color grading',
    'Syncing audio',
    'Preparing showreel'
  ];

  function setProgress(value) {
    progress = Math.min(Math.max(value, 0), 100);
    if (bar) bar.style.width = progress + '%';
    if (percentEl) percentEl.textContent = Math.round(progress) + '%';
  }

  function cycleStatus() {
    if (!statusEl) return;
    statusEl.classList.add('is-changing');
    setTimeout(function () {
      statusIndex = (statusIndex + 1) % statuses.length;
      statusEl.textContent = statuses[statusIndex];
      statusEl.classList.remove('is-changing');
    }, 200);
  }

  var interval = setInterval(function () {
    if (progress >= 92) return;
    setProgress(progress + 4 + Math.random() * 10);
    if (Math.random() > 0.55) cycleStatus();
  }, 140);

  var statusInterval = setInterval(cycleStatus, 1800);

  window.addEventListener('DOMContentLoaded', function () {
    clearInterval(interval);
    clearInterval(statusInterval);
    setProgress(100);
    if (statusEl) statusEl.textContent = 'Ready';
    window.dispatchEvent(new CustomEvent('rameditz:loader-complete'));
  });
})();
