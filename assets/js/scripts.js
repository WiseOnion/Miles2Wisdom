/* ========================================
   Miles 2 Wisdom Counseling Services
   Main JavaScript - Shared Functionality
   ======================================== */

// ========================================
// 1. MOBILE MENU SYSTEM
// ========================================
(() => {
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.querySelector('nav ul');

  if (menuBtn && menu) {
    // Toggle menu on button click
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      menuBtn.textContent = isOpen ? '✕' : '☰';
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();

// ========================================
// 2. HEADER SHRINK ON SCROLL
// ========================================
(() => {
  const header = document.querySelector('header');
  
  if (header) {
    const SHRINK_THRESHOLD = 100;
    const HYSTERESIS = 30;
    let lastState = header.classList.contains('shrink');
    let rafScheduled = false;

    function updateState() {
      const y = window.scrollY || window.pageYOffset;
      const shouldBeShrunk = y >= SHRINK_THRESHOLD;
      const target = shouldBeShrunk ? true : (y <= SHRINK_THRESHOLD - HYSTERESIS ? false : lastState);
      
      if (target !== lastState) {
        lastState = target;
        header.classList.toggle('shrink', lastState);
      }
      
      rafScheduled = false;
    }

    window.addEventListener('scroll', () => {
      if (!rafScheduled) {
        window.requestAnimationFrame(updateState);
        rafScheduled = true;
      }
    }, { passive: true });

    // Run on page load
    document.addEventListener('DOMContentLoaded', updateState);
  }
})();

// ========================================
// 3. CARD REVEAL ANIMATION ON SCROLL
// ========================================
(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll('.card').forEach(card => {
    cardObserver.observe(card);
  });
})();

// ========================================
// 4. SET CURRENT YEAR IN FOOTER
// ========================================
(() => {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();

// ========================================
// 5. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ========================================
// 6. STICKY MOBILE CTA (for mobile devices)
// ========================================
(() => {
  const stickyCTA = document.querySelector('.sticky-mobile-cta');
  
  if (stickyCTA && window.innerWidth <= 768) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateStickyCTA() {
      const scrollY = window.scrollY;
      
      // Show after scrolling down 300px
      if (scrollY > 300) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyCTA);
        ticking = true;
      }
    }, { passive: true });
  }
})();

// ========================================
// 7. INDEX PAGE - SLIDESHOW (only runs if slideshow exists)
// ========================================
(() => {
  const slides = document.querySelectorAll('.slideshow-inner img');
  const dots = document.querySelectorAll('.slideshow-dots .dot');

  if (slides.length === 0) return; // Exit if no slideshow

  let currentSlide = 0;
  let slideInterval;
  const slideDelay = 15000;
  let touchStartX = 0;
  let touchEndX = 0;

  function showSlide(index) {
    slides.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, slideDelay);
  }

  function pauseSlideshow() {
    clearInterval(slideInterval);
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      pauseSlideshow();
      showSlide(i);
      startSlideshow();
    });
  });

  // Pause on hover
  const slideshow = document.querySelector('.slideshow');
  if (slideshow) {
    slideshow.addEventListener('mouseenter', pauseSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);

    // Touch/swipe functionality for mobile
    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseSlideshow();
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startSlideshow();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        nextSlide();
      } else {
        // Swiped right - previous slide
        prevSlide();
      }
    }
  }

  // Initialize
  showSlide(0);
  startSlideshow();
})();

// ========================================
// 8. SHOP PAGE - QUICK VIEW MODAL (only runs if modal exists)
// ========================================
(() => {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quick-view-modal');
  
  if (!modal || quickViewBtns.length === 0) return; // Exit if no modal

  const modalImg = modal.querySelector('.quick-view-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalAuthor = modal.querySelector('.modal-author');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalBuy = modal.querySelector('.modal-buy');
  const closeBtn = modal.querySelector('.close-btn');
  const closeModalBtn = modal.querySelector('.close-modal-btn');

  function openModal(btn) {
    modalImg.src = btn.dataset.img;
    modalImg.alt = btn.dataset.title;
    modalTitle.textContent = btn.dataset.title;
    modalAuthor.textContent = btn.dataset.author;
    modalDesc.textContent = btn.dataset.desc;
    modalBuy.href = btn.dataset.link || '#';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
})();

// ========================================
// 9. CONSULTATION FORM (book-a-consultation.html)
// ========================================
(() => {
  const form = document.getElementById('consultationForm');
  if (!form) return; // Exit if form doesn't exist

  const submitBtn = form.querySelector('.submit-btn');
  const formMessage = document.getElementById('formMessage');
  const reasonError = document.getElementById('reasonError');
  const successMessage = document.getElementById('successMessage');

  function showSuccessCard() {
    if (successMessage) {
      successMessage.classList.add('visible');
      successMessage.setAttribute('aria-hidden', 'false');
    }
    setTimeout(() => {
      try {
        form.style.display = 'none';
        if (successMessage) successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }, 160);
  }

  function showInlineSuccess(msg) {
    if (formMessage) {
      formMessage.textContent = msg || 'Submitted successfully.';
      formMessage.className = 'form-message success';
    }
  }

  function showInlineError(msg) {
    if (formMessage) {
      formMessage.textContent = msg || 'Submission failed.';
      formMessage.className = 'form-message error';
    }
  }

  function setButtonLoading(isLoading, label) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.dataset.origText = submitBtn.textContent;
      submitBtn.textContent = label || 'Sending...';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.origText || (label || 'Submit');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Checkbox validation
    const checkboxes = Array.from(form.querySelectorAll('input[name="reason"]'));
    if (checkboxes.length > 0) {
      const checked = checkboxes.filter(cb => cb.checked);
      if (checked.length === 0) {
        if (reasonError) {
          reasonError.style.display = 'block';
          reasonError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      } else {
        if (reasonError) reasonError.style.display = 'none';
      }
    }

    // Native validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Build FormData
    const fd = new FormData(form);

    // Show loading state
    setButtonLoading(true, 'Sending...');
    if (formMessage) {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        showInlineSuccess('Submitted successfully.');
        setTimeout(showSuccessCard, 200);
        form.reset();
        return;
      } else {
        showInlineError('Submission failed. Please try again.');
        setButtonLoading(false);
      }
    } catch (err) {
      console.error('Form submit error:', err);
      showInlineError('Network error. Please try again.');
      setButtonLoading(false);
    }
  });

  // Hide reasonError when user toggles a checkbox
  const checkboxInputs = form.querySelectorAll('input[name="reason"]');
  if (checkboxInputs) {
    checkboxInputs.forEach(cb => cb.addEventListener('change', () => {
      const any = Array.from(checkboxInputs).some(i => i.checked);
      if (any && reasonError) reasonError.style.display = 'none';
    }));
  }
})();

// ========================================
// 10. APPLY NOW FORM (apply-now.html)
// ========================================
(() => {
  const form = document.getElementById('applyForm');
  if (!form) return; // Exit if form doesn't exist

  const resumeInput = document.getElementById('resume');
  const fileError = document.getElementById('fileError');
  const formStatus = document.getElementById('formStatus');
  const successCard = document.getElementById('formSuccess');
  const errorCard = document.getElementById('formError');
  const submitBtn = form.querySelector('.submit-btn');

  // Config
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  function validateFile() {
    if (fileError) fileError.style.display = 'none';
    if (!resumeInput || !resumeInput.files || resumeInput.files.length === 0) return true;
    
    const file = resumeInput.files[0];
    
    if (file.size > MAX_FILE_SIZE) {
      if (fileError) {
        fileError.textContent = 'File is too large. Max size is 5 MB.';
        fileError.style.display = 'block';
      }
      return false;
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      const name = file.name.toLowerCase();
      if (!name.endsWith('.pdf') && !name.endsWith('.doc') && !name.endsWith('.docx')) {
        if (fileError) {
          fileError.textContent = 'Invalid file type. Accepts PDF, DOC, DOCX.';
          fileError.style.display = 'block';
        }
        return false;
      }
    }
    
    return true;
  }

  function showSuccess() {
    if (successCard) {
      successCard.classList.add('visible');
      successCard.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        form.style.display = 'none';
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 180);
    }
    if (errorCard) {
      errorCard.classList.remove('visible');
      errorCard.style.display = 'none';
    }
  }

  function showError(message) {
    if (errorCard) {
      errorCard.classList.add('visible');
      errorCard.style.display = 'block';
      errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (message && formStatus) {
      formStatus.textContent = message;
      formStatus.className = 'small-note error-text';
    }
  }

  // Live validation for resume
  if (resumeInput) {
    resumeInput.addEventListener('change', validateFile);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // File validation
    if (!validateFile()) {
      showError('Please fix file upload error.');
      return;
    }

    // Disable submit
    const originalText = submitBtn ? submitBtn.textContent : 'Submit Application';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Prepare FormData
    const fd = new FormData(form);

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        if (formStatus) {
          formStatus.textContent = 'Application submitted.';
          formStatus.className = 'small-note';
        }
        showSuccess();
        form.reset();
      } else {
        let body = null;
        try { body = await resp.json(); } catch (err) { /* ignore */ }
        const errMsg = body && body.error ? body.error : `Server error (${resp.status})`;
        showError(errMsg);
      }
    } catch (err) {
      console.error('Apply form submit error', err);
      showError('Network error – please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });

  // Clear status on input change
  form.addEventListener('input', () => {
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'small-note';
    }
    if (fileError) fileError.style.display = 'none';
  });

  // Accessible live-feedback when required fields change
  const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('blur', function () {
      if (this.checkValidity()) {
        this.classList.remove('error');
        this.classList.add('valid');
      } else {
        this.classList.remove('valid');
        this.classList.add('error');
      }
    });
  });
})();

// ========================================
// 11. TEAM PAGE - CARD CLICKS (only runs if team cards exist)
// ========================================
(() => {
  const teamCards = document.querySelectorAll('.team-card:not(.non-clickable)');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });
})();

// ========================================
// CONSOLE MESSAGE (optional branding)
// ========================================
console.log(
  '%cMiles 2 Wisdom Counseling Services',
  'font-size: 16px; font-weight: bold; color: #A9C9FF;'
);
console.log(
  '%cGuiding You from Where You Are to Where You Want to Be',
  'font-size: 12px; color: #6b7280;'
);