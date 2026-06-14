(function () {
  'use strict';

  var config = window.RAM_EDITZ_CONFIG || {};
  var currentPage = document.body.dataset.page || '';

  var menuBtn = document.getElementById('menuBtn');
  var navClose = document.getElementById('navClose');
  var navOverlay = document.getElementById('navOverlay');
  var navLinks = document.querySelectorAll('.nav-link');
  var contactForm = document.getElementById('contactForm');
  var pageLoader = document.getElementById('pageLoader');
  var header = document.querySelector('.header');
  var videoModal = document.getElementById('videoModal');
  var videoModalBackdrop = document.getElementById('videoModalBackdrop');
  var videoModalClose = document.getElementById('videoModalClose');
  var videoModalTitle = document.getElementById('videoModalTitle');
  var videoModalPlayer = document.getElementById('videoModalPlayer');
  var budgetInput = document.getElementById('budget');
  var budgetAmountInput = document.getElementById('budgetAmount');
  var budgetSelected = document.getElementById('budgetSelected');
  var budgetMax = 50000;

  var revealObserver = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showToast(message) {
    var existing = document.getElementById('siteToast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('visible'); });
    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  }

  /* ---- Active nav for current page ---- */
  navLinks.forEach(function (link) {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });

  /* ---- Home back button (fixed bottom-right, all pages except home) ---- */
  function injectHomeBackBtn() {
    if (currentPage === 'home') return;
    if (document.querySelector('.home-back-btn')) return;

    var btn = document.createElement('a');
    btn.href = 'index.html';
    btn.className = 'home-back-btn';
    btn.setAttribute('aria-label', 'Back to home page');
    btn.title = 'Back to home page';
    btn.innerHTML =
      '<svg class="home-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
        '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/>' +
      '</svg>' +
      '<span class="home-back-label">Back to home page</span>';
    document.body.appendChild(btn);
  }

  injectHomeBackBtn();

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  window.revealObserve = function (el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('revealed');
  };

  window.addEventListener('load', function () {
    var delay = reducedMotion ? 150 : 900;
    setTimeout(function () {
      if (pageLoader) {
        pageLoader.classList.add('loader-exit');
        setTimeout(function () {
          pageLoader.classList.add('hidden');
          document.body.classList.remove('is-loading');
          window.dispatchEvent(new CustomEvent('rameditz:page-loaded'));
        }, reducedMotion ? 200 : 850);
      } else {
        document.body.classList.remove('is-loading');
        window.dispatchEvent(new CustomEvent('rameditz:page-loaded'));
      }
    }, delay);
  });

  /* ---- Header scroll effect ---- */
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!header || scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('header-scrolled', window.scrollY > 40);
      scrollTicking = false;
    });
  }, { passive: true });

  /* ---- Nav overlay ---- */
  function fb(name) {
    if (window.RamEditzFeedback) window.RamEditzFeedback.play(name);
  }

  function openNav() {
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    fb('menuOpen');
  }

  function closeNav(silent) {
    navOverlay.classList.remove('open');
    navOverlay.classList.remove('nav-item-hover');
    navOverlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    var bgLabel = navOverlay && navOverlay.querySelector('.nav-bg-label');
    if (bgLabel) {
      bgLabel.textContent = '';
      bgLabel.removeAttribute('data-text');
    }
    if (navOverlay) {
      navOverlay.querySelectorAll('.nav-link-hovered').forEach(function (l) {
        l.classList.remove('nav-link-hovered');
      });
    }
    if (!silent) fb('menuClose');
  }

  if (menuBtn) {
    menuBtn.addEventListener('pointerdown', function () {
      if (window.RamEditzFeedback && RamEditzFeedback.prepare) RamEditzFeedback.prepare();
    }, { passive: true });
    menuBtn.addEventListener('click', openNav);
  }
  if (navClose) navClose.addEventListener('click', closeNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav(true);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (navOverlay && navOverlay.classList.contains('open')) closeNav();
      if (videoModal && videoModal.classList.contains('open')) closeVideoModal();
    }
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', function (e) {
      if (e.target === navOverlay) closeNav();
    });
  }

  /* ---- Nav hover: ghost label + highlight ---- */
  function initNavHoverEffects() {
    if (!navOverlay) return;
    var bg = navOverlay.querySelector('.nav-overlay-bg');
    var linksList = navOverlay.querySelector('.nav-links');
    if (!bg || !linksList) return;

    var bgLabel = bg.querySelector('.nav-bg-label');
    if (!bgLabel) {
      bgLabel = document.createElement('div');
      bgLabel.className = 'nav-bg-label';
      bgLabel.setAttribute('aria-hidden', 'true');
      bg.appendChild(bgLabel);
    }

    function clearNavHover() {
      navOverlay.classList.remove('nav-item-hover');
      bgLabel.textContent = '';
      bgLabel.removeAttribute('data-text');
      linksList.querySelectorAll('.nav-link-hovered').forEach(function (l) {
        l.classList.remove('nav-link-hovered');
      });
    }

    linksList.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        var label = link.textContent.trim();
        bgLabel.textContent = label;
        bgLabel.setAttribute('data-text', label);
        navOverlay.classList.add('nav-item-hover');
        linksList.querySelectorAll('.nav-link-hovered').forEach(function (l) {
          l.classList.remove('nav-link-hovered');
        });
        link.classList.add('nav-link-hovered');
      });
    });

    linksList.addEventListener('mouseleave', clearNavHover);

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        setTimeout(clearNavHover, 0);
      });
    }
    if (navClose) {
      navClose.addEventListener('click', clearNavHover);
    }
  }

  initNavHoverEffects();

  var modalEls = {
    modal: videoModal,
    titleEl: videoModalTitle,
    playerEl: videoModalPlayer
  };

  /* ---- Portfolio (portfolio page only) ---- */
  function buildPortfolio() {
    if (!window.RamEditzVideos) return;

    RamEditzVideos.renderPortfolio();

    document.querySelectorAll('.reveal').forEach(function (el) {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('revealed');
    });

    bindVideoTriggers();
    initPortfolioFilters();
  }

  function initPortfolioFilters() {
    var filters = document.getElementById('portfolioFilters');
    var grid = document.getElementById('videoGrid');
    if (!filters || !grid) return;

    var categories = ['ALL'];
    grid.querySelectorAll('.video-card').forEach(function (card) {
      var cat = card.querySelector('.video-category');
      if (cat && categories.indexOf(cat.textContent) === -1) {
        categories.push(cat.textContent);
      }
    });

    filters.innerHTML = categories.map(function (cat, i) {
      return '<button class="filter-btn' + (i === 0 ? ' active' : '') + '" data-filter="' + cat + '">' + cat + '</button>';
    }).join('');

    if (filters.dataset.filterBound) return;
    filters.dataset.filterBound = '1';

    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filters.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      grid.querySelectorAll('.video-card').forEach(function (card) {
        var cat = card.querySelector('.video-category').textContent;
        card.classList.toggle('hidden', filter !== 'ALL' && cat !== filter);
      });
    });
  }

  /* ---- Video Modal ---- */
  function closeVideoModal() {
    if (!window.RamEditzVideos) return;
    RamEditzVideos.closeModal(modalEls);
    fb('modalClose');
  }

  function bindVideoTriggers() {
    if (!window.RamEditzVideos) return;
    RamEditzVideos.bindTriggers(modalEls, function (url, title) {
      fb('play');
    });
  }

  window.bindVideoTriggers = bindVideoTriggers;

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

  if (document.getElementById('videoGrid')) {
    buildPortfolio();
  }

  window.addEventListener('rameditz:page-loaded', bindVideoTriggers);

  /* ---- Budget slider ---- */
  function formatBudget(amount) {
    var val = parseInt(amount, 10);
    if (isNaN(val) || val <= 0) return 'Flexible';
    return '₹' + val.toLocaleString('en-IN');
  }

  function clampBudget(val) {
    var num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return 0;
    if (num > budgetMax) return budgetMax;
    return num;
  }

  function setBudgetValue(val) {
    val = clampBudget(val);
    if (budgetInput) budgetInput.value = val;
    if (budgetAmountInput) budgetAmountInput.value = val;
    updateBudgetLabel();
  }

  function getBudgetValue() {
    if (budgetAmountInput && budgetAmountInput.value !== '') {
      return clampBudget(budgetAmountInput.value);
    }
    if (budgetInput) return clampBudget(budgetInput.value);
    return 0;
  }

  function updateBudgetLabel() {
    if (!budgetSelected) return;
    budgetSelected.textContent = 'Selected: ' + formatBudget(getBudgetValue());
  }

  if (budgetInput) {
    budgetInput.addEventListener('input', function () {
      setBudgetValue(budgetInput.value);
    });
  }

  if (budgetAmountInput) {
    budgetAmountInput.addEventListener('input', function () {
      if (budgetAmountInput.value === '') {
        updateBudgetLabel();
        return;
      }
      setBudgetValue(budgetAmountInput.value);
    });

    budgetAmountInput.addEventListener('blur', function () {
      setBudgetValue(budgetAmountInput.value || 0);
    });
  }

  if (budgetInput || budgetAmountInput) {
    updateBudgetLabel();
  }

  /* ---- Contact form ---- */
  if (contactForm) {
    var whatsappNote = document.createElement('p');
    whatsappNote.className = 'form-note';
    whatsappNote.textContent = 'Fill in your project details below — submit opens WhatsApp with your inquiry ready to send.';
    contactForm.insertBefore(whatsappNote, contactForm.firstChild);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = document.getElementById('name');
      var brandEl = document.getElementById('brand');
      var videoTypeEl = document.getElementById('videoType');
      var messageEl = document.getElementById('message');
      var name = nameEl ? nameEl.value.trim() : '';
      var brand = brandEl ? brandEl.value.trim() : '';
      var videoType = videoTypeEl ? videoTypeEl.value : '';
      var videoTypeLabel = videoTypeEl && videoTypeEl.selectedIndex >= 0
        ? videoTypeEl.options[videoTypeEl.selectedIndex].textContent.trim()
        : '';
      var budget = formatBudget(getBudgetValue());
      var message = messageEl ? messageEl.value.trim() : '';

      if (!name) {
        fb('error');
        showToast('Please enter your name.');
        if (nameEl) nameEl.focus();
        return;
      }

      if (!videoType) {
        fb('error');
        showToast('Please select a video type.');
        if (videoTypeEl) videoTypeEl.focus();
        return;
      }

      if (!message) {
        fb('error');
        showToast('Please tell us about your vision in the message box.');
        if (messageEl) messageEl.focus();
        return;
      }

      if (!config.getWhatsAppProjectLink) {
        showToast('WhatsApp is not configured.');
        return;
      }

      var whatsappUrl = config.getWhatsAppProjectLink({
        name: name,
        brand: brand,
        videoType: videoTypeLabel,
        budget: budget,
        message: message
      });

      var btn = contactForm.querySelector('.btn-submit');
      var original = btn.textContent;
      btn.textContent = 'OPENING WHATSAPP...';
      btn.disabled = true;
      fb('success');

      window.open(whatsappUrl, '_blank');

      btn.textContent = 'SENT — CHECK WHATSAPP ✓';
      btn.style.borderColor = '#4dd0e1';
      btn.style.boxShadow = '0 0 30px rgba(77, 208, 225, 0.4)';

      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
        contactForm.reset();
        setBudgetValue(10000);
      }, 3000);
    });
  }

  /* ---- Apply config to social links ---- */
  if (config.socials) {
    var socialLinks = document.querySelectorAll('.contact-socials a');
    if (socialLinks[0] && config.socials.instagram) {
      socialLinks[0].href = config.socials.instagram;
      socialLinks[0].target = '_blank';
      socialLinks[0].rel = 'noopener';
    }
    if (socialLinks[1] && config.socials.whatsapp) {
      socialLinks[1].href = config.getWhatsAppLink ? config.getWhatsAppLink() : config.socials.whatsapp;
      socialLinks[1].target = '_blank';
      socialLinks[1].rel = 'noopener';
    }
    if (socialLinks[2] && config.email) socialLinks[2].href = 'mailto:' + config.email;
  }
})();
