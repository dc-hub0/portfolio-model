/**
 * DEEPAK CHAUHAN - MODERN PORTFOLIO CORE SCRIPTS
 * Interactive modules: Theme engine, dynamic typing, particle background,
 * project filters & search, architecture modals, resume viewer,
 * command palette (Cmd+K), interactive terminal, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initTyping();
  initNavigation();
  initScrollReveal();
  initProjectFilters();
  initSkillsTabs();
  initProjectModals();
  initResumeModal();
  initCommandPalette();
  initTerminal();
  initContactForm();
  initCopyButtons();
});

/* ==========================================================================
   1. Theme Engine (Dark / Light with LocalStorage persistence)
   ========================================================================== */
function initTheme() {
  const root = document.documentElement;
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  
  // Check stored theme or default to dark
  let currentTheme = localStorage.getItem('deepak_portfolio_theme') || 'dark';
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      localStorage.setItem('deepak_portfolio_theme', currentTheme);
      updateThemeIcons(currentTheme);
      showToast(`Switched to ${currentTheme} theme`);
    });
  });

  function updateThemeIcons(theme) {
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
}

/* ==========================================================================
   2. Interactive Canvas Particle Background
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 25 : 50;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   3. Dynamic Typewriter Effect
   ========================================================================== */
function initTyping() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const roles = [
    "Software Developer",
    "Full-Stack Engineer",
    "AI & Gemini Solutions Developer",
    "Cloud Certified (AWS & Azure)",
    "MCA Scholar (8.73 CGPA)"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeTick() {
    const current = roles[roleIdx];
    
    if (isDeleting) {
      charIdx--;
      typingEl.textContent = current.substring(0, charIdx);
    } else {
      charIdx++;
      typingEl.textContent = current.substring(0, charIdx);
    }

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIdx === current.length) {
      delay = 1800; // pause at word end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeTick, delay);
  }

  typeTick();
}

/* ==========================================================================
   4. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Sticky header shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.textContent = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // Active navigation highlight based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. Scroll Reveal & Animated Metrics
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // If element has progress bars, animate them
        entry.target.querySelectorAll('.skill-progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. Project Filtering & Live Search
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');

  if (!projectCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    projectCards.forEach(card => {
      const cat = card.dataset.category || '';
      const text = (card.textContent || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = !searchTerm || text.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ==========================================================================
   7. Skills Category Tabs
   ========================================================================== */
function initSkillsTabs() {
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!skillTabs.length || !skillCards.length) return;

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetGroup = tab.dataset.group;

      skillCards.forEach(card => {
        if (targetGroup === 'all' || card.dataset.group === targetGroup) {
          card.style.display = 'block';
          // animate bar width
          const bar = card.querySelector('.skill-progress-fill');
          if (bar) bar.style.width = bar.dataset.w + '%';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Interactive Project Architecture & Details Modal
   ========================================================================== */
const projectDetailsData = {
  'sage-ai': {
    title: 'SAGE AI – AI-Powered Career Guidance Coach',
    badge: 'Generative AI & Next.js',
    summary: 'A full-stack career acceleration platform powered by Google Gemini API, Prisma, and Clerk that conducts role-based mock interviews and builds personalized resumes.',
    highlights: [
      'Engineered interactive mock interview simulation with dynamic real-time question generation tailored to candidate experience and industry standards.',
      'Created an AI resume builder using Inngest for asynchronous background workflow processing and PDF compilation.',
      'Secured user authentication and authorization using Clerk with session token management.',
      'Implemented Prisma ORM with relational database schema for user profiles, interview transcripts, and performance analytics.'
    ],
    techStack: ['Next.js', 'React', 'Google Gemini API', 'Prisma', 'Clerk', 'Inngest', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com/dc-hub0',
    architecture: `
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Next.js Client  │ ───> │ Gemini LLM API   │ ───> │ Dynamic Feedback │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ Clerk Auth       │      │ Inngest Task Q   │ ───> PDF Compilation
└──────────────────┘      └──────────────────┘
    `
  },
  'fitronix': {
    title: 'FitroniX – AI-Powered Fitness Assistant',
    badge: 'Generative AI & Voice',
    summary: 'An intelligent full-stack fitness and wellness companion integrating Google Gemini API and Vapi AI for conversational hands-free workout guidance and Convex real-time synchronization.',
    highlights: [
      'Integrated Google Gemini API to dynamically generate personalized fitness regimens, diet recommendations, and progression milestones.',
      'Developed a hands-free voice assistant interface leveraging Vapi AI for interactive real-time coaching during workouts.',
      'Employed Convex as the reactive database backend for zero-latency data synchronization across connected devices.',
      'Modern, highly responsive UI with Clerk authentication protecting sensitive user biometric data.'
    ],
    techStack: ['React', 'Next.js', 'Google Gemini API', 'Vapi AI', 'Clerk', 'Convex', 'Tailwind CSS'],
    github: 'https://github.com/dc-hub0',
    architecture: `
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Voice (Vapi AI) │ <──> │ Next.js Front    │ ───> │ Gemini API Plan  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │ Convex Real-Time │ (Reactive State Engine)
                          └──────────────────┘
    `
  },
  'academic-insight': {
    title: 'Academic Insight – Student Performance Predictor',
    badge: 'Machine Learning & Python',
    summary: 'Full-stack machine learning application built with Flask and Python utilizing custom K-Nearest Neighbors (KNN) algorithms to accurately forecast student academic performance.',
    highlights: [
      'Trained a custom K-Nearest Neighbors (KNN) classifier on a dataset of 149 student records, achieving multi-tier prediction based on attendance, internal marks, and study hours.',
      'Classified performance across 4 actionable tiers allowing academic advisors to enact early interventions.',
      'Engineered an administrative dashboard with SQLite backend and secure hashed password authentication.',
      'Built responsive analytical visualizers using HTML5, CSS3, and JavaScript.'
    ],
    techStack: ['Python', 'Flask', 'Machine Learning (KNN)', 'SQLite', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/dc-hub0',
    architecture: `
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Student Data In  │ ───> │ Feature Vector   │ ───> │ Custom KNN Model │
│ (149 Records)    │      │ Preprocessing    │      │ (4 Tiers)        │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │ Advisor Dash     │
                                                    └──────────────────┘
    `
  },
  'nekoflix': {
    title: 'Nekoflix – Full-Stack Movie Streaming Platform',
    badge: 'Full-Stack MERN Stack',
    summary: 'A full-featured modern streaming application powered by MongoDB, Express, React, and Node.js with JWT authentication, content categorization, and responsive media controls.',
    highlights: [
      'Architected a scalable RESTful API backend using Express and Node.js for content delivery and metadata retrieval.',
      'Integrated robust JWT (JSON Web Token) authentication with encrypted credentials and session persistence.',
      'Engineered optimized MongoDB schema for media indexing, user watchlists, and viewing history.',
      'Built a sleek dark-mode user experience with dynamic carousels and smooth video player integration.'
    ],
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Tailwind CSS', 'REST API'],
    github: 'https://github.com/dc-hub0',
    architecture: `
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ React Single-App │ <──> │ Express/Node API │ <──> │ MongoDB Cluster  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ Media Player UI  │      │ JWT Auth Guards  │
└──────────────────┘      └──────────────────┘
    `
  },
  'realtime-chat': {
    title: 'Real-Time Chat Application',
    badge: 'WebSockets & High-Concurrency',
    summary: 'High-performance instant messaging system utilizing WebSockets to achieve a 50% reduction in message latency and deliver seamless real-time communication.',
    highlights: [
      'Implemented WebSockets over Node.js for bi-directional, event-driven communication eliminating polling overhead.',
      'Achieved a 50% reduction in message delivery latency compared to traditional REST polling architecture.',
      'Designed an intuitive, responsive chat interface in React, boosting user satisfaction metrics by 25%.',
      'Persistent chat history storage with MongoDB and user presence detection.'
    ],
    techStack: ['Node.js', 'React', 'WebSockets', 'MongoDB', 'Express', 'Tailwind CSS'],
    github: 'https://github.com/dc-hub0',
    architecture: `
┌──────────────────┐    Full Duplex Socket   ┌──────────────────┐
│  Client 1 (React)│ <=====================> │ Node.js WS Hub   │
└──────────────────┘                         └──────────────────┘
                                                      │▲
                                                      ││ Broadcast
                                                      ▼│
┌──────────────────┐    Full Duplex Socket   ┌──────────────────┐
│  Client 2 (React)│ <=====================> │ MongoDB Storage  │
└──────────────────┘                         └──────────────────┘
    `
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalBody = document.getElementById('project-modal-body');
  const closeBtn = document.getElementById('project-modal-close');

  if (!modalOverlay || !modalBody) return;

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.projectId;
      const data = projectDetailsData[id];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-secondary); background: rgba(99, 102, 241, 0.15); padding: 0.25rem 0.75rem; border-radius: 999px; text-transform: uppercase;">${data.badge}</span>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0.6rem 0 0.4rem; color: var(--text-primary);">${data.title}</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">${data.summary}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); margin-bottom: 0.6rem;">Key Engineering Highlights</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.65;">
            ${data.highlights.map(h => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); margin-bottom: 0.6rem;">System Flow & Architecture</h4>
          <pre style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 10px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; color: #38bdf8; line-height: 1.4;">${data.architecture}</pre>
        </div>

        <div style="margin-bottom: 1.75rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); margin-bottom: 0.6rem;">Technologies Applied</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
            ${data.techStack.map(t => `<span style="background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-primary); padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600;">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; text-align: center;">
            🐙 View Repository on GitHub
          </a>
          <button class="btn btn-secondary modal-inner-close" style="flex: 0 0 auto;">Close</button>
        </div>
      `;

      modalOverlay.classList.add('active');

      modalBody.querySelector('.modal-inner-close')?.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
      });
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });
}

/* ==========================================================================
   9. Digital Resume Modal with Print Trigger
   ========================================================================== */
function initResumeModal() {
  const resumeModalOverlay = document.getElementById('resume-modal-overlay');
  const openResumeBtns = document.querySelectorAll('.open-resume-modal');
  const closeResumeBtn = document.getElementById('resume-modal-close');
  const printResumeBtn = document.getElementById('print-resume-btn');

  if (!resumeModalOverlay) return;

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModalOverlay.classList.add('active');
    });
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModalOverlay.classList.remove('active');
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  resumeModalOverlay.addEventListener('click', (e) => {
    if (e.target === resumeModalOverlay) {
      resumeModalOverlay.classList.remove('active');
    }
  });
}

/* ==========================================================================
   10. Command Palette (Cmd + K / Ctrl + K)
   ========================================================================== */
function initCommandPalette() {
  const cmdOverlay = document.getElementById('cmd-palette-overlay');
  const cmdInput = document.getElementById('cmd-palette-input');
  const cmdList = document.getElementById('cmd-palette-list');
  const openCmdBtns = document.querySelectorAll('.open-cmd-palette');

  if (!cmdOverlay || !cmdInput || !cmdList) return;

  const commands = [
    { name: 'Go to Home', desc: 'Main landing page & highlights', shortcut: 'H', url: 'index.html' },
    { name: 'Go to About & Education', desc: 'MCA, B.Sc details, skills & timeline', shortcut: 'A', url: 'about.html' },
    { name: 'Go to Projects', desc: 'Explore all 5 technical projects', shortcut: 'P', url: 'projects.html' },
    { name: 'Go to Certifications', desc: 'AWS & Microsoft Azure credentials', shortcut: 'C', url: 'certifications.html' },
    { name: 'Go to Contact', desc: 'Get in touch & direct channels', shortcut: 'T', url: 'contact.html' },
    { name: 'View Resume', desc: 'Open digital printable resume sheet', shortcut: 'R', action: () => document.querySelector('.open-resume-modal')?.click() },
    { name: 'Open Terminal', desc: 'Launch interactive developer console', shortcut: 'K', action: () => openTerminal() },
    { name: 'Toggle Dark / Light Theme', desc: 'Switch system color appearance', shortcut: 'M', action: () => document.querySelector('.theme-toggle')?.click() },
    { name: 'GitHub Profile', desc: 'Visit github.com/dc-hub0', shortcut: 'G', url: 'https://github.com/dc-hub0', external: true },
    { name: 'LinkedIn Profile', desc: 'Connect on linkedin.com/in/deepakxchauhan', shortcut: 'L', url: 'https://www.linkedin.com/in/deepakxchauhan/', external: true },
    { name: 'Send Email Directly', desc: 'deepakcchauhan07@gmail.com', shortcut: 'E', action: () => window.location.href = 'mailto:deepakcchauhan07@gmail.com' }
  ];

  function renderCommands(filter = '') {
    const query = filter.toLowerCase();
    const filtered = commands.filter(c => c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));

    cmdList.innerHTML = filtered.map((c, i) => `
      <li class="cmd-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
        <div class="cmd-item-left">
          <span style="font-size: 1.1rem;">⚡</span>
          <div>
            <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${c.desc}</div>
          </div>
        </div>
        <span class="cmd-shortcut">${c.shortcut}</span>
      </li>
    `).join('');

    cmdList.querySelectorAll('.cmd-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        executeCommand(filtered[idx]);
      });
    });
  }

  function executeCommand(cmd) {
    if (!cmd) return;
    cmdOverlay.classList.remove('active');
    if (cmd.url) {
      if (cmd.external) {
        window.open(cmd.url, '_blank');
      } else {
        window.location.href = cmd.url;
      }
    } else if (cmd.action) {
      cmd.action();
    }
  }

  function openPalette() {
    cmdOverlay.classList.add('active');
    cmdInput.value = '';
    renderCommands('');
    setTimeout(() => cmdInput.focus(), 50);
  }

  openCmdBtns.forEach(btn => btn.addEventListener('click', openPalette));

  // Keybindings: Cmd+K, Ctrl+K, Escape
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay.classList.contains('active')) {
        cmdOverlay.classList.remove('active');
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape') {
      cmdOverlay.classList.remove('active');
      document.getElementById('project-modal-overlay')?.classList.remove('active');
      document.getElementById('resume-modal-overlay')?.classList.remove('active');
      document.getElementById('terminal-modal-overlay')?.classList.remove('active');
    }
  });

  cmdInput.addEventListener('input', (e) => {
    renderCommands(e.target.value);
  });

  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) cmdOverlay.classList.remove('active');
  });
}

/* ==========================================================================
   11. Interactive Developer Console / Terminal
   ========================================================================== */
function openTerminal() {
  const terminalOverlay = document.getElementById('terminal-modal-overlay');
  if (terminalOverlay) {
    terminalOverlay.classList.add('active');
    document.getElementById('term-input')?.focus();
  }
}

function initTerminal() {
  const terminalOverlay = document.getElementById('terminal-modal-overlay');
  const termClose = document.getElementById('terminal-modal-close');
  const termOpenBtns = document.querySelectorAll('.open-terminal-btn');
  const termScreen = document.getElementById('terminal-screen');
  const termInput = document.getElementById('term-input');

  termOpenBtns.forEach(btn => btn.addEventListener('click', openTerminal));

  if (termClose && terminalOverlay) {
    termClose.addEventListener('click', () => terminalOverlay.classList.remove('active'));
    terminalOverlay.addEventListener('click', (e) => {
      if (e.target === terminalOverlay) terminalOverlay.classList.remove('active');
    });
  }

  if (!termInput || !termScreen) return;

  const welcomeMsg = `Deepak Chauhan Terminal [Version 2.4.0]
(c) 2026 Deepak Chauhan. Type 'help' to see available commands.`;

  printLine(welcomeMsg, 'highlight');

  function printLine(text, className = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text.replace(/\n/g, '<br>');
    termScreen.appendChild(line);
    termScreen.scrollTop = termScreen.scrollHeight;
  }

  const commands = {
    help: () => `Available commands:
  • about          : Summary of Deepak Chauhan's background & education
  • skills         : Technical competencies & frameworks
  • projects       : List of prominent AI & full-stack applications
  • certs          : AWS & Azure cloud/AI certifications
  • contact        : Direct phone, email, and social profiles
  • open <page>    : Navigate to (home, about, projects, certs, contact)
  • clear          : Clear terminal screen
  • theme          : Toggle between dark and light mode`,

    about: () => `Deepak Chauhan
Software Developer | MCA Scholar (CGPA: 8.73)
Location: Nashik, Maharashtra, India
Specializes in full-stack architecture, Generative AI (Gemini API), and cloud infrastructure (AWS & Azure certified).`,

    skills: () => `• Languages: Java, Python, JavaScript, TypeScript, C++, SQL, C#
• Frameworks: Next.js, React, Node.js, Express, Flask
• Cloud & AI: AWS (Certified Practitioner), Microsoft Azure (AZ-900, AI-900), Gemini API
• Databases: MongoDB, PostgreSQL, Supabase, MySQL, SQLite
• Tools: Git/GitHub, Docker, Kubernetes, Linux, Postman`,

    projects: () => `1. SAGE AI – AI Career Coach (Next.js, Gemini API, Prisma, Clerk, Inngest)
2. FitroniX – AI Fitness Assistant (Next.js, Gemini API, Vapi AI, Convex)
3. Academic Insight – ML Student Performance Predictor (Flask, KNN, SQLite)
4. Nekoflix – Full-Stack Streaming Platform (MERN, JWT)
5. Real-Time Chat – WebSocket Instant Messaging (React, Node.js, MongoDB)`,

    certs: () => `[1] AWS Certified Cloud Practitioner (2026-2029)
[2] Microsoft Certified: Azure Fundamentals (AZ-900) (2026)
[3] Microsoft Certified: Azure AI Fundamentals (AI-900) (2026)`,

    contact: () => `• Email: deepakcchauhan07@gmail.com
• Phone: +91 7721807761
• GitHub: https://github.com/dc-hub0
• LinkedIn: https://www.linkedin.com/in/deepakxchauhan/
• Location: Nashik, India`,

    theme: () => {
      document.querySelector('.theme-toggle')?.click();
      return `Theme switched.`;
    },

    clear: () => {
      termScreen.innerHTML = '';
      return '';
    }
  };

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = termInput.value.trim();
      if (!raw) return;

      printLine(`deepak@portfolio:~$ ${raw}`, 'prompt');
      termInput.value = '';

      const [cmd, ...args] = raw.toLowerCase().split(' ');

      if (cmd === 'open') {
        const page = args[0];
        const pageMap = {
          home: 'index.html',
          about: 'about.html',
          projects: 'projects.html',
          certs: 'certifications.html',
          contact: 'contact.html'
        };
        if (pageMap[page]) {
          printLine(`Navigating to ${page}...`, 'highlight');
          setTimeout(() => window.location.href = pageMap[page], 600);
        } else {
          printLine(`Unknown page '${page}'. Options: home, about, projects, certs, contact`, 'output');
        }
      } else if (commands[cmd]) {
        const res = commands[cmd]();
        if (res) printLine(res, 'output');
      } else {
        printLine(`Command not found: '${cmd}'. Type 'help' for available commands.`, 'output');
      }
    }
  });
}

/* ==========================================================================
   12. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const subjectInput = form.querySelector('#subject');
  const messageInput = form.querySelector('#message');
  const charCounter = document.getElementById('char-count');
  const successBanner = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.style.color = 'var(--danger)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Quick message template pills
  document.querySelectorAll('.template-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const templ = pill.dataset.template;
      if (subjectInput && templ) {
        subjectInput.value = templ;
      }
      if (messageInput) {
        if (templ.includes('Job Opportunity')) {
          messageInput.value = `Hi Deepak, we reviewed your impressive work on SAGE AI and full-stack projects. We'd love to discuss an exciting opportunity with our engineering team.`;
        } else if (templ.includes('AI Collaboration')) {
          messageInput.value = `Hi Deepak, I saw your work with the Google Gemini API and LLM agents. Let's connect to discuss collaborating on an AI-powered project.`;
        } else {
          messageInput.value = `Hi Deepak, reaching out from your portfolio. Would love to connect regarding your software development experience!`;
        }
        messageInput.dispatchEvent(new Event('input'));
      }
      showToast('Template populated in form!');
    });
  });

  function validateField(input, condition, errorMsg) {
    const errorEl = input.parentElement.querySelector('.form-error');
    if (!condition) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const okName = validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 characters).');
    const okEmail = validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const okMsg = validateField(messageInput, messageInput.value.trim().length >= 10, 'Your message should be at least 10 characters.');

    if (okName && okEmail && okMsg) {
      // Simulate submission animation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message... ⏳</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message 🚀</span>`;
        if (successBanner) {
          successBanner.style.display = 'block';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('Message sent successfully! Deepak will get back to you shortly.');
        form.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
      }, 900);
    }
  });
}

/* ==========================================================================
   13. One-Click Copy & Toast System
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied "${text}" to clipboard!`);
      }).catch(() => {
        showToast(`Failed to copy.`);
      });
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
