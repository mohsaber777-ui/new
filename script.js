/* ===================================
   YASSER HAMMAD LAW - JAVASCRIPT
   Premium Interactions & Animations
=================================== */

(function () {
  'use strict';

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;

    // Active nav link on scroll
    updateActiveNavLink();
  }, { passive: true });

  // ===== MOBILE MENU =====
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('btn-nav') || link.getAttribute('href').startsWith('#')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ===== ACTIVE NAV LINK =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (navLink && scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== HERO PARTICLES =====
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        --duration: ${Math.random() * 8 + 4}s;
        animation-delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      container.appendChild(p);
    }
  }

  createParticles();

  // ===== COUNTERS =====
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 2200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('ar-EG');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('ar-EG');
      }
    }

    requestAnimationFrame(update);
  }

  // ===== SCROLL REVEAL (IntersectionObserver) =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Observe stat cards for counter animation
  const statCards = document.querySelectorAll('.stat-card[data-target]');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const target = parseInt(card.dataset.target);
        const counterEl = card.querySelector('.counter');
        if (counterEl && !card.dataset.animated) {
          card.dataset.animated = 'true';
          animateCounter(counterEl, target);
        }
        statsObserver.unobserve(card);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => statsObserver.observe(card));

  // Add reveal class and observe elements
  function addRevealToElements() {
    const selectors = [
      '.service-card', '.why-card', '.process-step',
      '.about-content-side', '.faq-item', '.contact-card',
      '.stat-card'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        revealObserver.observe(el);
      });
    });
  }

  addRevealToElements();

  // ===== TESTIMONIALS SLIDER =====
  const slides = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let autoPlayInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `الشريحة ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    sliderWrapper.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch swipe for slider
  let touchStartX = 0;
  const sliderEl = document.getElementById('testimonialsSlider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAutoPlay();
      }
    });
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const isOpen = faqItem.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it wasn't open
      if (!isOpen) {
        faqItem.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== CONSULTATION FORM =====
  const form = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm(form)) return;

      // Simulate submission
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
      submitBtn.disabled = true;

      await delay(2000);

      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال طلب الاستشارة';
      submitBtn.disabled = false;
      form.reset();
      formSuccess.classList.add('show');

      setTimeout(() => formSuccess.classList.remove('show'), 6000);

      // Scroll to success
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        field.focus();
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        field.style.borderColor = '#e53e3e';
        isValid = false;
      }
    });

    return isValid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== NAVBAR OVERLAY (mobile) =====
  const navOverlay = document.createElement('div');
  navOverlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 998; display: none; backdrop-filter: blur(4px);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(navOverlay);

  const origToggle = menuToggle.addEventListener.bind(menuToggle);
  menuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) {
      navOverlay.style.display = 'block';
      requestAnimationFrame(() => navOverlay.style.opacity = '1');
    } else {
      navOverlay.style.opacity = '0';
      setTimeout(() => navOverlay.style.display = 'none', 300);
    }
  });

  navOverlay.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navOverlay.style.opacity = '0';
    setTimeout(() => navOverlay.style.display = 'none', 300);
  });

  // ===== SECTION ANIMATIONS =====
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // ===== PERFORMANCE: Lazy Images =====
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== CONTACT CARD RIPPLE EFFECT =====
  document.querySelectorAll('.contact-card, .service-card, .why-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        width: 0; height: 0;
        background: rgba(201, 162, 39, 0.25);
        left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        animation: rippleEffect 0.7s ease forwards;
        z-index: 99;
      `;

      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add ripple animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ===== BACK TO TOP on scroll =====
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollToTopBtn.id = 'scrollToTop';
  scrollToTopBtn.setAttribute('aria-label', 'العودة إلى الأعلى');
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 24px;
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #081B33, #0d2545);
    color: #C9A227;
    border: 1px solid rgba(201,162,39,0.3);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
      scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
      scrollToTopBtn.style.transform = 'translateY(10px)';
    }
  }, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = 'linear-gradient(135deg, #C9A227, #a07e18)';
    scrollToTopBtn.style.color = '#081B33';
  });

  scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = 'linear-gradient(135deg, #081B33, #0d2545)';
    scrollToTopBtn.style.color = '#C9A227';
  });

  // ===== INIT =====
  updateActiveNavLink();

  // Preload status
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
  });

  console.log('%c⚖️ المستشار ياسر حماد - مكتب المحاماة', 'color: #C9A227; font-size: 14px; font-weight: bold;');
  console.log('%cخدمات قانونية متخصصة | 01003953137', 'color: #081B33; font-size: 12px;');

})();
