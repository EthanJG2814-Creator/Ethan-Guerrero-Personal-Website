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

  var projectGalleries = {
    'hip-implant': [
      {
        src: './assets/hip_implant/image_1.png',
        caption: 'Segmented femur geometry prepared from CT scan data',
        altSuffix: 'segmented femur geometry from CT data',
        fit: 'contain'
      },
      {
        src: './assets/hip_implant/image_2.png',
        caption: 'Hip implant alignment and cavity preparation within the femur model',
        altSuffix: 'hip implant alignment within femur model',
        fit: 'contain'
      },
      {
        src: './assets/hip_implant/image_3.png',
        caption: 'Finite element simulation view for implant and bone stress analysis',
        altSuffix: 'finite element simulation stress analysis view',
        fit: 'contain'
      },
      {
        src: './assets/hip_implant/image_4.png',
        caption: 'Post-processed stress comparison across femur sections and implant cases',
        altSuffix: 'stress comparison across femur sections',
        fit: 'contain'
      }
    ],
    'bone-modeling': [
      {
        src: './assets/bone/image_1.png',
        caption: 'Bone-plate configurations prepared for theoretical and simulated comparison',
        altSuffix: 'bone plate configuration comparison',
        fit: 'contain'
      },
      {
        src: './assets/bone/image_2.png',
        caption: 'SolidWorks simulation setup for bending stress evaluation',
        altSuffix: 'SolidWorks bending stress simulation setup',
        fit: 'contain'
      },
      {
        src: './assets/bone/image_3.png',
        caption: 'Physical three-point bending test workflow and data collection setup',
        altSuffix: 'three point bending test setup',
        fit: 'contain'
      },
      {
        src: './assets/bone/image_4.png',
        caption: 'Final comparison of theoretical, simulated, and measured stress results',
        altSuffix: 'final stress comparison results',
        fit: 'contain'
      }
    ],
    'bmen-207': [
      {
        src: './assets/solidworks/1020_carbon_steel_stress_without_mesh.png',
        caption: 'SolidWorks Simulation stress study for a carbon steel part',
        altSuffix: 'carbon steel stress simulation',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/1060_alloy_withoutmesh_screenshot.png',
        caption: 'Simulation result used to compare stress behavior across material choices',
        altSuffix: 'alloy stress simulation comparison',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/BMEN_207_CAD_EXam.png',
        caption: 'Course CAD exam drawing demonstrating dimensioned design communication',
        altSuffix: 'CAD exam engineering drawing',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/BMEN_207_CAD_EXam_parat_screenshot.png',
        caption: 'Part model from the BMEN 207 CAD exam exercise',
        altSuffix: 'CAD exam part model',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/Battery_box_for_circuit_screenshot.png',
        caption: 'Battery enclosure model created for a circuit-board housing concept',
        altSuffix: 'battery enclosure model for circuit board',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/Battery_box_part_screenshot.png',
        caption: 'Parametric battery box part with functional clearances and lid geometry',
        altSuffix: 'parametric battery box part model',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/Screenshot_full_camera.png',
        caption: 'Full camera assembly showing how multiple CAD parts integrate together',
        altSuffix: 'full camera assembly view',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/Screensot_of_front_camera_part.png',
        caption: 'Front camera component model developed as part of a multi-part assembly',
        altSuffix: 'front camera part model',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/battery_box_assembled_circuit_board_screenshot.png',
        caption: 'Battery box assembly with internal circuit-board fit and fastening features',
        altSuffix: 'battery box assembly with circuit board',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/exploded_viewof_assembley_batter_box_circuit_board_screenshot.png',
        caption: 'Exploded view showing assembly structure and part relationships',
        altSuffix: 'exploded assembly view',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/pressure_plate_screenshot.png',
        caption: 'Pressure plate model demonstrating manufacturing-ready feature design',
        altSuffix: 'pressure plate CAD model',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/screenshot_back_camera_part_CAD.png',
        caption: 'Back camera component modeled with dimensioned mechanical features',
        altSuffix: 'back camera part CAD model',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/screenshot_circuit_board_drawing.png',
        caption: 'Engineering drawing used to communicate board dimensions and tolerances',
        altSuffix: 'circuit board engineering drawing',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/screenshot_font_camera_part_CAD.png',
        caption: 'Detailed CAD view for the front camera component geometry',
        altSuffix: 'front camera component geometry view',
        fit: 'contain'
      },
      {
        src: './assets/solidworks/screenshot_full_camera_part_CAD.png',
        caption: 'Integrated camera part composition used to practice assembly design',
        altSuffix: 'integrated camera part composition',
        fit: 'contain'
      }
    ],
    scraper: [
      {
        src: './assets/scraper/image_1.png',
        caption: 'Scraper pipeline overview for extracting and structuring source data',
        altSuffix: 'scraper pipeline overview',
        fit: 'contain'
      },
      {
        src: './assets/scraper/image_2.png',
        caption: 'Parsed output and validation view for the scraping workflow',
        altSuffix: 'scraper output validation view',
        fit: 'contain'
      }
    ],
    'ai-protein': [
      {
        src: './assets/protein/image_1.png',
        caption: 'Project overview for the AI protein algorithm pipeline',
        altSuffix: 'AI protein project overview',
        fit: 'contain'
      },
      {
        src: './assets/protein/image_2.png',
        caption: 'Model design and feature-processing workflow for protein analysis',
        altSuffix: 'protein model and feature workflow',
        fit: 'contain'
      },
      {
        src: './assets/protein/image_3.png',
        caption: 'Training and validation comparison for candidate algorithm variants',
        altSuffix: 'training and validation comparison chart',
        fit: 'contain'
      },
      {
        src: './assets/protein/image_4.png',
        caption: 'Evaluation metrics view highlighting precision and recall behavior',
        altSuffix: 'evaluation metrics view',
        fit: 'contain'
      },
      {
        src: './assets/protein/image_5.png',
        caption: 'Final results visual summarizing algorithm performance outcomes',
        altSuffix: 'final AI protein results visual',
        fit: 'contain'
      }
    ],
    'hospital-prediction': [
      {
        src: './assets/Hospital_prediction/image_1.png',
        caption: 'Project overview slide introducing the hospital readmission prediction workflow',
        altSuffix: 'project overview slide',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_2.png',
        caption: 'Dataset breakdown and feature review used during exploratory analysis',
        altSuffix: 'dataset breakdown and feature review',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_3.png',
        caption: 'Model comparison visual summarizing training and validation performance',
        altSuffix: 'model comparison visual',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_4.png',
        caption: 'Confusion-matrix and metrics view for diabetic readmission classes',
        altSuffix: 'confusion matrix and metrics view',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_5.png',
        caption: 'ROC and class-level evaluation figure for multiclass model performance',
        altSuffix: 'ROC and class evaluation figure',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_6.png',
        caption: 'Results summary slide highlighting top model accuracy and baseline gains',
        altSuffix: 'results summary slide',
        fit: 'contain'
      },
      {
        src: './assets/Hospital_prediction/image_7.png',
        caption: 'Final presentation poster consolidating process, modeling, and outcomes',
        altSuffix: 'final hospital prediction poster',
        fit: 'contain'
      }
    ],
    medbuddy: [
      {
        src: './assets/MedBuddy_Images/image_1.png',
        caption: 'Patient journey map for the medication adherence workflow',
        altSuffix: 'patient journey workflow diagram',
        fit: 'contain'
      },
      {
        src: './assets/MedBuddy_Images/image_2.png',
        caption: 'Problem framing slide with key medication nonadherence statistics',
        altSuffix: 'problem framing slide with adherence statistics',
        fit: 'contain'
      },
      {
        src: './assets/MedBuddy_Images/image_3.png',
        caption: 'RFID tag casing and chip concept used in the prototype',
        altSuffix: 'RFID casing and chip concept',
        fit: 'contain'
      },
      {
        src: './assets/MedBuddy_Images/image_4.png',
        caption: 'Early product flow sketch for the app and reminder system',
        altSuffix: 'early product flow sketch',
        fit: 'contain'
      },
      {
        src: './assets/MedBuddy_Images/image_5.png',
        caption: 'Final MedBuddy presentation poster with system architecture and results',
        altSuffix: 'final MedBuddy project poster',
        fit: 'contain'
      }
    ],
    'canine-wearable': [
      {
        src: './assets/Canine_images/IMG_0529.JPG',
        caption: 'Team photo from the VEST project presentation and showcase',
        altSuffix: 'team presentation photo',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/IMG_7097.JPG',
        caption: 'Prototype assembly session with onboard electronics and fabric integration',
        altSuffix: 'prototype assembly session',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/IMG_7431.JPG',
        caption: 'Prototype vest mounted on the canine test form during hardware integration',
        altSuffix: 'vest prototype on canine test form',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/IMG_7435.JPG',
        caption: 'Bench setup for electronics placement, wiring, and enclosure checks',
        altSuffix: 'electronics bench setup and wiring checks',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/Screenshot_2026-02-17_at_12.30.43_AM.PNG',
        caption: 'Final project poster highlighting validation, architecture, and outcomes',
        altSuffix: 'project poster overview',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/image_1.png',
        caption: 'Vest design progression from earlier concepts to the current iteration',
        altSuffix: 'vest design progression diagram',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/image_2.png',
        caption: 'Protective casing drawings for the ESP32 enclosure design',
        altSuffix: 'protective casing design drawings',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/image_3.png',
        caption: 'System architecture showing sensors, microcontroller, phone, and cloud flow',
        altSuffix: 'system architecture diagram',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/image_4.png',
        caption: 'Expanded flat-layout concept showing electronics placement across the vest',
        altSuffix: 'flat layout concept diagram',
        fit: 'contain'
      },
      {
        src: './assets/Canine_images/image_5.png',
        caption: 'Final poster summarizing the wearable vest concept, validation, and outcomes',
        altSuffix: 'final canine wearable poster',
        fit: 'contain'
      }
    ],
    'robotic-leg': [
      {
        src: './assets/ANKL/image_1.png',
        caption: 'System concept slide for the six-degree-of-freedom prosthetic ankle design',
        altSuffix: 'prosthetic ankle concept slide',
        fit: 'contain'
      },
      {
        src: './assets/ANKL/image_2.png',
        caption: 'Mechanical layout or kinematic view used during design development',
        altSuffix: 'mechanical layout and kinematic view',
        fit: 'contain'
      },
      {
        src: './assets/ANKL/image_3.png',
        caption: 'Prototype hardware view showing assembly details for the ANKL system',
        altSuffix: 'prototype hardware assembly view',
        fit: 'contain'
      },
      {
        src: './assets/ANKL/image_4.png',
        caption: 'Final results or presentation visual summarizing the robotic leg prototype',
        altSuffix: 'final robotic leg presentation visual',
        fit: 'contain'
      }
    ]
  };

  var projectContent = {
    'hip-implant': {
      title: 'Hip Implant Project',
      role: 'Student',
      team: 'Biomechanics Design',
      dates: 'Nov 2025',
      summary: 'This BMEN 457 project used CT scan data to build a finite element model of a femur, comparing stress distribution with and without a hip implant across two different implant stiffnesses (80 GPa and 25 GPa). The workflow spanned segmentation in 3D Slicer, mesh generation and simulation in FEBio Studio, and a custom Python post-processing algorithm that mapped stress data to 20 height-based sections of the bone to compare tensile and compressive stress behavior between the intact femur and implant scenarios.',
      problem: 'Predicting how a hip implant redistributes mechanical stress within a femur requires accurately reconstructing patient-specific bone geometry from CT scans and correctly modeling the bone-implant interaction across different implant stiffnesses. This project addressed that need by segmenting a femur from CT DICOM data, hollowing it to fit a hip implant, and running finite element simulations comparing stress distribution in the intact femur versus femurs fitted with two implants of differing Youngs moduli (80 GPa and 25 GPa) against a bone modulus of 20 GPa.',
      action: 'I processed CT DICOM images in 3D Slicer using a gradient anisotropic diffusion filter, threshold-based segmentation, and smoothing operations to isolate the femur, then subtracted the implant geometry to create an internal cavity for hip-implant placement. After the implant snapped to an incorrect orientation when merged into the femurs transform hierarchy, I created a separate transform node and manually adjusted rotation and translation values until the implant properly mated with the bone cavity.',
      process: 'In FEBio Studio, I generated tetrahedral meshes for the femur and implant using TetGen, refined them with MMG Remesh, and partitioned key surfaces to apply isotropic elastic material properties (bone: 20 GPa; implants: 80 GPa and 25 GPa, 0.3 Poissons ratio each) before running simulations with a z-direction nodal load and tied elastic contact. I then wrote a Python algorithm to parse the .feb node data, divide the femur into 20 height-based sections, and calculate peak and average tensile/compressive stress per section from the exported CSV stress data.',
      outcome: 'The stiffer 80 GPa implant reduced peak compressive stress in the surrounding bone to roughly -150 to -300 MPa across the 20 sections, compared with approximately -400 to -580 MPa in the implant-free femur, indicating substantial load-sharing by the harder implant. The softer 25 GPa implant instead produced more stress spikes and less consistent load transfer, with results across all three cases showing added noise due to the lack of an automated implant-alignment tool in the FEA software.'
    },
    'bone-modeling': {
      title: 'Bone Modeling Lab',
      role: 'Computational Modeling Team Member',
      team: 'Biomedical Simulation Lab',
      dates: 'Jan 2024 - May 2024',
      summary: 'This BMEN 361 lab investigated which bone-plate configuration—Bone Only, Single Plate, or Double Plate—most effectively minimizes bending stress in a fractured bone construct, using theoretical calculations, SolidWorks simulations, and physical three-point bending tests. The Double Plate configuration proved most effective, showing the lowest maximum normal stress (2.120–2.470 MPa) and the smallest percent errors (1.79%–14.41%) across all three evaluation methods',
      problem: 'Selecting the optimal bone-plate configuration is critical for stabilizing fractured bones, since excess bending stress at the fracture site can impair proper healing, yet it was unclear whether a single-plate or double-plate configuration would better minimize that stress. This study addressed that gap by testing three 3D-printed PLA bone constructs—Bone Only, Single Plate, and Double Plate—under a three-point bending test with forces applied up to 1000 N at a rate of 20 mm/min, then comparing the results against theoretical and SolidWorks-simulated bending stress values.',
      action: 'I helped fabricate three 3D-printed PLA bone constructs to the same target dimensions (100 mm bone length, 25 mm outer diameter, 13 mm inner diameter, with 16 mm-wide by 5 mm-tall plates), then measured each construct against these ideal values to verify print accuracy before testing. Using a Labthink Mechanical Auto Tensile Tester, I ran three-point bending tests on all three configurations, applying force at a 20 mm/min test speed until each construct fractured or reached the 1000 N load limit, and recorded force-versus-displacement data to calculate real-world bending stress for each case. I also built a SolidWorks simulation for each configuration, applying a 7.5 Nm internal torque with roller-and-hinge boundary conditions, and performed the theoretical bending-stress calculations using the flexure formula, moment of inertia, and neutral-axis equations to establish an analytical baseline for comparison.',
      process: 'To validate the experimental and simulated results, I calculated the maximum bending stress for each construct using the flexure formula, which required first computing the sections moment of inertia and neutral-axis location from segment areas and centroid distances. I then compared these theoretical stresses against the SolidWorks simulation outputs and the experimentally measured stresses across all three configurations: Bone Only (5.275 MPa theoretical vs. 4.561 MPa simulated vs. 3.971 MPa physical), Single Plate (3.390 vs. 2.052 vs. 2.895 MPa), and Double Plate (2.426 vs. 2.470 vs. 2.120 MPa). This three-way comparison allowed the team to calculate percent error between methods for each configuration and identify which plate design most consistently reduced bending stress across theoretical, simulated, and physical evaluation approaches.',
      outcome: 'Across all three evaluation methods, the Double Plate configuration consistently produced the lowest maximum normal stress values (2.120–2.470 MPa) and the smallest percent errors (1.790%–14.412%), confirming that a double-plate design provides superior load distribution and mechanical stability for fractured bone stabilization. By contrast, the Single Plate and Bone Only configurations showed notably higher stresses (2.052–5.275 MPa) and greater inconsistency between methods, with percent errors reaching as high as 65.228%, largely due to the plates being glued rather than bolted to the constructs. The convergence of theoretical, simulated, and physical results around the Double Plate configuration provided strong, multi-method evidence supporting its use as the more effective bone-plate design, with future work aimed at bolting the plates and standardizing PLA fill density to reduce testing variability.'
    },
    'bmen-207': {
      title: 'Solidworks Project',
      role: 'Stuedent',
      team: 'BMEN 207: Computer-Aided Design',
      dates: 'Aug 2023 - October 2023',
      sections: [
        {
          title: 'What I Learned',
          body: 'Through BMEN 207, I developed SolidWorks skills in creating parametric 3D parts, multi-part assemblies, exploded views, and manufacturing-ready engineering drawings for biomedical and electromechanical applications. I modeled functional components such as a battery enclosure with a removable lid, internal battery and circuit-board clearances, corner fasteners, and dimensioned tolerances. I also used SolidWorks Simulation to apply forces and fixed constraints to CAD models, evaluate von Mises stress and part deflection, identify high-stress regions, and compare simulated stress results with a material\'s yield strength to assess whether a design could withstand an applied load.'
        }
      ]
    },
    'hospital-prediction': {
      title: 'Hospital Prediction',
      role: 'Student',
      team: 'Indivudal Project',
      dates: 'March 2026',
      summary: 'This BMEN 351 project developed and compared four machine learning models—KNN, Random Forest, Multinomial Logistic Regression, and a sequential neural network—to predict whether diabetic patients would be readmitted to the hospital within 30 days, after 30 days, or not at all. Using a dataset of 101,766 hospital encounters from 130 U.S. hospitals, the project produced a top-performing Multinomial Logistic Regression model with 74.70% test accuracy, well above the majority-class baseline of 53.9%.',
      problem: 'As of 2026, 40.1 million Americans have diabetes and 115.2 million have prediabetes, and diabetes-related care costs U.S. hospitals between $412.9 billion and $640 billion annually. Diabetes accounts for roughly 25% of all hospitalizations between 2000 and 2018, straining hospital budgets, staffing, and resource allocation. There is a need for a predictive model that can classify diabetic patients into three readmission categories—no readmission (53.9% of cases), readmission after 30 days (34.9%), and readmission within 30 days (11.2%)—so hospitals can better anticipate patient volume and allocate resources accordingly.',
      action: 'I used the Diabetes 130-US Hospitals dataset from the UCI Machine Learning Repository, containing 101,766 hospital encounters collected from 130 U.S. hospitals and integrated delivery networks between 1999 and 2008, to build a multiclass readmission-prediction pipeline. I performed exploratory data analysis on class distributions, missing-data patterns (including features with up to 96.86% missingness, such as weight), demographic imbalances in race and age, and medication-usage frequency across 24 drug categories, then used these findings to guide feature selection. I removed low-value administrative identifiers and highly sparse or incomplete features, applied distribution-based imputation for race and payer code, engineered new features capturing a patients total prior encounters, and one-hot encoded all remaining categorical variables, reducing the dataset from an original shape of (101,766, 50) to a cleaned shape of (101,766, 89). I then established two baseline models—a random-sampling baseline and a majority-class baseline—to serve as performance benchmarks before training any machine learning models.',
      process: 'I designed and trained four classification models to compare neural, linear, tree-based, and distance-based approaches: a sequential neural network with two dense hidden layers (64 and 32 nodes, ReLU activation) and dropout regularization, a K-nearest neighbors model (k=25, distance-weighted), a Random Forest with 50 trees, and a Multinomial Logistic Regression model on standardized features. To address the datasets class imbalance, I applied stratified sampling for the train/validation/test split (approximately 64%/16%/20%), used class weights during neural network training, and implemented early stopping to prevent overfitting while monitoring validation loss. I evaluated all models using validation accuracy, test accuracy, macro F1 score, weighted F1 score, and log loss, then compared performance using accuracy and loss visualizations, confusion matrices, and ROC/AUC curves for each class to identify which models generalized best and where performance broke down, particularly for the minority readmission classes.',
      outcome: 'Multinomial Logistic Regression emerged as the strongest model, achieving 74.70% test accuracy and a weighted F1 score of 0.698, compared with a 53.9% majority-class baseline and a 42.65% random-sampling baseline. All four trained models outperformed both baselines and achieved NO-class AUC values around 0.87–0.88, though every model struggled to correctly classify the minority "<30" and ">30" readmission groups, highlighting class imbalance as the primary remaining challenge for future model refinement.'
    },
    scraper: {
      title: 'Scraper Project',
      role: 'Individual ',
      team: 'Personal Project',
      dates: 'May 2026 - Present',
      summary: 'This personal project involved building a Selenium-based web scraper to collect job and listing data and store it in a relational database, then applying rule-based and machine-learning categorization—including word tokenization—to automatically organize listings by role type and seniority level. The system also incorporates prompt engineering and retrieval-augmented generation (RAG) so users can search and surface listings that match their personal interests in natural language rather than relying on generic keyword filters.',
      problem: 'Most job and listing platforms rely on generic filters and vague postings that fail to clearly indicate whether a role is intended for students, entry-level candidates, or experienced professionals. With a large volume of postings available at any given time, searching for a relevant listing becomes overwhelming and often takes longer than actually applying, since users are forced to manually open and read each description before determining relevance. This project addresses that inefficiency by automating the collection, categorization, and personalized retrieval of listings so users spend less time filtering and more time acting on genuinely relevant opportunities.',
      action: 'I independently researched the tools and technical concepts needed to solve this problem, since I had no formal background in web scraping or information retrieval going into the project. Through self-directed learning, I studied Selenium for browser automation, SQL and relational database design for structured storage, regular expressions (regex) for text parsing, and the fundamentals of information retrieval to understand how to move from raw scraped text to structured, searchable data. I also learned prompt engineering and retrieval-augmented generation (RAG) so that an AI model could interpret user interests in natural language and match them against the categorized listing database, rather than relying on rigid keyword filters.',
      process: 'I approached development iteratively rather than trying to build one finished system, creating multiple smaller prototype versions to validate individual components—such as the scrapers reliability, the database schema, and the categorization logic—before combining them. This resulted in three full iterations of the program, with each version improving on the categorization pipeline: starting with simple rule-based sorting, then layering in machine-learning classification, and finally adding word tokenization so the model could interpret listing text and assign more nuanced categories (e.g., seniority level, role type) automatically. This willingness to test small, fail fast, and rebuild rather than over-engineer a single version reflects a self-taught, hands-on approach to learning unfamiliar technical domains through direct experimentation.',
      outcome: 'The final scraper reliably processes between 421 and 492 listings per hour, completing a full scraping run in 2 to 8 hours depending on the total volume of postings available at the time. Beyond the functional output, the project demonstrated the ability to independently learn and integrate five distinct technical domains—web automation, relational databases, regex-based parsing, machine learning classification, and RAG-based retrieval—into a single working pipeline without formal coursework or team support.'
    },
    'ai-protein': {
      title: 'AI Protein Algorithm',
      role: 'Undergraduate Researcher',
      team: 'Marshall University Research Lab',
      dates: 'May 2025 - Aug 2025',
      summary: 'Membrane proteins are critical drug targets, but AlphaFolds reliability in predicting their structures remains uncertain, biased, and inconsistent, making it unclear whether AlphaFold 3 represents a genuine improvement over AlphaFold 2. This project addressed that gap by building a filtering and structural-comparison pipeline that benchmarked AlphaFold 2 and AlphaFold 3 predictions against experimentally solved membrane-protein structures using quantitative metrics such as RMSD, TM-score, and pLDDT.',
      problem: 'Membrane proteins are key drug targets involved in cellular signaling, transport, and immunity, yet AlphaFolds accuracy in predicting their 3D structures remains uncertain, biased, and inconsistent. There was a need to quantitatively determine how well AlphaFold performs on membrane proteins specifically, and whether the newer AlphaFold 3 model offers a real, measurable improvement over AlphaFold 2 rather than an assumed one',
      action: 'To investigate this problem, I built a curated dataset of human, Swiss-Prot-reviewed membrane proteins containing documented 3D structures by applying a series of filters—including "membrane" keyword tagging, membrane-embedded classification, and requiring more than one documented structure—to generate a filtered protein dataset in TSV format. I then searched for corresponding AlphaFold 2 models, AlphaFold 3 models, and experimentally determined PDB structures for each protein in the filtered set, using a TM-align algorithm to align and select the highest-sequence-identity match when multiple candidate structures were available. This process produced a structured dataset of matched predicted-versus-experimental structure pairs that could be directly compared using quantitative structural metrics.',
      process: 'Once the matched structural pairs were compiled into a CSV dataset, I ran a structural-comparison analysis computing RMSD, TM-score for both protein chains, sequence identity, and mean pLDDT confidence scores for every AlphaFold 2 and AlphaFold 3 prediction. I performed statistical hypothesis testing, calculating 95% confidence intervals and p-values for the mean difference between AF2 and AF3 on each metric, and generated correlation heatmaps and frequency-distribution histograms to visualize how these metrics related to one another and how prediction quality was distributed across the dataset. This let me determine which structural differences between the two AlphaFold versions were statistically significant rather than due to random variation',
      outcome: 'The analysis found that AlphaFold 3 showed no statistically significant improvement over AlphaFold 2 in core structural accuracy metrics, with RMSD (p=0.152) and both TM-scores (p=0.318 and p=0.784) showing no significant difference between versions. However, AlphaFold 2 significantly outperformed AlphaFold 3 on sequence identity (88.35% vs. 86.87%, p=0.017) and mean pLDDT confidence score (79.341 vs. 77.902, p<0.0001), indicating that for membrane proteins specifically, AlphaFold 3 did not deliver a meaningful upgrade and in some respects performed slightly worse than its predecessor .'
    },
    medbuddy: {
      title: 'MedBuddy',
      role: 'Mobile App Developer',
      team: 'MedBuddy Senior Capstone',
      dates: 'Aug 2025 - May 2026',
      summary: 'Med Buddy tackled medication non-adherence, a problem costing the U.S. healthcare system an estimated $300 billion per year, by giving patients a tool to stay consistent with their prescriptions. Our team designed a mobile app that tracks a patients medication routine and layers in gamification to motivate and reward continued adherence.',
      problem: 'Medication nonadherence is a major healthcare problem: approximately 50% of patients with chronic conditions do not take medications as prescribed, 31% never fill their first prescription, and an estimated 125,000 deaths each year are linked to nonadherence. These behaviors contribute to preventable hospitalizations, unreliable treatment evaluation, and an estimated annual cost of up to $300 billion due to additional appointments, emergency-department visits, and hospitalizations. A smart medication-adherence system is needed to collect and interpret real-time data—such as missed doses, dose timestamps, refill activity, and medication-removal steps—so that patients and healthcare providers can better monitor adherence and respond before health outcomes worsen.',
      action: 'I conducted interviews with 14 individuals who take one or more medications to understand their routines, adherence challenges, perceptions, and preferences for support. I also completed a literature review on behavioral psychology and medication adherence, then proposed a gamified mobile-app feature using a Tamagotchi-inspired virtual-pet concept to encourage users to complete their medication routines. In addition, I supported my teammates in prototyping the RFID-tag component used to detect medication-related actions.',
      process: 'I used interview responses and literature findings to identify behavioral factors that influence motivation, habit formation, and medication-taking consistency. I spent several months learning React Native and developing modular mobile-app prototypes, while improving my understanding of mobile-app design, system architecture, SQL, APIs, relational databases, and game design. Throughout development, I gathered feedback, refined user flows, and documented technical and user-centered tradeoffs to ensure the prototype aligned with medication-adherence needs and the system’s technical constraints.',
      outcome: 'We produced a functional mobile application that securely collects user information, encrypts it, stores it in a relational database, and retrieves it for the user through the app. The strongest user-testing feedback was a request for expanded gamification—including more virtual animals, customization options, and art styles—indicating that users found the app more appealing and would be more likely to continue using it when it meets their creative and interactive needs.'
    },
    'canine-wearable': {
      title: 'Canine Wearable Monitor',
      role: 'Project Leader',
      team: 'The VEST Team',
      dates: 'May 2025 - May 2026',
      summary: 'My familys experiences caring for high-needs dogs motivated the VEST project: my Pomeranian has a partially collapsed trachea, and my bulldogs must be monitored for overheating. Pet owners often have limited visibility into a dog’s breathing, temperature, and overall condition when they are away, making it difficult to recognize a developing health issue before it becomes an emergency. This challenge becomes even greater for animal shelters monitoring many dogs at once and for veterinary teams evaluating pre- and post-operative patients, since a brief clinic visit and owner-reported symptoms may not capture a dog’s continuous health status; VEST is intended to support ongoing monitoring of vital signs such as respiratory rate, heart rate, and body temperature.',
      problem: 'My family’s experiences caring for high-needs dogs motivated the VEST project: my Pomeranian has a partially collapsed trachea, and my bulldogs must be monitored for overheating. Pet owners often have limited visibility into a dog’s breathing, temperature, and overall condition when they are away, making it difficult to recognize a developing health issue before it becomes an emergency. This challenge becomes even greater for animal shelters monitoring many dogs at once and for veterinary teams evaluating pre- and post-operative patients, since a brief clinic visit and owner-reported symptoms may not capture a dog’s continuous health status; VEST is intended to support ongoing monitoring of vital signs such as respiratory rate, heart rate, and body temperature.',
      action: 'I conducted market research on U.S. canine-vitals monitoring products and identified a limited competitive landscape, with one primary competitor using a collar-based design. I proposed a smart dog vest that distributes sensors and hardware across the dog’s body to improve measurement stability, reduce vibration and motion interference, and avoid concentrating costly components in one collar device. I partnered with TAMU Turtle Robotics, reviewed more than 50 applications, interviewed more than 15 prospective members, and recruited an 18-member multidisciplinary team.',
      process: 'I led the 18-member team by organizing focused hardware, algorithm, software, and product-design subteams and coordinating development throughout the semester. I supported development of heart-rate, motion, and respiration sensors and algorithms, while the software team built a mobile app and explored machine-learning models for recognizing potential abnormalities from simulated and publicly available canine-vitals data. I promoted and pitched VEST to entrepreneurs, Texas A&M student organizations, and a local A&M pitch competition, won first place and $100, and explored moving the project into the McFerrin Center startup incubator program.',
      outcome: 'VEST attracted 34 Spring 2026 applicants, compared with 25 in Fall 2025—a 36% increase—and rose from last place to tied for third among projects in applicant demand. With an 17.65% acceptance rate, the project formed a selective 18-member team and produced a partially functional canine-vitals vest that transmitted data to a mobile app; future work will focus on securing funding, completing animal testing, validating sensor accuracy, and pursuing startup-incubator opportunities.'
    },
    'robotic-leg': {
      title: '6 DOF Robotic Leg Prototype',
      role: 'Mechanical Design Team Leader',
      team: 'ANKL',
      dates: 'Jan 2025 - Jan 2026',
      summary: 'As the mechanical team leader for the ANKL project, I led the design and development of a prosthetic-leg system that applied robotics principles to a medical-device application. The project focused on creating a functional, mechanically reliable prosthetic-leg prototype that could support future advances in mobility, user comfort, and assistive technology.',
      problem: 'Conventional prosthetic legs often provide limited ankle and foot motion, which can contribute to unnatural gait patterns, reduced mobility, fatigue, and increased strain on the user’s unaffected limb. The ANKL project addresses this limitation by developing a six-degree-of-freedom prosthetic ankle capable of reproducing a broader range of ankle motion while supporting a user body weight of more than 200 pounds.',
      action: 'As mechanical team leader for the ANKL prosthetic-leg project, I proposed the initial design direction and helped translate user needs into engineering requirements for a six-degree-of-freedom, load-bearing prosthetic ankle. I researched patient constraints and found that the intended design should accommodate users over age 40 and support body weights above 200 pounds, then used these requirements to guide material selection, geometric design, and mechanical simulations. I also led teams ranging from 8 to 16 members and introduced a Git-based documentation system to track live documents, code revisions, and SolidWorks design changes across the project.',
      process: 'To support the mechanical design, I studied modern robotics, motion biomechanics, EMG signals, gait analysis, IMU-based measurement, OpenSim, coordinate systems, absolute and relative velocity, 2R and 3R planar models, Denavit–Hartenberg parameters, and direct linear transformation coordinates. I applied this knowledge to understand and model human movement in three-dimensional space, evaluate prosthetic-leg motion requirements, and simulate mechanical geometry, loading, and potential failure points in SolidWorks. I also contributed to electrical prototyping by developing actuator test circuits, reviewing component datasheets, working with Raspberry Pi hardware, analog-to-digital converters, wiring, and power sources, and troubleshooting circuit issues to support actuator testing and system integration.',
      outcome: 'The team developed a functioning Stewart-platform prototype capable of translating and rotating into multiple positions, demonstrating the feasibility of the prosthetic ankle’s multi-degree-of-freedom mechanical concept. Through leading an 8–16 member team and contributing to mechanical design, simulation, actuator testing, and documentation workflows, I built practical experience in prosthetic-device development, mechatronics integration, biomechanics, technical troubleshooting, and cross-functional engineering leadership.'
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
    var gallery = projectGalleries[projectKey] || sharedGallery;
    var contentSections = data.sections || [
      { title: 'Problem', body: data.problem },
      { title: 'My Action', body: data.action },
      { title: 'Process', body: data.process },
      { title: 'Outcome', body: data.outcome }
    ];

    var slidesHtml = gallery
      .map(function (image, idx) {
        var fitClass = image.fit === 'cover' ? 'project-media--cover' : 'project-media--contain';
        return (
          '<figure class="project-slide' + (idx === 0 ? ' is-active' : '') + '" role="group" aria-roledescription="slide" aria-label="' + (idx + 1) + ' of ' + gallery.length + '"' + (idx === 0 ? '' : ' aria-hidden="true"') + '>' +
            '<img src="' + image.src + '" alt="' + data.title + ' - ' + image.altSuffix + '" class="' + fitClass + '" />' +
            '<figcaption>' + image.caption + '</figcaption>' +
          '</figure>'
        );
      })
      .join('');

    var dotsHtml = gallery
      .map(function (image, idx) {
        return '<button type="button" class="project-carousel-dot' + (idx === 0 ? ' is-active' : '') + '" data-slide-dot="' + idx + '" aria-label="Go to slide ' + (idx + 1) + ': ' + image.caption + '" aria-current="' + (idx === 0 ? 'true' : 'false') + '"></button>';
      })
      .join('');

    var sectionsHtml = contentSections
      .map(function (section) {
        return (
          '<section class="project-page-section">' +
            '<h2>' + section.title + '</h2>' +
            '<p>' + section.body + '</p>' +
          '</section>'
        );
      })
      .join('');

    container.innerHTML =
      '<header class="project-page-intro">' +
        '<h1 class="project-page-title">' + data.title + '</h1>' +
        '<p class="project-page-meta">Role: ' + data.role + ' | Team: ' + data.team + ' | Dates: ' + data.dates + '</p>' +
        (data.summary ? '<p class="project-page-summary">' + data.summary + '</p>' : '') +
      '</header>' +
      '<section class="project-carousel" aria-label="Project gallery for ' + data.title + '" tabindex="0">' +
        '<div class="project-carousel-viewport">' +
          '<button type="button" class="project-carousel-arrow project-carousel-arrow--prev" data-slide-nav="prev" aria-label="Previous slide">&#8249;</button>' +
          '<button type="button" class="project-carousel-arrow project-carousel-arrow--next" data-slide-nav="next" aria-label="Next slide">&#8250;</button>' +
          slidesHtml +
        '</div>' +
        '<div class="project-carousel-controls">' +
          '<div class="project-carousel-center">' +
            '<p class="project-carousel-counter" aria-live="polite" aria-atomic="true">1 of ' + gallery.length + '</p>' +
            '<div class="project-carousel-dots" role="tablist" aria-label="Slide picker">' + dotsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      sectionsHtml +
      '<nav class="project-page-footer-nav" aria-label="Project page navigation">' +
        '<button type="button" class="project-page-nav-btn" data-project-nav="prev"' + (prevKey ? '' : ' disabled') + '>' + prevLabel + '</button>' +
        '<button type="button" class="project-page-nav-btn" data-project-nav="next"' + (nextKey ? '' : ' disabled') + '>' + nextLabel + '</button>' +
      '</nav>';
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
