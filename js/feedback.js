/**
 * Ram editz — UI sounds & haptic feedback
 * Web Audio API + Vibration API + visual tap pulse (iOS fallback)
 */
(function () {
  'use strict';

  var SOUND_KEY = 'ram-editz-feedback-muted';
  var HAPTIC_KEY = 'ram-editz-haptics-muted';
  var MASTER_VOLUME = 2.5;
  var ctx = null;
  var unlocked = false;
  var soundMuted = localStorage.getItem(SOUND_KEY) === '1';
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var canVibrate = typeof navigator.vibrate === 'function';
  var hapticsMuted = localStorage.getItem(HAPTIC_KEY) === '1';
  if (localStorage.getItem(HAPTIC_KEY) === null && !isTouch) {
    hapticsMuted = true;
  }
  var sliderTickTimer = null;
  var typeTimer = null;
  var scrollTickTimer = null;
  var revealCount = 0;
  var lastScrollSound = 0;
  var lastHapticAt = 0;

  var HAPTIC = {
    light: [12],
    medium: [28, 10, 28],
    heavy: [45, 15, 55],
    menuOpen: [40, 12, 55, 12, 75, 18, 95],
    menuClose: [55, 20, 40],
    nav: [32, 10, 32],
    play: [30, 8, 50, 8, 70],
    success: [45, 25, 45, 25, 80],
    error: [70, 35, 70],
    filter: [24, 8, 34],
    slider: [12],
    reveal: [10, 6, 10],
    focus: [8],
    selection: [18, 6, 22]
  };

  var SOUND_HAPTIC = {
    click: 'medium',
    softClick: 'light',
    menuOpen: 'menuOpen',
    menuClose: 'menuClose',
    nav: 'nav',
    play: 'play',
    modalClose: 'menuClose',
    success: 'success',
    error: 'error',
    filter: 'filter',
    slider: 'slider',
    focus: 'focus',
    select: 'selection',
    pageLoad: 'light',
    reveal: 'reveal',
    logo: 'medium',
    footer: 'light'
  };

  function initContext() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }

  function unlock() {
    if (unlocked) return;
    var c = initContext();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    unlocked = true;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isSoundMuted() {
    return soundMuted || prefersReducedMotion();
  }

  function isHapticDisabled() {
    return hapticsMuted || prefersReducedMotion();
  }

  function hapticPattern(name) {
    if (typeof name === 'number' || Array.isArray(name)) return name;
    return HAPTIC[name] || HAPTIC.light;
  }

  function vibrate(pattern) {
    if (isHapticDisabled()) return;
    if (!canVibrate) return;
    var now = Date.now();
    if (now - lastHapticAt < 24) return;
    lastHapticAt = now;
    try { navigator.vibrate(hapticPattern(pattern)); } catch (e) { /* unsupported */ }
  }

  function visualPulse(el) {
    if (isHapticDisabled() || !el || !el.classList) return;
    el.classList.remove('haptic-pulse');
    void el.offsetWidth;
    el.classList.add('haptic-pulse');
    el.addEventListener('animationend', function onEnd() {
      el.classList.remove('haptic-pulse');
      el.removeEventListener('animationend', onEnd);
    });
  }

  function triggerHaptic(name, el) {
    vibrate(SOUND_HAPTIC[name] || name);
    if (el) visualPulse(el);
  }

  function haptic(name, el) {
    triggerHaptic(name, el);
  }

  function vol(v, fallback) {
    return (v != null ? v : fallback) * MASTER_VOLUME;
  }

  function tone(freq, duration, type, volume, delay) {
    if (isSoundMuted() || !ctx) return;
    var t0 = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(vol(volume, 0.08), 0.0001), t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function chord(freqs, duration, type, volume, spacing) {
    freqs.forEach(function (f, i) {
      tone(f, duration, type, (volume || 0.05) / freqs.length, i * (spacing || 0.04));
    });
  }

  function noiseBurst(duration, volume, delay, freq) {
    if (isSoundMuted() || !ctx) return;
    var t0 = ctx.currentTime + (delay || 0);
    var bufferSize = ctx.sampleRate * duration;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq || 800;
    filter.Q.value = 0.6;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(vol(volume, 0.06), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + duration);
  }

  function sweep(startFreq, endFreq, duration, volume, type) {
    if (isSoundMuted() || !ctx) return;
    var t0 = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sawtooth';
    osc.frequency.setValueAtTime(Math.max(startFreq, 1), t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t0 + duration);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol(volume, 0.04), t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  var SOUNDS = {
    click: function () {
      tone(180, 0.06, 'triangle', 0.12);
      tone(520, 0.04, 'sine', 0.05, 0.01);
      noiseBurst(0.03, 0.015, 0, 1200);
      vibrate('medium');
    },
    softClick: function () {
      tone(420, 0.04, 'sine', 0.05);
      tone(660, 0.03, 'triangle', 0.03, 0.02);
      vibrate('light');
    },
    menuOpen: function () {
      sweep(120, 680, 0.35, 0.05);
      noiseBurst(0.12, 0.035, 0.08);
      tone(220, 0.2, 'sine', 0.04, 0.1);
      tone(330, 0.15, 'triangle', 0.03, 0.15);
      vibrate('menuOpen');
    },
    menuClose: function () {
      sweep(520, 90, 0.22, 0.04);
      tone(140, 0.1, 'triangle', 0.06);
      noiseBurst(0.06, 0.02);
      vibrate('menuClose');
    },
    nav: function () {
      tone(320, 0.05, 'square', 0.04);
      tone(640, 0.07, 'sine', 0.06, 0.02);
      noiseBurst(0.04, 0.02);
      vibrate('nav');
    },
    play: function () {
      tone(110, 0.15, 'sawtooth', 0.05);
      tone(440, 0.2, 'sine', 0.07, 0.05);
      sweep(200, 900, 0.25, 0.03);
      noiseBurst(0.08, 0.025, 0.05, 400);
      vibrate('play');
    },
    modalClose: function () {
      sweep(380, 100, 0.2, 0.035);
      tone(180, 0.12, 'triangle', 0.05);
      vibrate('menuClose');
    },
    success: function () {
      tone(523, 0.12, 'sine', 0.08);
      tone(659, 0.12, 'sine', 0.08, 0.1);
      tone(784, 0.18, 'sine', 0.09, 0.2);
      tone(1047, 0.22, 'sine', 0.07, 0.32);
      vibrate('success');
    },
    error: function () {
      tone(220, 0.15, 'sawtooth', 0.06);
      tone(185, 0.2, 'square', 0.05, 0.08);
      vibrate('error');
    },
    filter: function () {
      tone(400, 0.06, 'triangle', 0.07);
      tone(600, 0.05, 'sine', 0.05, 0.03);
      tone(800, 0.04, 'sine', 0.04, 0.06);
      vibrate('filter');
    },
    slider: function () {
      tone(280 + Math.random() * 80, 0.03, 'sine', 0.04);
      vibrate('slider');
    },
    hover: function () {
      tone(880, 0.025, 'sine', 0.015);
    },
    cardHover: function () {
      tone(520, 0.03, 'sine', 0.02);
      tone(780, 0.025, 'triangle', 0.015, 0.015);
    },
    focus: function () {
      tone(600, 0.05, 'sine', 0.035);
      tone(900, 0.04, 'triangle', 0.02, 0.02);
      vibrate('focus');
    },
    type: function () {
      tone(900 + Math.random() * 200, 0.015, 'square', 0.012);
    },
    select: function () {
      tone(350, 0.05, 'triangle', 0.05);
      tone(500, 0.06, 'sine', 0.04, 0.03);
      vibrate('selection');
    },
    pageLoad: function () {
      sweep(90, 320, 0.4, 0.035);
      chord([196, 247, 294], 0.35, 'sine', 0.05, 0.08);
      noiseBurst(0.15, 0.02, 0.2, 500);
      vibrate('light');
    },
    reveal: function () {
      var n = revealCount % 5;
      tone(300 + n * 40, 0.06, 'sine', 0.025);
      tone(450 + n * 30, 0.05, 'triangle', 0.018, 0.025);
      revealCount++;
      vibrate('reveal');
    },
    counter: function () {
      tone(440, 0.08, 'sine', 0.04);
      tone(554, 0.1, 'sine', 0.035, 0.06);
      sweep(300, 600, 0.15, 0.02);
    },
    scroll: function () {
      tone(200, 0.05, 'sine', 0.022);
      noiseBurst(0.025, 0.014, 0, 2000);
    },
    marquee: function () {
      tone(660, 0.03, 'sine', 0.02);
      tone(990, 0.025, 'triangle', 0.015, 0.015);
    },
    muteOn: function () {
      tone(300, 0.08, 'triangle', 0.04);
      sweep(400, 120, 0.15, 0.03);
    },
    muteOff: function () {
      sweep(120, 500, 0.2, 0.04);
      tone(523, 0.1, 'sine', 0.05, 0.05);
    },
    logo: function () {
      chord([262, 330, 392], 0.2, 'sine', 0.06, 0.05);
      noiseBurst(0.04, 0.015);
      vibrate('medium');
    },
    footer: function () {
      tone(380, 0.04, 'sine', 0.03);
      vibrate('light');
    },
    service: function () {
      sweep(250, 550, 0.18, 0.03);
      tone(440, 0.1, 'sine', 0.04, 0.05);
    },
    testimonial: function () {
      tone(494, 0.08, 'sine', 0.03);
      tone(587, 0.1, 'sine', 0.025, 0.06);
    }
  };

  function play(name, force) {
    unlock();
    var hapticName = SOUND_HAPTIC[name];
    if (!force && isSoundMuted()) {
      if (hapticName) triggerHaptic(hapticName);
      return;
    }
    if (!SOUNDS[name]) return;
    var wasSoundMuted = soundMuted;
    if (force) soundMuted = false;
    try { SOUNDS[name](); } catch (e) { /* audio blocked */ }
    if (force) soundMuted = wasSoundMuted;
  }

  function toggleSound() {
    unlock();
    var wasSoundMuted = soundMuted;
    soundMuted = !soundMuted;
    localStorage.setItem(SOUND_KEY, soundMuted ? '1' : '0');
    updateToggleUI();
    if (wasSoundMuted) {
      play('muteOff', true);
    } else {
      play('muteOn', true);
      if (!isHapticDisabled()) vibrate('light');
    }
    return soundMuted;
  }

  function toggleHaptics() {
    hapticsMuted = !hapticsMuted;
    localStorage.setItem(HAPTIC_KEY, hapticsMuted ? '1' : '0');
    updateToggleUI();
    if (!hapticsMuted) vibrate('selection');
    return hapticsMuted;
  }

  function injectToggle() {
    var header = document.querySelector('.header');
    if (!header || document.getElementById('feedbackToggle')) return;

    var btn = document.createElement('button');
    btn.id = 'feedbackToggle';
    btn.className = 'feedback-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle sound. Long-press to toggle haptics.');
    btn.title = 'Tap: sound · Hold: haptics';
    btn.innerHTML =
      '<svg class="feedback-icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>' +
        '<path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/>' +
      '</svg>' +
      '<svg class="feedback-icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>' +
        '<line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>' +
      '</svg>' +
      '<span class="feedback-haptic-dot" aria-hidden="true"></span>';

    var menuBtn = document.getElementById('menuBtn');
    if (menuBtn) header.insertBefore(btn, menuBtn);
    else header.appendChild(btn);

    var pressTimer = null;
    var longPress = false;

    btn.addEventListener('pointerdown', function () {
      longPress = false;
      clearTimeout(pressTimer);
      pressTimer = setTimeout(function () {
        longPress = true;
        toggleHaptics();
        showToast(hapticsMuted ? 'Haptics off' : 'Haptics on');
      }, 520);
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (evt) {
      btn.addEventListener(evt, function () { clearTimeout(pressTimer); });
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (longPress) {
        longPress = false;
        return;
      }
      toggleSound();
    });

    updateToggleUI();
  }

  function updateToggleUI() {
    var btn = document.getElementById('feedbackToggle');
    if (!btn) return;
    btn.classList.toggle('muted', soundMuted);
    btn.classList.toggle('haptics-off', hapticsMuted);
    btn.setAttribute('aria-pressed', soundMuted ? 'true' : 'false');
    document.documentElement.classList.toggle('haptics-on', !isHapticDisabled());
  }

  function bindScrollSounds() {
    window.addEventListener('scroll', function () {
      if (isSoundMuted()) return;
      var now = Date.now();
      if (now - lastScrollSound < 600) return;
      if (window.scrollY < 80) return;
      lastScrollSound = now;
      clearTimeout(scrollTickTimer);
      scrollTickTimer = setTimeout(function () { play('scroll'); }, 80);
    }, { passive: true });
  }

  function bindRevealSounds() {
    if (!('IntersectionObserver' in window)) return;
    var revealSoundObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          play('reveal');
          revealSoundObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('.section-header, .stat-card, .testimonial-card, .service-card, .process-step, .cta-band').forEach(function (el) {
      revealSoundObserver.observe(el);
    });
  }

  function bindCounterSounds() {
    if (!('IntersectionObserver' in window)) return;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          play('counter');
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function showToast(message) {
    var existing = document.getElementById('hapticToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'hapticToast';
    toast.className = 'site-toast haptic-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('visible'); });
    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 1800);
  }

  function resolveClickSound(el) {
    if (el.classList.contains('logo')) return 'logo';
    if (el.classList.contains('nav-link')) return 'nav';
    if (el.classList.contains('home-back-btn')) return 'nav';
    if (el.classList.contains('marquee-item')) return 'marquee';
    if (el.closest('.footer-col')) return 'footer';
    if (el.classList.contains('service-card') || el.closest('.service-card')) return 'service';
    if (el.classList.contains('testimonial-card') || el.closest('.testimonial-card')) return 'testimonial';
    if (el.closest('.video-thumb') || el.closest('.featured-reel') || el.closest('.hero-reel') || el.classList.contains('play-btn')) return 'play';
    if (el.classList.contains('filter-btn')) return 'filter';
    if (el.classList.contains('btn-submit')) return null;
    if (el.classList.contains('btn-primary') || el.classList.contains('btn-service') || el.classList.contains('btn-outline')) return 'click';
    if (el.tagName === 'A') return 'nav';
    return 'softClick';
  }

  function bindTouchHaptics() {
    var selector =
      'a.btn, button.btn, .filter-btn, .video-thumb, .featured-reel, .hero-reel, .featured-card, ' +
      '.play-btn, .header-cta, .nav-link, .logo, .home-back-btn, .marquee-item, .menu-btn, .nav-close, ' +
      '.service-card, .testimonial-card, .stat-card, .feedback-toggle';

    document.addEventListener('pointerdown', function (e) {
      if (isHapticDisabled()) return;
      var el = e.target.closest(selector);
      if (!el) return;
      visualPulse(el);
      if (!isTouch) return;
      if (el.id === 'menuBtn') { vibrate('menuOpen'); return; }
      if (el.id === 'navClose') { vibrate('menuClose'); return; }
    }, { passive: true });
  }

  function bindGlobal() {
    document.addEventListener('pointerdown', unlock, { passive: true });
    bindTouchHaptics();

    document.addEventListener('click', function (e) {
      var el = e.target.closest(
        'a.btn, button.btn, .filter-btn, .video-thumb, .featured-reel, .hero-reel, .featured-card, ' +
        '.play-btn, .header-cta, .nav-link, .logo, .home-back-btn, .marquee-item, .footer-col a, ' +
        '.service-card, .testimonial-card, .stat-card, .feedback-toggle'
      );
      if (!el) return;
      if (el.id === 'menuBtn' || el.id === 'navClose') return;
      var name = resolveClickSound(el);
      if (name) play(name);
    });

    document.addEventListener('focusin', function (e) {
      var el = e.target;
      if (el.matches('input, textarea, select')) play('focus');
    });

    document.addEventListener('input', function (e) {
      if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
        clearTimeout(typeTimer);
        typeTimer = setTimeout(function () { play('type'); }, 60);
      }
    });

    document.addEventListener('change', function (e) {
      if (e.target.matches('select')) play('select');
    });

    var budget = document.getElementById('budget');
    if (budget) {
      budget.addEventListener('input', function () {
        clearTimeout(sliderTickTimer);
        sliderTickTimer = setTimeout(function () { play('slider'); }, 40);
      });
    }

    if (!window.matchMedia('(hover: none)').matches) {
      var hoverSelector = '.btn, .nav-link, .filter-btn, .menu-btn, .home-back-btn, .hero-reel, .featured-card, .service-card, .testimonial-card, .stat-card, .marquee-item, .video-thumb, .footer-col a';
      document.querySelectorAll(hoverSelector).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (isSoundMuted()) return;
          if (el.classList.contains('featured-card') || el.classList.contains('service-card') ||
              el.classList.contains('testimonial-card') || el.classList.contains('stat-card')) {
            play('cardHover');
          } else if (el.classList.contains('marquee-item')) {
            play('marquee');
          } else {
            play('hover');
          }
        });
      });
    }

    window.addEventListener('rameditz:page-loaded', function () { play('pageLoad'); });
  }

  window.RamEditzFeedback = {
    play: play,
    haptic: haptic,
    vibrate: vibrate,
    toggleHaptics: toggleHaptics,
    isHapticEnabled: function () { return !isHapticDisabled(); },
    isSoundMuted: isSoundMuted
  };

  function init() {
    document.documentElement.classList.toggle('haptics-on', !isHapticDisabled());
    document.documentElement.classList.toggle('touch-device', isTouch);
    injectToggle();
    bindGlobal();
    bindScrollSounds();
    bindRevealSounds();
    bindCounterSounds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
