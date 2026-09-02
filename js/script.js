/**
 * Business card: tilt toward mouse when cursor is OFF the card; flat when over the card.
 */
(function () {
  'use strict';

  var card = document.querySelector('.card-inner');
  if (!card) return;

  var maxTilt = 12;
  var rect;
  var centerX, centerY;

  function isOverCard(clientX, clientY) {
    rect = card.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  function setTilt(e) {
    if (isOverCard(e.clientX, e.clientY)) {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      return;
    }
    getRect();
    var x = e.clientX - centerX;
    var y = e.clientY - centerY;
    var w = rect.width / 2;
    var h = rect.height / 2;
    var rotateY = (x / w) * maxTilt;
    var rotateX = -(y / h) * maxTilt;
    card.style.transform =
      'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
  }

  function getRect() {
    rect = card.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }

  function resetTilt() {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  document.addEventListener('mousemove', setTilt);
  document.addEventListener('mouseleave', resetTilt);
})();

/**
 * Resume PDF iframe: #view=FitH fits width and often crops badly on phones; use plain PDF on narrow viewports.
 */
(function () {
  'use strict';
  var iframe = document.querySelector('.resume-pdf-iframe');
  if (!iframe) return;
  var base = './assets/resume.pdf';
  function syncResumePdfSrc() {
    var narrow = window.matchMedia('(max-width: 768px)').matches;
    iframe.setAttribute('src', narrow ? base : base + '#view=FitH');
  }
  syncResumePdfSrc();
  window.addEventListener('resize', syncResumePdfSrc);
})();

/**
 * Easter egg: click top-right corner of card to flip to back (quote side).
 * Only active on the main card view (not when a section is expanded).
 */
(function () {
  'use strict';
  var card = document.getElementById('card');
  var triggers = document.querySelectorAll('.card-easter-egg');
  if (!card || !triggers.length) return;
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (card.classList.contains('card-expanded')) return;
      card.classList.toggle('card-flipped');
    });
  });
})();

/**
 * Easter egg: click the moon at night to toggle blood moon.
 * Moon phase is preserved (handled by moon-phase-mask).
 */
(function () {
  'use strict';
  var moon = document.getElementById('moon');
  if (!moon) return;
  moon.addEventListener('click', function (e) {
    e.stopPropagation();
    if (document.body.classList.contains('stars-visible')) {
      moon.classList.toggle('moon-blood');
    }
  });
})();

/**
 * Card sections: Personal Projects, Academic Projects, About.
 * Click a nav button -> card expands, only that section title + sub-headings show.
 * Click the section title -> back to main card.
 */
(function () {
  'use strict';

  var cardEl = document.getElementById('card');
  var cardMain = document.getElementById('card-main');
  var navButtons = document.querySelectorAll('.card-nav[data-section]');
  var backButtons = document.querySelectorAll('.card-back[data-back="main"]');
  var sectionIds = { about: 'card-section-about', resume: 'card-section-resume' };

  function showMain() {
    if (cardEl) cardEl.classList.remove('card-expanded');
    if (cardMain) cardMain.style.display = '';
    document.querySelectorAll('.card-section').forEach(function (section) {
      section.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.card-nav').forEach(function (btn) {
      btn.classList.remove('card-nav-active');
    });
  }

  function showSection(sectionKey) {
    var id = sectionIds[sectionKey];
    if (!id) return;
    var section = document.getElementById(id);
    if (!section) return;
    if (cardEl) {
      cardEl.classList.add('card-expanded');
      cardEl.classList.remove('card-flipped');
    }
    if (cardMain) cardMain.style.display = 'none';
    document.querySelectorAll('.card-section').forEach(function (s) {
      s.setAttribute('aria-hidden', s === section ? 'false' : 'true');
    });
    document.querySelectorAll('.card-nav').forEach(function (btn) {
      btn.classList.toggle('card-nav-active', btn.getAttribute('data-section') === sectionKey);
    });
    if (id === 'card-section-about') {
      setAboutTab('about');
    }
  }

  var PROJECT_TABS = [
    'hip-implant',
    'bone-modeling',
    'bmen-207',
    'hospital-prediction',
    'scraper',
    'ai-protein',
    'medbuddy',
    'canine-wearable',
    'robotic-leg'
  ];
  var projectsDropdown = document.getElementById('about-projects-dropdown');
  var projectsToggle = document.getElementById('about-projects-toggle');
  var projectsMenu = document.getElementById('about-projects-menu');
  var projectGroups = document.querySelectorAll('.about-projects-group');

  function closeProjectGroups() {
    projectGroups.forEach(function (group) {
      group.classList.remove('is-open');
      var btn = group.querySelector('.about-projects-group-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeProjectsMenu() {
    if (!projectsDropdown || !projectsToggle || !projectsMenu) return;
    projectsDropdown.classList.remove('is-open');
    projectsToggle.setAttribute('aria-expanded', 'false');
    projectsMenu.hidden = true;
    closeProjectGroups();
  }

  function openProjectsMenu() {
    if (!projectsDropdown || !projectsToggle || !projectsMenu) return;
    projectsDropdown.classList.add('is-open');
    projectsToggle.setAttribute('aria-expanded', 'true');
    projectsMenu.hidden = false;
  }

  function setAboutTab(tab) {
    var aboutBtn = document.querySelector('.about-tab-btn[data-about-tab="about"]');
    var panels = document.querySelectorAll('.about-tab-panel');
    var menuItems = document.querySelectorAll('.about-projects-subitem');
    var isProject = PROJECT_TABS.indexOf(tab) !== -1;

    if (aboutBtn) {
      aboutBtn.classList.toggle('about-tab-active', tab === 'about');
      aboutBtn.setAttribute('aria-selected', tab === 'about' ? 'true' : 'false');
    }
    if (projectsToggle) {
      projectsToggle.classList.toggle('about-tab-active', isProject);
    }
    menuItems.forEach(function (item) {
      item.classList.toggle('about-projects-item-active', item.getAttribute('data-about-tab') === tab);
    });
    projectGroups.forEach(function (group) {
      var hasActive = !!group.querySelector('.about-projects-subitem[data-about-tab="' + tab + '"]');
      group.classList.toggle('has-active', hasActive);
    });
    panels.forEach(function (panel) {
      var panelTab = panel.id.replace('about-panel-', '');
      panel.setAttribute('aria-hidden', panelTab === tab ? 'false' : 'true');
    });
    closeProjectsMenu();
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var section = btn.getAttribute('data-section');
      if (section) showSection(section);
    });
  });

  backButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showMain();
    });
  });

  /* About section tabs: About | Projects dropdown */
  var aboutTabBtns = document.querySelectorAll('.about-tab-btn[data-about-tab]');
  aboutTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.getAttribute('data-about-tab');
      if (!tab) return;
      setAboutTab(tab);
    });
  });

  if (projectsToggle) {
    projectsToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (projectsDropdown && projectsDropdown.classList.contains('is-open')) {
        closeProjectsMenu();
      } else {
        openProjectsMenu();
      }
    });
  }

  document.querySelectorAll('.about-projects-subitem').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      var tab = item.getAttribute('data-about-tab');
      if (tab) setAboutTab(tab);
    });
  });

  projectGroups.forEach(function (group) {
    var btn = group.querySelector('.about-projects-group-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !group.classList.contains('is-open');
      closeProjectGroups();
      if (willOpen) {
        group.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!projectsDropdown) return;
    if (!projectsDropdown.contains(e.target)) closeProjectsMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProjectsMenu();
  });
})();

/**
 * Project pages: render recruiter-friendly layout + accessible 5-image carousel.
 */
(function () {
  'use strict';

  var sharedGallery = [
    {
      src: './assets/project-the-what.png',
      caption: 'System architecture and scope definition',
      altSuffix: 'system architecture overview',
      fit: 'contain'
    },
    {
      src: './assets/project-the-how.png',
      caption: 'Prototype development and technical build',
      altSuffix: 'prototype development details',
      fit: 'contain'
    },
    {
      src: './assets/project-system-architecture.png',
      caption: 'Final CAD assembly and integration map',
      altSuffix: 'final CAD assembly and integration map',
      fit: 'contain'
    },
    {
      src: './assets/project-test-setup.png',
      caption: 'Validation test setup and measurement workflow',
      altSuffix: 'validation test setup',
      fit: 'cover'
    },
    {
      src: './assets/project-the-result.png',
      caption: 'Final outcome and key performance result',
      altSuffix: 'final project outcome',
      fit: 'contain'
    }
  ];

  var projectContent = {
    'hip-implant': {
      title: 'Hip Implant Project',
      role: 'Design and Analysis Contributor',
      team: 'Biomechanics Design Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Designed and evaluated a concept hip implant to improve load transfer and manufacturing readiness.',
      problem: 'The team needed an implant concept that balanced biomechanical stability with manufacturable geometry while addressing stress concentration in high-load regions.',
      action: 'I owned CAD refinement, translated requirements into measurable criteria, and supported reviews with concise design tradeoff documentation.',
      process: 'I iterated geometry, compared design options against constraints, and aligned structural assumptions with team testing plans to reduce downstream rework.',
      outcome: 'We delivered a final design package and rationale that improved design clarity for stakeholders and strengthened confidence in the chosen direction.'
    },
    'bone-modeling': {
      title: 'Bone Modeling Lab',
      role: 'Computational Modeling Team Member',
      team: 'Biomedical Simulation Lab',
      dates: 'Jan 2024 - May 2024',
      summary: 'Built and validated a bone model workflow to support data-informed biomechanical analysis.',
      problem: 'The lab needed a repeatable way to model bone behavior from experimental context without losing traceability between assumptions and outputs.',
      action: 'I structured the model pipeline, documented key assumptions, and prepared interpretable outputs for technical discussion.',
      process: 'I cleaned inputs, validated parameter choices, and compared intermediate outputs to expected trends before final interpretation.',
      outcome: 'The final workflow improved reproducibility and gave the team a stronger foundation for follow-on experiments and model updates.'
    },
    'bmen-207': {
      title: 'BMEN 207 Project',
      role: 'Project Engineer',
      team: 'Course Design Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Delivered a semester-long biomedical engineering project with clear milestones and documented technical decisions.',
      problem: 'The project required integrating course concepts into a practical solution under strict time, scope, and communication constraints.',
      action: 'I coordinated implementation priorities, maintained technical documentation, and communicated risks during checkpoint reviews.',
      process: 'I broke the project into milestones, validated each stage against requirements, and adjusted task ownership to keep delivery on schedule.',
      outcome: 'The team delivered a complete final submission with measurable progress evidence and a strong narrative of engineering decision-making.'
    },
    'hospital-prediction': {
      title: 'Hospital Prediction',
      role: 'Data and Modeling Contributor',
      team: 'Healthcare Analytics Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Developed a predictive workflow to support hospital-oriented decision making using structured data signals.',
      problem: 'Stakeholders needed a practical prediction approach that could improve planning quality without introducing opaque model behavior.',
      action: 'I prepared the modeling dataset, supported feature decisions, and translated metrics into plain-language implications for non-technical reviewers.',
      process: 'I evaluated multiple modeling options, tracked performance changes, and documented the rationale for the final selected approach.',
      outcome: 'The final model and report provided a usable baseline for future iterations and made technical results easier to consume across roles.'
    },
    scraper: {
      title: 'Scraper Project',
      role: 'Automation Developer',
      team: 'Independent Software Build',
      dates: 'Jan 2024 - May 2024',
      summary: 'Implemented a data scraping workflow that reliably transformed unstructured web content into analyzable records.',
      problem: 'Manual data collection was inconsistent and time-consuming, making it difficult to maintain quality and update cadence.',
      action: 'I built the scraping logic, handled edge-case parsing, and introduced clear output formatting for downstream use.',
      process: 'I iteratively tested source variations, improved failure handling, and verified that extracted fields remained stable over repeated runs.',
      outcome: 'The project reduced manual effort, improved data consistency, and created a maintainable automation base for future enhancements.'
    },
    'ai-protein': {
      title: 'AI Protein Algorithm',
      role: 'ML and Algorithm Contributor',
      team: 'Computational Biology Group',
      dates: 'Jan 2024 - May 2024',
      summary: 'Contributed to an AI-driven protein-focused algorithm with emphasis on interpretability and iterative model improvement.',
      problem: 'The challenge was balancing algorithmic performance with transparent reasoning suitable for scientific collaboration.',
      action: 'I supported feature design, tested model behaviors, and documented decisions that affected precision and reliability.',
      process: 'I ran comparison experiments, reviewed outcome patterns with the team, and refined the approach based on observed limitations.',
      outcome: 'The final direction improved confidence in the model pipeline and clarified priorities for the next round of experimentation.'
    },
    medbuddy: {
      title: 'MedBuddy',
      role: 'Prototype Product Developer',
      team: 'Healthcare Prototype Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Built a healthcare-oriented prototype focused on usability, reliability, and practical user workflow support.',
      problem: 'Users needed a lightweight solution that was easy to operate while still delivering useful and trustworthy functionality.',
      action: 'I defined interaction priorities, implemented core features, and validated that the prototype matched intended usage scenarios.',
      process: 'I gathered feedback, revised flows, and documented tradeoffs to align the prototype with both user and technical constraints.',
      outcome: 'The team produced a clearer, more usable prototype that demonstrated feasibility and informed future product planning.'
    },
    'canine-wearable': {
      title: 'Canine Wearable Monitor',
      role: 'Embedded and Systems Contributor',
      team: 'Wearable Prototype Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Designed a canine wearable monitoring concept that integrated sensing, enclosure constraints, and practical testing.',
      problem: 'The project needed a comfortable and robust form factor that could still capture meaningful monitoring data.',
      action: 'I helped define system requirements, supported hardware-software integration decisions, and prepared test documentation.',
      process: 'I evaluated placement tradeoffs, refined implementation details, and used test feedback to improve overall system readiness.',
      outcome: 'The resulting prototype improved design confidence and provided a stronger baseline for expanded real-world trials.'
    },
    'robotic-leg': {
      title: 'Robotic Leg',
      role: 'Mechatronics Team Member',
      team: 'Robotics Development Team',
      dates: 'Jan 2024 - May 2024',
      summary: 'Contributed to a robotic leg prototype by connecting mechanical design, control considerations, and validation planning.',
      problem: 'The team needed to deliver stable, repeatable motion while managing mechanical limits and implementation complexity.',
      action: 'I supported mechanism development, helped align control priorities, and documented integration blockers early.',
      process: 'I collaborated through iterative builds, tested behavior under representative conditions, and tracked adjustments with clear rationale.',
      outcome: 'The team demonstrated a functional prototype with improved motion reliability and actionable next steps for optimization.'
    }
  };

  var projectOrder = [
    'hip-implant',
    'bone-modeling',
    'bmen-207',
    'hospital-prediction',
    'scraper',
    'ai-protein',
    'medbuddy',
    'canine-wearable',
    'robotic-leg'
  ];

  function renderProjectPage(container, projectKey, data) {
    if (!container || !data) return;
    var currentIndex = projectOrder.indexOf(projectKey);
    var prevKey = currentIndex > 0 ? projectOrder[currentIndex - 1] : null;
    var nextKey = currentIndex >= 0 && currentIndex < projectOrder.length - 1 ? projectOrder[currentIndex + 1] : null;
    var prevLabel = prevKey ? 'Previous Project: ' + projectContent[prevKey].title : 'Previous Project';
    var nextLabel = nextKey ? 'Next Project: ' + projectContent[nextKey].title : 'Next Project';

    var slidesHtml = sharedGallery
      .map(function (image, idx) {
        var fitClass = image.fit === 'cover' ? 'project-media--cover' : 'project-media--contain';
        return (
          '<figure class="project-slide' + (idx === 0 ? ' is-active' : '') + '" role="group" aria-roledescription="slide" aria-label="' + (idx + 1) + ' of ' + sharedGallery.length + '"' + (idx === 0 ? '' : ' aria-hidden="true"') + '>' +
            '<img src="' + image.src + '" alt="' + data.title + ' - ' + image.altSuffix + '" class="' + fitClass + '" />' +
            '<figcaption>' + image.caption + '</figcaption>' +
          '</figure>'
        );
      })
      .join('');

    var dotsHtml = sharedGallery
      .map(function (image, idx) {
        return '<button type="button" class="project-carousel-dot' + (idx === 0 ? ' is-active' : '') + '" data-slide-dot="' + idx + '" aria-label="Go to slide ' + (idx + 1) + ': ' + image.caption + '" aria-current="' + (idx === 0 ? 'true' : 'false') + '"></button>';
      })
      .join('');

    container.innerHTML =
      '<header class="project-page-intro">' +
        '<h1 class="project-page-title">' + data.title + '</h1>' +
        '<p class="project-page-meta">Role: ' + data.role + ' | Team: ' + data.team + ' | Dates: ' + data.dates + '</p>' +
        '<p class="project-page-summary">' + data.summary + '</p>' +
      '</header>' +
      '<section class="project-carousel" aria-label="Project gallery for ' + data.title + '" tabindex="0">' +
        '<div class="project-carousel-viewport">' +
          '<button type="button" class="project-carousel-arrow project-carousel-arrow--prev" data-slide-nav="prev" aria-label="Previous slide">&#8249;</button>' +
          '<button type="button" class="project-carousel-arrow project-carousel-arrow--next" data-slide-nav="next" aria-label="Next slide">&#8250;</button>' +
          slidesHtml +
        '</div>' +
        '<div class="project-carousel-controls">' +
          '<div class="project-carousel-center">' +
            '<p class="project-carousel-counter" aria-live="polite" aria-atomic="true">1 of ' + sharedGallery.length + '</p>' +
            '<div class="project-carousel-dots" role="tablist" aria-label="Slide picker">' + dotsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="project-page-section">' +
        '<h2>Problem</h2>' +
        '<p>' + data.problem + '</p>' +
      '</section>' +
      '<section class="project-page-section">' +
        '<h2>My Action</h2>' +
        '<p>' + data.action + '</p>' +
      '</section>' +
      '<section class="project-page-section">' +
        '<h2>Process</h2>' +
        '<p>' + data.process + '</p>' +
      '</section>' +
      '<section class="project-page-section">' +
        '<h2>Outcome</h2>' +
        '<p>' + data.outcome + '</p>' +
      '</section>' +
      '<nav class="project-page-footer-nav" aria-label="Project page navigation">' +
        '<button type="button" class="project-page-nav-btn" data-project-nav="prev"' + (prevKey ? '' : ' disabled') + '>' + prevLabel + '</button>' +
        '<button type="button" class="project-page-nav-btn" data-project-nav="next"' + (nextKey ? '' : ' disabled') + '>' + nextLabel + '</button>' +
      '</section>';
  }

  function navigateProjectFromKey(currentKey, direction) {
    var currentIndex = projectOrder.indexOf(currentKey);
    if (currentIndex === -1) return;
    var nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= projectOrder.length) return;
    var targetKey = projectOrder[nextIndex];
    var targetMenuItem = document.querySelector('.about-projects-subitem[data-about-tab="' + targetKey + '"]');
    if (targetMenuItem) {
      targetMenuItem.click();
      var targetPanel = document.getElementById('about-panel-' + targetKey);
      if (targetPanel) targetPanel.scrollTop = 0;
    }
  }

  function initCarousel(carousel) {
    if (!carousel) return;

    var slides = carousel.querySelectorAll('.project-slide');
    var dots = carousel.querySelectorAll('.project-carousel-dot');
    var counter = carousel.querySelector('.project-carousel-counter');
    var prevBtn = carousel.querySelector('[data-slide-nav="prev"]');
    var nextBtn = carousel.querySelector('[data-slide-nav="next"]');
    var viewport = carousel.querySelector('.project-carousel-viewport');
    var current = 0;
    var total = slides.length;
    var startX = null;
    var startY = null;
    var autoplayTimer = null;
    var AUTOPLAY_MS = 4500;

    if (!total) return;

    function stopAutoplay() {
      if (!autoplayTimer) return;
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(function () {
        setSlide(current + 1);
      }, AUTOPLAY_MS);
    }

    function setSlide(index) {
      var normalized = (index + total) % total;
      current = normalized;

      slides.forEach(function (slide, idx) {
        var isActive = idx === normalized;
        slide.classList.toggle('is-active', isActive);
        if (isActive) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach(function (dot, idx) {
        var isActive = idx === normalized;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (counter) {
        counter.textContent = (normalized + 1) + ' of ' + total;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        setSlide(current - 1);
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        setSlide(current + 1);
        startAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-slide-dot'));
        if (!Number.isNaN(index)) {
          setSlide(index);
          startAutoplay();
        }
      });
    });

    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSlide(current + 1);
        startAutoplay();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlide(current - 1);
        startAutoplay();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setSlide(0);
        startAutoplay();
      }
      if (e.key === 'End') {
        e.preventDefault();
        setSlide(total - 1);
        startAutoplay();
      }
    });

    if (viewport) {
      viewport.addEventListener('mouseenter', stopAutoplay);
      viewport.addEventListener('mouseleave', startAutoplay);
      viewport.addEventListener('focusin', stopAutoplay);
      viewport.addEventListener('focusout', startAutoplay);
      viewport.addEventListener('touchstart', stopAutoplay, { passive: true });
      viewport.addEventListener('touchend', startAutoplay, { passive: true });
    }

    carousel.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches.length) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      if (startX === null || startY === null || !e.changedTouches || !e.changedTouches.length) return;
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      var diffX = endX - startX;
      var diffY = endY - startY;
      startX = null;
      startY = null;
      if (Math.abs(diffX) < 40 || Math.abs(diffX) < Math.abs(diffY)) return;
      if (diffX < 0) {
        setSlide(current + 1);
      } else {
        setSlide(current - 1);
      }
      startAutoplay();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    setSlide(0);
    startAutoplay();
  }

  var containers = document.querySelectorAll('.project-page[data-project-key]');
  containers.forEach(function (container) {
    var key = container.getAttribute('data-project-key');
    if (!key || !projectContent[key]) return;
    renderProjectPage(container, key, projectContent[key]);
  });

  document.querySelectorAll('.project-carousel').forEach(function (carousel) {
    initCarousel(carousel);
  });

  document.querySelectorAll('.project-page-nav-btn[data-project-nav]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var direction = btn.getAttribute('data-project-nav');
      if (direction !== 'prev' && direction !== 'next') return;
      var page = btn.closest('.project-page[data-project-key]');
      if (!page) return;
      var currentKey = page.getAttribute('data-project-key');
      if (!currentKey) return;
      navigateProjectFromKey(currentKey, direction);
    });
  });
})();

/**
 * Portfolio PDF export: layout matches project pages (html2pdf + clone). Order: Bio, then project categories.
 */
(function () {
  'use strict';

  function stripCloneIds(root) {
    root.querySelectorAll('[id]').forEach(function (el) {
      el.removeAttribute('id');
    });
  }

  function cloneForPdf(node) {
    if (!node) return null;
    var c = node.cloneNode(true);
    stripCloneIds(c);
    return c;
  }

  function waitForImages(container) {
    var imgs = container.querySelectorAll('img');
    var promises = [];
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.complete) continue;
      promises.push(
        new Promise(function (resolve) {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
      );
    }
    return promises.length ? Promise.all(promises) : Promise.resolve();
  }

  function removeExportShell(shell) {
    if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
  }

  function exportPortfolioPdf() {
    var html2pdfFn = typeof window.html2pdf === 'function' ? window.html2pdf : null;
    if (!html2pdfFn) {
      window.alert('PDF export could not load. Please refresh and try again.');
      return;
    }

    var aboutContent = document.querySelector('#about-panel-about .card-section-about-content');
    var projectCategories = [
      {
        heading: 'CAD & Mechanical Design',
        selectors: [
          '#about-panel-hip-implant .card-section-content',
          '#about-panel-bone-modeling .card-section-content',
          '#about-panel-bmen-207 .card-section-content'
        ]
      },
      {
        heading: 'Software, Data & ML',
        selectors: [
          '#about-panel-hospital-prediction .card-section-content',
          '#about-panel-scraper .card-section-content',
          '#about-panel-ai-protein .card-section-content'
        ]
      },
      {
        heading: 'Prototypes',
        selectors: [
          '#about-panel-medbuddy .card-section-content',
          '#about-panel-canine-wearable .card-section-content',
          '#about-panel-robotic-leg .card-section-content'
        ]
      }
    ];

    var shell = document.createElement('div');
    shell.className = 'portfolio-pdf-export-shell';
    shell.setAttribute('aria-hidden', 'true');

    var root = document.createElement('div');
    root.className = 'portfolio-pdf-export-root';

    var title = document.createElement('h1');
    title.className = 'portfolio-pdf-main-title';
    title.textContent = 'Portfolio';
    root.appendChild(title);

    function addSection(heading, contentNodes) {
      var section = document.createElement('section');
      section.className = 'portfolio-pdf-section';
      var h2 = document.createElement('h2');
      h2.className = 'portfolio-pdf-section-title';
      h2.textContent = heading;
      section.appendChild(h2);
      (Array.isArray(contentNodes) ? contentNodes : [contentNodes]).forEach(function (contentNode) {
        var cloned = cloneForPdf(contentNode);
        if (cloned) {
          cloned.classList.remove('card-section-content--scroll');
          section.appendChild(cloned);
        }
      });
      root.appendChild(section);
    }

    addSection('Bio', aboutContent);
    projectCategories.forEach(function (category) {
      var nodes = category.selectors.map(function (sel) {
        return document.querySelector(sel);
      });
      addSection(category.heading, nodes);
    });

    shell.appendChild(root);
    document.body.appendChild(shell);

    var btn = document.getElementById('portfolio-export-pdf');
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    }

    function runPdf() {
      var opt = {
        margin: [10, 10, 10, 10],
        filename: 'portfolio.pdf',
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.project-block', 'figure', 'img'] }
      };

      var worker = html2pdfFn().set(opt).from(root);
      var savePromise = worker.save();
      if (!savePromise || typeof savePromise.then !== 'function') {
        removeExportShell(shell);
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
        }
        window.alert('PDF export failed to start. Please refresh and try again.');
        return;
      }
      savePromise
        .then(function () {
          removeExportShell(shell);
        })
        .catch(function () {
          removeExportShell(shell);
          window.alert('Could not create the PDF. Try again or check your network connection.');
        })
        .then(function () {
          if (btn) {
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
          }
        });
    }

    waitForImages(root)
      .then(function () {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              setTimeout(resolve, 50);
            });
          });
        });
      })
      .then(function () {
        runPdf();
      })
      .catch(function () {
        removeExportShell(shell);
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
        }
      });
  }

  var exportBtn = document.getElementById('portfolio-export-pdf');
  if (exportBtn) {
    exportBtn.addEventListener('click', function (e) {
      e.preventDefault();
      exportPortfolioPdf();
    });
  }
})();

/**
 * Time-of-day background: sky blue (day) to black (night), eggshell card by day.
 * Sun moves across sky during day; moon moves at night with phase by date.
 * Sunrise 5–7, Day 7–17, Sunset 17–20, Night 20–5 (24h).
 */
(function () {
  'use strict';

  var DAY_BG = [135, 206, 235];   /* sky blue */
  var NIGHT_BG = [18, 18, 22];
  var SUNRISE_START = 5;
  var SUNRISE_END = 7;
  var SUNSET_START = 17;
  var SUNSET_END = 20;
  var UPDATE_MS = 60000;
  var WEATHER_CACHE_KEY = 'portfolio_weather_cache';
  var WEATHER_CACHE_MS = 60 * 60 * 1000; /* 60 minutes */

  function getCachedWeather() {
    try {
      var raw = localStorage.getItem(WEATHER_CACHE_KEY);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (Date.now() - cached.fetchedAt > WEATHER_CACHE_MS) return null;
      return cached;
    } catch (e) {
      return null;
    }
  }

  function setCachedWeather(cloudy, rain, snow, thunder) {
    try {
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
        cloudy: cloudy,
        rain: rain,
        snow: snow,
        thunder: thunder,
        fetchedAt: Date.now()
      }));
    } catch (e) {}
  }

  function applyWeatherEffects(cached) {
    document.body.classList.toggle('sky-cloudy', cached.cloudy);
    document.body.classList.toggle('sky-rain', cached.rain);
    document.body.classList.toggle('sky-snow', cached.snow);
    document.body.classList.toggle('sky-thunder', cached.thunder);
    updatePrecipitationParticles(cached.rain, cached.snow);
  }

  function updatePrecipitationParticles(rain, snow) {
    var rainEl = document.getElementById('sky-rain');
    var snowEl = document.getElementById('sky-snow');
    if (rainEl) {
      rainEl.innerHTML = '';
      if (rain) {
        for (var i = 0; i < 55; i++) {
          var drop = document.createElement('div');
          drop.className = 'rain-drop';
          drop.style.left = Math.random() * 100 + '%';
          drop.style.animationDuration = (0.6 + Math.random() * 0.5) + 's';
          drop.style.animationDelay = Math.random() * 0.5 + 's';
          rainEl.appendChild(drop);
        }
      }
    }
    if (snowEl) {
      snowEl.innerHTML = '';
      if (snow) {
        for (var j = 0; j < 45; j++) {
          var flake = document.createElement('div');
          flake.className = 'snow-flake';
          flake.style.left = Math.random() * 100 + '%';
          flake.style.animationDuration = (3 + Math.random() * 4) + 's';
          flake.style.animationDelay = Math.random() * 2 + 's';
          snowEl.appendChild(flake);
        }
      }
    }
  }

  function fetchWeatherForClouds() {
    var cached = getCachedWeather();
    if (cached !== null) {
      applyWeatherEffects(cached);
      return;
    }
    if (!navigator.geolocation) {
      fetchWeatherWithCoords(52.52, 13.41);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        fetchWeatherWithCoords(position.coords.latitude, position.coords.longitude);
      },
      function () {
        /* Permission denied or unavailable: use default location so weather still loads */
        fetchWeatherWithCoords(52.52, 13.41);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  function fetchWeatherWithCoords(lat, lon) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + encodeURIComponent(lat) + '&longitude=' + encodeURIComponent(lon) + '&current=rain,cloud_cover,snowfall,showers,precipitation,weather_code,precipitation_probability&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var cur = data.current;
        if (!cur) {
          clearWeatherEffects();
          return;
        }
        var cloudCover = typeof cur.cloud_cover === 'number' ? cur.cloud_cover : 0;
        var rain = typeof cur.rain === 'number' ? cur.rain : 0;
        var showers = typeof cur.showers === 'number' ? cur.showers : 0;
        var precipitation = typeof cur.precipitation === 'number' ? cur.precipitation : 0;
        var snowfall = typeof cur.snowfall === 'number' ? cur.snowfall : 0;
        var weatherCode = typeof cur.weather_code === 'number' ? cur.weather_code : 0;
        var precipProb = typeof cur.precipitation_probability === 'number' ? cur.precipitation_probability : 0;
        var hasRain = rain > 0 || showers > 0 || (precipitation > 0 && snowfall === 0);
        var hasSnow = snowfall > 0;
        var hasThunder = (weatherCode >= 95 && weatherCode <= 99) || precipProb >= 70;
        var cloudy = cloudCover >= 40 || hasRain || hasSnow || hasThunder;
        setCachedWeather(cloudy, hasRain, hasSnow, hasThunder);
        applyWeatherEffects({ cloudy: cloudy, rain: hasRain, snow: hasSnow, thunder: hasThunder });
      })
      .catch(function () {
        clearWeatherEffects();
      });
  }

  function clearWeatherEffects() {
    document.body.classList.remove('sky-cloudy', 'sky-rain', 'sky-snow', 'sky-thunder');
    updatePrecipitationParticles(false, false);
  }

  function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function rgbString(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function getBackgroundColor() {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    var r, g, b;

    if (h >= SUNRISE_END && h < SUNSET_START) {
      r = DAY_BG[0];
      g = DAY_BG[1];
      b = DAY_BG[2];
    } else if (h >= SUNSET_END || h < SUNRISE_START) {
      r = NIGHT_BG[0];
      g = NIGHT_BG[1];
      b = NIGHT_BG[2];
    } else if (h >= SUNRISE_START && h < SUNRISE_END) {
      var t = (h - SUNRISE_START) / (SUNRISE_END - SUNRISE_START);
      r = lerp(NIGHT_BG[0], DAY_BG[0], t);
      g = lerp(NIGHT_BG[1], DAY_BG[1], t);
      b = lerp(NIGHT_BG[2], DAY_BG[2], t);
    } else {
      var tSunset = (h - SUNSET_START) / (SUNSET_END - SUNSET_START);
      r = lerp(DAY_BG[0], NIGHT_BG[0], tSunset);
      g = lerp(DAY_BG[1], NIGHT_BG[1], tSunset);
      b = lerp(DAY_BG[2], NIGHT_BG[2], tSunset);
    }
    return rgbString(r, g, b);
  }

  /* Lunar phase 0 = new, 0.5 = full, 1 = new again (29.53-day cycle) */
  function getLunarPhase(date) {
    var jd = date.getTime() / 86400000 + 2440587.5;
    var lunarAge = ((jd - 2451550.1) % 29.530588853 + 29.530588853) % 29.530588853;
    return lunarAge / 29.530588853;
  }

  /* Sun position: arc from sunrise (5) to sunset (20), high at solar noon */
  function getSunPosition(h) {
    if (h < SUNRISE_START || h >= SUNSET_END) return null;
    var dayLength = SUNSET_END - SUNRISE_START;
    var t = (h - SUNRISE_START) / dayLength;
    var left = 10 + 80 * t;
    var top = 75 - 65 * Math.sin(Math.PI * t);
    return { left: left, top: top };
  }

  /* Moon position at night: arc from left (evening) to right (early morning) */
  function getMoonPosition(h) {
    if (h >= SUNRISE_END && h < SUNSET_END) return null;
    var nightT = h >= SUNSET_END ? h - SUNSET_END : h + (24 - SUNSET_END);
    var totalNight = (24 - SUNSET_END) + SUNRISE_START;
    if (nightT >= totalNight) nightT -= totalNight;
    var t = nightT / totalNight;
    var left = 10 + 80 * t;
    var top = 75 - 65 * Math.sin(Math.PI * t);
    return { left: left, top: top };
  }

  function updateBackground() {
    var now = new Date();
    var h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    var isNight = h >= SUNSET_END || h < SUNRISE_START;

    document.documentElement.style.setProperty('--page-bg', getBackgroundColor());

    if (isNight) {
      document.body.classList.remove('day-mode');
      document.body.classList.remove('sky-cloudy');
      document.body.classList.add('stars-visible');
      fetchWeatherForClouds();
      createStarsOnce();
      scheduleShootingStar();
      /* Moon position and phase */
      var moonPos = getMoonPosition(h);
      var moon = document.getElementById('moon');
      var mask = document.getElementById('moon-phase-mask');
      if (moon && moonPos) {
        moon.style.left = moonPos.left + '%';
        moon.style.top = moonPos.top + '%';
      }
      if (mask) {
        var phase = getLunarPhase(now);
        var maskX = phase <= 0.5 ? 2 * phase * 100 : (2 - 2 * phase) * 100;
        mask.style.transform = 'translateX(' + maskX + '%)';
      }
    } else {
      document.body.classList.add('day-mode');
      document.body.classList.remove('stars-visible');
      cancelShootingStar();
      fetchWeatherForClouds();
      /* Sun position (visible during sunrise, day, and sunset 5–20) */
      var sunPos = getSunPosition(h);
      var sun = document.getElementById('sun');
      if (sun) {
        if (sunPos) {
          sun.style.left = sunPos.left + '%';
          sun.style.top = sunPos.top + '%';
        }
      }
    }
  }

  var shootingStarTimeout = null;

  function scheduleShootingStar() {
    if (!document.body.classList.contains('stars-visible')) return;
    var delay = 18000 + Math.random() * 27000; // 18–45 seconds
    shootingStarTimeout = setTimeout(function () {
      showShootingStar();
      if (document.body.classList.contains('stars-visible')) {
        scheduleShootingStar();
      }
    }, delay);
  }

  function cancelShootingStar() {
    if (shootingStarTimeout) {
      clearTimeout(shootingStarTimeout);
      shootingStarTimeout = null;
    }
    var container = document.getElementById('shooting-stars');
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);
    }
  }

  function showShootingStar() {
    var container = document.getElementById('shooting-stars');
    if (!container) return;

    var streak = document.createElement('div');
    streak.className = 'shooting-star';
    streak.style.left = (70 + Math.random() * 25) + '%';
    streak.style.top = (-5 + Math.random() * 20) + '%';
    container.appendChild(streak);

    setTimeout(function () {
      if (streak.parentNode) streak.parentNode.removeChild(streak);
    }, 1500);
  }

  function createStarsOnce() {
    var container = document.getElementById('stars');
    if (!container || container.querySelector('.star')) return;

    var count = 70;
    for (var i = 0; i < count; i++) {
      var star = document.createElement('span');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 12 + 's';
      star.style.animationDuration = (8 + Math.random() * 6) + 's';
      container.appendChild(star);
    }
  }

  updateBackground();
  setInterval(updateBackground, UPDATE_MS);
})();
