/**
 * Ram editz — Video manager
 * Reads js/videos.js and builds portfolio + modal playback
 */
(function () {
  'use strict';

  var config = window.RAM_EDITZ_CONFIG || {};
  var escapeHtml = config.escapeHtml;

  function getYouTubeId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function getVimeoId(url) {
    if (!url) return null;
    var m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : null;
  }

  function isDirectVideo(url) {
    return url && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
  }

  function toEmbedUrl(url) {
    if (!url) return '';
    var yt = getYouTubeId(url);
    if (yt) return 'https://www.youtube.com/embed/' + yt + '?autoplay=1&rel=0';
    var vimeo = getVimeoId(url);
    if (vimeo) return 'https://player.vimeo.com/video/' + vimeo + '?autoplay=1';
    if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
      return url.includes('?') ? url + '&autoplay=1' : url + '?autoplay=1';
    }
    return url;
  }

  function getThumbnail(video) {
    if (video.thumbnail) return video.thumbnail;
    var yt = getYouTubeId(video.url);
    if (yt) return 'https://img.youtube.com/vi/' + yt + '/hqdefault.jpg';
    return '';
  }

  function getVideosConfig() {
    var v = window.RAM_EDITZ_VIDEOS;
    if (!v) return { featured: {}, portfolio: [] };
    return v;
  }

  function getActivePortfolio() {
    return getVideosConfig().portfolio.filter(function (v) {
      return v.enabled !== false;
    });
  }

  function getFeatured() {
    var f = getVideosConfig().featured;
    if (!f || f.enabled === false) return null;
    return f;
  }

  function buildBgVideoHtml(video, className) {
    if (!isDirectVideo(video.url)) return '';
    var poster = getThumbnail(video);
    var posterAttr = poster ? ' poster="' + escapeHtml(poster) + '"' : '';
    return (
      '<video class="' + className + '" src="' + escapeHtml(video.url) + '"' +
      posterAttr + ' muted loop playsinline autoplay preload="auto" aria-hidden="true"></video>'
    );
  }

  function buildThumbHtml(video) {
    var thumb = getThumbnail(video);
    var hasUrl = !!video.url;
    var inner = '';

    if (hasUrl && isDirectVideo(video.url)) {
      inner +=
        buildBgVideoHtml(video, 'video-thumb-bg-video') +
        '<div class="video-thumb-overlay"></div>';
    } else if (thumb) {
      inner +=
        '<img class="video-thumb-img" src="' + escapeHtml(thumb) + '" alt="' + escapeHtml(video.title) + ' thumbnail" loading="lazy">' +
        '<div class="video-thumb-overlay"></div>';
    }

    inner +=
      '<button class="play-btn" aria-label="Play ' + escapeHtml(video.title) + '">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>' +
      '</button>';

    if (!hasUrl) {
      inner += '<span class="video-placeholder">ADD URL IN js/videos.js</span>';
    } else if (!thumb) {
      inner += '<span class="video-placeholder">YOUR VIDEO HERE</span>';
    }

    return inner;
  }

  function buildVideoCard(video, index) {
    var hasUrl = !!video.url;
    var embed = hasUrl ? toEmbedUrl(video.url) : '';
    var thumb = getThumbnail(video);
    var thumbAttrs = hasUrl
      ? ' data-video-url="' + escapeHtml(embed) + '" data-video-title="' + escapeHtml(video.title) + '" role="button" tabindex="0"'
      : '';

    return (
      '<article class="video-card reveal" data-video-id="' + escapeHtml(video.id || 'video-' + index) + '">' +
        '<div class="video-thumb' +
          ((thumb || (hasUrl && isDirectVideo(video.url))) ? ' has-thumbnail' : '') +
          (hasUrl ? '' : ' is-pending') + '"' + thumbAttrs + '>' +
          buildThumbHtml(video) +
        '</div>' +
        '<h3>' + escapeHtml(video.title) + '</h3>' +
        '<p class="video-category">' + escapeHtml(video.category || 'OTHER') + '</p>' +
      '</article>'
    );
  }

  function buildFeaturedHtml(featured) {
    var embed = toEmbedUrl(featured.url);
    var thumb = getThumbnail(featured);
    var thumbStyle = thumb ? ' style="background-image:url(' + thumb + ')"' : '';
    var hasUrl = !!featured.url;

    return (
      '<div class="featured-reel featured-reel-hud reveal' + (thumb ? ' has-thumbnail' : '') + '" ' +
        (hasUrl ? 'data-video-url="' + escapeHtml(embed) + '" data-video-title="' + escapeHtml(featured.title) + '" role="button" tabindex="0"' : '') +
        ' aria-label="' + (hasUrl ? 'Play ' + escapeHtml(featured.title) : escapeHtml(featured.title)) + '"' + thumbStyle + '>' +

        '<svg class="featured-hud-vf" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<circle cx="200" cy="200" r="150" stroke="rgba(255,140,66,0.35)" stroke-width="1.5"/>' +
          '<circle cx="200" cy="200" r="110" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>' +
          '<circle cx="200" cy="200" r="70" stroke="rgba(255,140,66,0.25)" stroke-width="1"/>' +
          '<circle cx="200" cy="200" r="30" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>' +
          '<line x1="200" y1="50" x2="200" y2="350" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>' +
          '<line x1="50" y1="200" x2="350" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>' +
          '<rect x="155" y="155" width="90" height="90" rx="4" stroke="rgba(255,179,128,0.4)" stroke-width="1.5" transform="rotate(45 200 200)"/>' +
          '<path d="M200 60 Q300 100 340 200 Q300 300 200 340 Q100 300 60 200 Q100 100 200 60" stroke="rgba(255,140,66,0.2)" stroke-width="1" fill="none"/>' +
        '</svg>' +

        '<div class="featured-hud-film" aria-hidden="true">' +
          '<div class="featured-hud-film-perf"></div>' +
          '<div class="featured-hud-film-frame"></div>' +
          '<div class="featured-hud-film-perf"></div>' +
        '</div>' +

        '<div class="featured-hud-rec"><span class="featured-rec-dot"></span> REC</div>' +
        '<div class="featured-hud-timecode" data-timecode>00:00:00:00</div>' +

        '<div class="featured-hud-player">' +
          '<button class="featured-hud-play" type="button" aria-label="Play featured reel">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>' +
          '</button>' +
          '<div class="featured-hud-scrub">' +
            '<div class="featured-hud-scrub-track">' +
              '<div class="featured-hud-scrub-fill"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="featured-hud-info">' +
          '<span class="featured-hud-comm">COMM</span>' +
          '<p class="featured-label">' + escapeHtml(featured.title) + '</p>' +
          '<p class="featured-hud-sub">Featured Showreel</p>' +
          (!hasUrl ? '<p class="featured-hint">Add your showreel URL in js/videos.js</p>' : '') +
        '</div>' +
      '</div>'
    );
  }

  var timecodeInterval = null;

  function initFeaturedTimecode() {
    if (timecodeInterval) return;

    var sec = 0;
    timecodeInterval = setInterval(function () {
      if (document.hidden) return;
      sec += 1;
      var h = String(Math.floor(sec / 3600) % 24).padStart(2, '0');
      var m = String(Math.floor(sec / 60) % 60).padStart(2, '0');
      var s = String(sec % 60).padStart(2, '0');
      var f = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      var text = h + ':' + m + ':' + s + ':' + f;
      document.querySelectorAll('[data-timecode]').forEach(function (el) {
        el.textContent = text;
      });
    }, 1000);
  }

  function buildHeroReelHtml(featured) {
    var embed = toEmbedUrl(featured.url);
    var thumb = getThumbnail(featured);
    var thumbStyle = thumb ? ' style="background-image:url(' + escapeHtml(thumb) + ')"' : '';
    var hasUrl = !!featured.url;

    return (
      '<div class="hero-reel' + (thumb ? ' has-thumbnail' : '') + '" ' +
        (hasUrl ? 'data-video-url="' + escapeHtml(embed) + '" data-video-title="' + escapeHtml(featured.title) + '" role="button" tabindex="0"' : '') +
        ' aria-label="' + (hasUrl ? 'Play showreel' : escapeHtml(featured.title)) + '"' + thumbStyle + '>' +
        '<div class="hero-reel-scanline" aria-hidden="true"></div>' +
        '<div class="hero-reel-corners" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
        '<div class="hero-reel-rec"><span class="hero-rec-dot"></span> REC</div>' +
        '<div class="hero-reel-timecode" data-timecode>00:00:00:00</div>' +
        '<button class="hero-reel-play" type="button" aria-label="Play showreel">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>' +
        '</button>' +
        '<div class="hero-reel-bar">' +
          '<span class="hero-reel-title">' + escapeHtml(featured.title) + '</span>' +
          '<span class="hero-reel-label">Showreel</span>' +
        '</div>' +
      '</div>'
    );
  }

  function renderHeroReel() {
    var mount = document.getElementById('heroReelMount');
    if (!mount) return;

    var featured = getFeatured();
    if (!featured) {
      mount.innerHTML = '<div class="hero-reel hero-reel-placeholder">Add your showreel in js/videos.js</div>';
      return;
    }

    mount.innerHTML = buildHeroReelHtml(featured);
    initFeaturedTimecode();
  }

  function buildEmptyState() {
    return (
      '<div class="video-empty reveal">' +
        '<p>No videos yet</p>' +
        '<span>Open <code>js/videos.js</code> to add your work</span>' +
      '</div>'
    );
  }

  function renderPortfolio() {
    var grid = document.getElementById('videoGrid');
    var featured = getFeatured();
    var videos = getActivePortfolio();

    var featuredMount = document.getElementById('featuredReelMount');

    if (featured && featuredMount) {
      featuredMount.innerHTML = buildFeaturedHtml(featured);
    } else if (featuredMount) {
      featuredMount.innerHTML = '';
    }

    initFeaturedTimecode();

    if (!grid) return;

    if (videos.length === 0) {
      grid.innerHTML = buildEmptyState();
    } else {
      grid.innerHTML = videos.map(buildVideoCard).join('');
    }

    initBackgroundVideos();
  }

  function initBackgroundVideos() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var bgVideos = document.querySelectorAll('.featured-card-bg-video, .video-thumb-bg-video');
    if (!bgVideos.length) return;

    function tryPlay(videoEl) {
      if (!videoEl) return;
      videoEl.muted = true;
      videoEl.defaultMuted = true;
      var playPromise = videoEl.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () { /* retry after interaction */ });
      }
    }

    function bindObserver(videoEl) {
      var root = videoEl.closest('.featured-card') || videoEl.closest('.video-thumb') || videoEl.closest('.video-card');
      if (!root || root.dataset.bgObserved || !('IntersectionObserver' in window)) return;
      root.dataset.bgObserved = '1';

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tryPlay(videoEl);
          else if (!videoEl.paused) videoEl.pause();
        });
      }, { threshold: 0.12, rootMargin: '40px 0px' });

      observer.observe(root);
    }

    bgVideos.forEach(function (videoEl) {
      bindObserver(videoEl);

      if (!videoEl.dataset.bgReady) {
        videoEl.dataset.bgReady = '1';
        videoEl.addEventListener('canplay', function () {
          tryPlay(videoEl);
        }, { once: true });
      }

      tryPlay(videoEl);
    });

    if (!initBackgroundVideos.globalBound) {
      initBackgroundVideos.globalBound = true;

      window.addEventListener('rameditz:page-loaded', function () {
        document.querySelectorAll('.featured-card-bg-video, .video-thumb-bg-video').forEach(tryPlay);
      });

      document.addEventListener('pointerdown', function () {
        document.querySelectorAll('.featured-card-bg-video, .video-thumb-bg-video').forEach(tryPlay);
      }, { once: true, passive: true });
    }
  }

  function renderHomePreview() {
    var mount = document.getElementById('featuredMount');
    if (!mount) return;

    var videos = getActivePortfolio().slice(0, 3);
    if (videos.length === 0) {
      mount.innerHTML = '<p class="featured-empty">Add videos in <code>js/videos.js</code></p>';
      return;
    }

    mount.innerHTML = videos.map(function (video, i) {
      var embed = toEmbedUrl(video.url);
      var cardInner =
        buildBgVideoHtml(video, 'featured-card-bg-video') +
        '<div class="featured-card-overlay" aria-hidden="true"></div>' +
        '<div class="featured-card-inner">' +
          '<span class="featured-card-num">0' + (i + 1) + '</span>' +
          '<div class="featured-card-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg></div>' +
          '<div class="featured-card-body">' +
            '<div><h3>' + escapeHtml(video.title) + '</h3><p class="featured-card-cat">' + escapeHtml(video.category) + '</p></div>' +
            '<div class="featured-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7,7 17,7 17,17"/></svg></div>' +
          '</div>' +
        '</div>';

      if (video.url) {
        return (
          '<div class="featured-card reveal tilt-card" ' +
            'data-video-url="' + escapeHtml(embed) + '" ' +
            'data-video-title="' + escapeHtml(video.title) + '" ' +
            'role="button" tabindex="0">' +
            cardInner +
          '</div>'
        );
      }

      return (
        '<a href="portfolio.html" class="featured-card reveal tilt-card">' +
          cardInner +
        '</a>'
      );
    }).join('');

    initBackgroundVideos();
  }

  function openModal(url, title, modalEls) {
    if (!modalEls || !modalEls.modal || !url) return;

    modalEls.titleEl.textContent = title || 'Video';
    modalEls.playerEl.innerHTML = '';

    if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.title = title || 'Video';
      modalEls.playerEl.appendChild(iframe);
    } else if (isDirectVideo(url)) {
      var video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'auto';
      modalEls.playerEl.appendChild(video);
      video.load();
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () { /* controls remain available */ });
      }
    } else {
      var iframe2 = document.createElement('iframe');
      iframe2.src = url;
      iframe2.allowFullscreen = true;
      modalEls.playerEl.appendChild(iframe2);
    }

    modalEls.modal.classList.add('open');
    modalEls.modal.setAttribute('aria-hidden', 'false');
    modalEls.modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';

    var closeBtn = modalEls.modal.querySelector('.video-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalEls) {
    if (!modalEls || !modalEls.modal) return;
    modalEls.modal.classList.remove('open');
    modalEls.modal.setAttribute('aria-hidden', 'true');
    modalEls.modal.removeAttribute('aria-modal');
    modalEls.playerEl.innerHTML = '';
    document.body.style.overflow = '';
  }

  function bindTriggers(modalEls, onOpen) {
    document.querySelectorAll('[data-video-url]').forEach(function (el) {
      var url = (el.dataset.videoUrl || '').trim();
      if (!url || el.dataset.videoBound) return;
      el.dataset.videoBound = '1';

      function trigger(e) {
        if (e.target.closest('.play-btn')) e.preventDefault();
        var url = el.dataset.videoUrl;
        var title = el.dataset.videoTitle;
        if (onOpen) onOpen(url, title);
        openModal(url, title, modalEls);
      }

      el.addEventListener('click', trigger);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger(e);
        }
      });
    });
  }

  window.RamEditzVideos = {
    renderPortfolio: renderPortfolio,
    renderHomePreview: renderHomePreview,
    renderHeroReel: renderHeroReel,
    closeModal: closeModal,
    bindTriggers: bindTriggers
  };
})();
