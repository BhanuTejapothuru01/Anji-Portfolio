(function () {
  'use strict';

  var config = window.RAM_EDITZ_CONFIG || {};
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function applySiteBranding() {
    var headerLines = document.querySelectorAll('.header .logo .logo-line');
    if (headerLines[0]) headerLines[0].textContent = config.logoLine1 || 'Ram';
    if (headerLines[1]) headerLines[1].textContent = config.logoLine2 || 'editz';

    var navFooter = document.querySelector('.nav-footer');
    if (navFooter && config.socials) {
      navFooter.innerHTML =
        '<p><strong>SOCIALS</strong> ' +
          '<a href="' + (config.socials.instagram || '#') + '" target="_blank" rel="noopener">' + escapeHtml(config.instagramLabel || 'Checkout our insta page') + '</a>, ' +
          '<a href="' + (config.getWhatsAppLink ? config.getWhatsAppLink() : (config.socials.whatsapp || '#')) + '" target="_blank" rel="noopener">WhatsApp</a>, ' +
          '<a href="mailto:' + (config.email || '') + '">Email</a>' +
        '</p>' +
        '<p><strong>LOCATION</strong> ' + escapeHtml(config.location || 'Madanapalle') + '</p>';
    }
  }

  document.body.classList.add('page-enter');
  applySiteBranding();

  /* ---- Film strip cursor (desktop) ---- */
  function initFilmCursor() {
    if (isTouch) return;

    var film = document.createElement('div');
    film.className = 'cursor-film';
    film.id = 'cursorFilm';
    film.setAttribute('aria-hidden', 'true');
    film.innerHTML =
      '<div class="cursor-film-glow" aria-hidden="true"></div>' +
      '<div class="cursor-film-trail cursor-film-trail-1" aria-hidden="true"></div>' +
      '<div class="cursor-film-trail cursor-film-trail-2" aria-hidden="true"></div>' +
      '<div class="cursor-film-strip">' +
        '<span class="cursor-film-rec" aria-hidden="true"><span class="cursor-film-rec-dot"></span>REC</span>' +
        '<div class="cursor-film-perfs cursor-film-perfs-top"></div>' +
        '<div class="cursor-film-frame">' +
          '<span class="cursor-film-scanline" aria-hidden="true"></span>' +
          '<span class="cursor-film-timecode" aria-hidden="true">00:00:00</span>' +
          '<span class="cursor-film-play" aria-hidden="true"></span>' +
          '<span class="cursor-film-shimmer" aria-hidden="true"></span>' +
          '<span class="cursor-film-grain" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="cursor-film-perfs cursor-film-perfs-bottom cursor-film-perfs-reverse"></div>' +
      '</div>' +
      '<span class="cursor-film-click-burst" aria-hidden="true"></span>';
    document.body.appendChild(film);

    var timecodeEl = film.querySelector('.cursor-film-timecode');
    var trail1 = film.querySelector('.cursor-film-trail-1');
    var trail2 = film.querySelector('.cursor-film-trail-2');
    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var fx = mx;
    var fy = my;
    var t1x = mx, t1y = my, t2x = mx, t2y = my;
    var prevX = mx;
    var prevY = my;
    var angle = -12;
    var active = false;
    var rafId = 0;
    var idleTimer = null;
    var clickTimer = null;
    var tcStart = Date.now();
    var frameCount = 0;

    function isInteractive(el) {
      return el && el.closest(
        'a, button, [role="button"], input, textarea, select, label, ' +
        '.video-thumb, .featured-card, .hero-reel, .nav-link, .home-back-btn, .menu-btn'
      );
    }

    function canShow() {
      return !document.body.classList.contains('is-loading') && !document.hidden;
    }

    function activate() {
      if (!canShow()) return;
      active = true;
      document.body.classList.add('cursor-ready');
      film.classList.add('is-visible');
    }

    function deactivate() {
      active = false;
      document.body.classList.remove('cursor-ready');
      film.classList.remove('is-visible', 'hover', 'is-idle', 'is-clicking', 'is-moving');
      clearTimeout(idleTimer);
      clearTimeout(clickTimer);
      cancelAnimationFrame(rafId);
    }

    function resetIdle() {
      film.classList.remove('is-idle');
      film.classList.add('is-moving');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        film.classList.remove('is-moving');
        film.classList.add('is-idle');
      }, 650);
    }

    function updateTimecode() {
      if (!timecodeEl) return;
      var elapsed = Math.floor((Date.now() - tcStart) / 1000);
      var h = String(Math.floor(elapsed / 3600) % 24).padStart(2, '0');
      var m = String(Math.floor(elapsed / 60) % 60).padStart(2, '0');
      var s = String(elapsed % 60).padStart(2, '0');
      timecodeEl.textContent = h + ':' + m + ':' + s;
    }

    function tick() {
      if (!active) return;
      fx += (mx - fx) * 0.2;
      fy += (my - fy) * 0.2;
      t1x += (fx - t1x) * 0.14;
      t1y += (fy - t1y) * 0.14;
      t2x += (t1x - t2x) * 0.14;
      t2y += (t1y - t2y) * 0.14;

      film.style.transform =
        'translate3d(' + fx + 'px,' + fy + 'px,0) translate(-50%,-50%) rotate(' + angle + 'deg)';

      if (trail1) {
        trail1.style.transform = 'translate(' + (t1x - fx) + 'px,' + (t1y - fy) + 'px)';
      }
      if (trail2) {
        trail2.style.transform = 'translate(' + (t2x - fx) + 'px,' + (t2y - fy) + 'px)';
      }

      frameCount += 1;
      if (frameCount % 30 === 0) updateTimecode();

      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      var dx = mx - prevX;
      var dy = my - prevY;
      var speed = Math.sqrt(dx * dx + dy * dy);

      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      prevX = mx;
      prevY = my;

      if (!canShow()) return;

      if (!active) {
        fx = mx;
        fy = my;
        t1x = mx;
        t1y = my;
        t2x = mx;
        t2y = my;
        tcStart = Date.now();
        activate();
        tick();
      }

      resetIdle();
      film.style.setProperty('--film-speed', Math.min(2.2, 0.65 + speed * 0.07).toFixed(2));
      film.style.setProperty('--film-wobble', Math.min(6, speed * 0.35).toFixed(2) + 'deg');
      film.classList.toggle('hover', !!isInteractive(e.target));
    }, { passive: true });

    document.addEventListener('mousedown', function () {
      if (!active) return;
      film.classList.add('is-clicking');
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () {
        film.classList.remove('is-clicking');
      }, 420);
    });

    document.documentElement.addEventListener('mouseleave', deactivate);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) deactivate();
    });
  }

  initFilmCursor();

  /* ---- Animated counters ---- */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(start + (target - start) * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(step);
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  /* ---- Build marquee ---- */
  function buildMarquee() {
    var mount = document.getElementById('marqueeMount');
    var items_list = config.marqueeServices;
    if (!mount || !items_list) return;

    var items = items_list.map(function (name) {
      return '<span class="marquee-item">' + name + '</span><span class="marquee-divider"></span>';
    }).join('');

    mount.innerHTML =
      '<div class="marquee-track">' +
        '<div class="marquee-content">' + items + '</div>' +
        '<div class="marquee-content" aria-hidden="true">' + items + '</div>' +
      '</div>';
  }

  /* ---- Build stats ---- */
  function buildStats() {
    var mount = document.getElementById('statsMount');
    if (!mount || !config.stats) return;

    mount.innerHTML = config.stats.map(function (stat) {
      return (
        '<div class="stat-card reveal tilt-card">' +
          '<div class="stat-value" data-count="' + stat.value + '" data-suffix="' + stat.suffix + '">0</div>' +
          '<div class="stat-label">' + stat.label + '</div>' +
        '</div>'
      );
    }).join('');

    if (window.revealObserve) {
      mount.querySelectorAll('.reveal').forEach(window.revealObserve);
    }
    animateCounters();
  }

  /* ---- Build hero extras (home page) ---- */
  function buildHeroSection() {
    var tagsMount = document.getElementById('heroTagsMount');
    var statsMount = document.getElementById('heroStatsMount');
    if (!tagsMount && !statsMount) return;

    if (tagsMount && config.marqueeServices) {
      tagsMount.innerHTML = config.marqueeServices.slice(0, 4).map(function (name) {
        return '<span class="hero-tag">' + escapeHtml(name) + '</span>';
      }).join('');
    }

    if (statsMount && config.stats) {
      statsMount.innerHTML = config.stats.slice(0, 3).map(function (stat) {
        return (
          '<div class="hero-stat">' +
            '<span class="hero-stat-value">' + stat.value + '<span>' + escapeHtml(stat.suffix || '') + '</span></span>' +
            '<span class="hero-stat-label">' + escapeHtml(stat.label) + '</span>' +
          '</div>'
        );
      }).join('');
    }

    if (window.RamEditzVideos) {
      RamEditzVideos.renderHeroReel();

      if (window.bindVideoTriggers) window.bindVideoTriggers();
    }

    if (window.revealObserve) {
      document.querySelectorAll('.hero-visual .reveal, #heroReelMount [data-video-url]').forEach(function (el) {
        window.revealObserve(el);
      });
    }
  }

  /* ---- Build featured preview (from js/videos.js) ---- */
  function buildFeaturedPreview() {
    var mount = document.getElementById('featuredMount');
    if (!mount || !window.RamEditzVideos) return;

    RamEditzVideos.renderHomePreview();

    if (window.bindVideoTriggers) window.bindVideoTriggers();

    if (window.revealObserve) {
      mount.querySelectorAll('.reveal').forEach(window.revealObserve);
    }
  }

  /* ---- Build testimonials ---- */
  function buildTestimonials() {
    var mount = document.getElementById('testimonialsMount');
    if (!mount || !config.testimonials) return;

    mount.innerHTML = config.testimonials.map(function (t) {
      var stars = '';
      for (var i = 0; i < (t.rating || 5); i++) stars += '★';
      return (
        '<article class="testimonial-card reveal tilt-card">' +
          '<div class="testimonial-stars">' + stars + '</div>' +
          '<p class="testimonial-quote">"' + escapeHtml(t.quote) + '"</p>' +
          '<div class="testimonial-author">' +
            '<strong>' + escapeHtml(t.author) + '</strong>' +
            '<span>' + escapeHtml(t.role) + '</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    if (window.revealObserve) {
      mount.querySelectorAll('.reveal').forEach(window.revealObserve);
    }
  }

  /* ---- Premium footer ---- */
  function buildFooter() {
    var mount = document.getElementById('footerMount');
    if (!mount) return;

    var year = new Date().getFullYear();
    var line1 = config.logoLine1 || 'Ram';
    var line2 = config.logoLine2 || 'editz';
    var site = config.siteName || 'Ram editz';
    var tagline = config.tagline || 'We Make Brands Move';

    mount.innerHTML =
      '<footer class="footer-premium">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<div class="logo"><span class="logo-line">' + line1 + '</span><span class="logo-line">' + line2 + '</span></div>' +
            '<p>Cinematic video production for brands that refuse to blend in. We craft stories that move audiences and drive results.</p>' +
            '<div class="footer-socials">' +
              '<a href="' + (config.socials && config.socials.instagram || '#') + '" aria-label="' + escapeHtml(config.instagramLabel || 'Checkout our insta page') + '" title="' + escapeHtml(config.instagramLabel || 'Checkout our insta page') + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg></a>' +
              '<a href="' + (config.getWhatsAppLink ? config.getWhatsAppLink() : (config.socials && config.socials.whatsapp || '#')) + '" aria-label="WhatsApp" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.918.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg></a>' +
              '<a href="mailto:' + (config.email || '') + '" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h4>Navigate</h4><ul>' +
            '<li><a href="index.html">Home</a></li>' +
            '<li><a href="portfolio.html">Portfolio</a></li>' +
            '<li><a href="services.html">Services</a></li>' +
            '<li><a href="process.html">Process</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>Services</h4><ul>' +
            '<li><a href="services.html">Brand Reels</a></li>' +
            '<li><a href="services.html">Product Showcase</a></li>' +
            '<li><a href="services.html">Social Media</a></li>' +
            '<li><a href="services.html">UGC Videos</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h4>Contact</h4><ul>' +
            '<li><a href="contact.html">Start a Project</a></li>' +
            '<li><a href="mailto:' + (config.email || '') + '">' + (config.email || '') + '</a></li>' +
            (config.phone ? '<li><a href="tel:+91' + config.phone + '">' + config.phone + '</a></li>' : '') +
            '<li><span style="color:var(--gray)">' + (config.location || 'Madanapalle') + '</span></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + ' ' + site + '. All rights reserved.</span>' +
          '<span>' + tagline + '</span>' +
        '</div>' +
      '</footer>';
  }

  /* ---- 3D tilt on cards ---- */
  function initTilt() {
    if (isTouch || document.documentElement.classList.contains('perf-lite')) return;

    var tiltPending = false;
    var tiltTarget = null;
    var tiltX = 0;
    var tiltY = 0;

    function applyTilt() {
      tiltPending = false;
      if (!tiltTarget) return;
      tiltTarget.style.transform =
        'perspective(800px) rotateY(' + tiltX + 'deg) rotateX(' + tiltY + 'deg) translateY(-4px)';
    }

    document.querySelectorAll('.tilt-card').forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltX = x * 8;
        tiltY = -y * 8;
        tiltTarget = card;
        if (!tiltPending) {
          tiltPending = true;
          requestAnimationFrame(applyTilt);
        }
      });

      card.addEventListener('mouseleave', function () {
        if (tiltTarget === card) tiltTarget = null;
        card.style.transform = '';
      });
    });
  }

  /* ---- Init ---- */
  buildMarquee();
  buildHeroSection();
  buildStats();
  buildFeaturedPreview();
  buildTestimonials();
  buildFooter();
  initTilt();

  var contactEmail = document.getElementById('contactEmail');
  var contactPhone = document.getElementById('contactPhone');
  var contactLocation = document.getElementById('contactLocation');
  if (contactEmail && config.email) contactEmail.textContent = config.email;
  if (contactPhone && config.phone) contactPhone.textContent = config.phone;
  if (contactLocation && config.location) contactLocation.textContent = config.location;
})();
