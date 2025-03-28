// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations
  initAnimations();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize tabs
  initTabs();
  
  // Initialize skills animation
  initSkillsAnimation();
  
  // Initialize form validation
  initContactForm();
  
  // Initialize active nav links
  setActiveNavLink();
  
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize partner logos
  initPartnerLogos();
  
  // Initialize image gallery modal
  initImageGallery();
});

// Scroll animations using Intersection Observer
function initAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Triggers slightly before element is in view
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Special staggered animation for partner logos
  const partnerLogos = document.querySelectorAll('.partner-logo');
  
  if (partnerLogos.length > 0) {
    const partnerLogoObserver = new IntersectionObserver((entries) => {
      let delay = 0;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a staggered delay for each logo
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          delay += 150; // 150ms delay between each logo
          partnerLogoObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    partnerLogos.forEach(logo => {
      partnerLogoObserver.observe(logo);
    });
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.navbar-nav');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Update aria-expanded attribute for accessibility
      const isExpanded = navMenu.classList.contains('active');
      menuBtn.setAttribute('aria-expanded', isExpanded);
      
      // Update button text based on state
      menuBtn.innerHTML = isExpanded 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

// Tabs functionality
function initTabs() {
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabTriggers.length && tabContents.length) {
    tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        // Remove active class from all triggers
        tabTriggers.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked trigger
        trigger.classList.add('active');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show the selected tab content
        const tabId = trigger.getAttribute('data-tab');
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
          activeContent.classList.add('active');
          
          // Reinitialize animations within the tab
          const animatedElements = activeContent.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
          animatedElements.forEach(element => {
            element.classList.remove('visible');
            setTimeout(() => {
              element.classList.add('visible');
            }, 50);
          });
        }
      });
    });
  }
}

// Skills progress bar animation
function initSkillsAnimation() {
  const skillProgressElements = document.querySelectorAll('.skill-progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percentage = entry.target.getAttribute('data-percentage');
        entry.target.style.width = `${percentage}%`;
        
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  skillProgressElements.forEach(element => {
    observer.observe(element);
  });
}

// Contact form validation and submission
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  const submitStatus = document.getElementById('submit-status');
  
  if (contactForm) {
    // Add custom validation styles when inputs change
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      // Real-time validation as user types
      input.addEventListener('input', function() {
        validateInput(this);
      });
      
      // Validate when input loses focus
      input.addEventListener('blur', function() {
        validateInput(this, true);
      });
    });
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset previous errors
      document.querySelectorAll('.input-error-message').forEach(error => error.remove());
      document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
      
      // Get form inputs
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      
      // Basic validation
      let isValid = true;
      
      if (!validateInput(nameInput, true)) isValid = false;
      if (!validateInput(emailInput, true)) isValid = false;
      if (!validateInput(subjectInput, true)) isValid = false;
      if (!validateInput(messageInput, true)) isValid = false;
      
      if (isValid) {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.querySelector('.btn-spinner').classList.remove('hidden');
        
        // Use Formspree for form submission
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Send Message';
          submitBtn.querySelector('.btn-spinner').classList.add('hidden');
          
          if (response.ok) {
            // Show success message
            contactForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
            if (formError) formError.classList.add('hidden');
            
            // Reset form fields
            contactForm.reset();
          } else {
            // Show error message
            if (formError) {
              contactForm.classList.add('hidden');
              formError.classList.remove('hidden');
            } else {
              // Fallback if error element doesn't exist
              showSubmitStatus('error', 'There was an error sending your message. Please try again later.');
            }
            throw new Error('Form submission failed');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Send Message';
          submitBtn.querySelector('.btn-spinner').classList.add('hidden');
          
          // Show error message
          if (formError) {
            contactForm.classList.add('hidden');
            formError.classList.remove('hidden');
          } else {
            showSubmitStatus('error', 'There was an error sending your message. Please try again later.');
          }
        });
      }
    });
    
    // Reset form buttons
    const resetButtons = document.querySelectorAll('.reset-form-btn');
    if (resetButtons) {
      resetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (formSuccess) formSuccess.classList.add('hidden');
          if (formError) formError.classList.add('hidden');
          contactForm.classList.remove('hidden');
          contactForm.reset();
          
          // Clear any validation states
          document.querySelectorAll('.input-error-message').forEach(error => error.remove());
          document.querySelectorAll('.error, .valid').forEach(input => {
            input.classList.remove('error', 'valid');
          });
        });
      });
    }
  }
  
  // Helper function to validate individual input
  function validateInput(input, showError = false) {
    // Remove existing validation states
    input.classList.remove('error', 'valid');
    const errorMessage = input.parentElement.querySelector('.input-error-message');
    if (errorMessage) errorMessage.remove();
    
    let isValid = true;
    let message = '';
    
    // Check for different input types
    if (input.id === 'name') {
      if (!input.value || input.value.length < 2) {
        isValid = false;
        message = 'Name must be at least 2 characters.';
      }
    } else if (input.id === 'email') {
      if (!input.value || !isValidEmail(input.value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (input.id === 'subject') {
      if (!input.value || input.value.length < 5) {
        isValid = false;
        message = 'Subject must be at least 5 characters.';
      }
    } else if (input.id === 'message') {
      if (!input.value || input.value.length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters.';
      }
    }
    
    // Show validation state
    if (!isValid && (showError || input.value)) {
      input.classList.add('error');
      if (showError) {
        showInputError(input, message);
      }
    } else if (input.value) {
      input.classList.add('valid');
    }
    
    return isValid;
  }
  
  // Helper function to show input errors
  function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = document.createElement('p');
    errorElement.className = 'input-error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
  }
  
  // Helper function to show form submit status
  function showSubmitStatus(type, message) {
    if (!submitStatus) return;
    
    submitStatus.className = 'form-status';
    submitStatus.classList.add(type);
    submitStatus.textContent = message;
    submitStatus.classList.remove('hidden');
    
    setTimeout(() => {
      submitStatus.classList.add('hidden');
    }, 5000);
  }
}

// Helper function to show form errors
function showError(input, message) {
  input.classList.add('error');
  const formGroup = input.closest('.form-group');
  const errorElement = document.createElement('p');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  formGroup.appendChild(errorElement);
}

// Helper function to show input errors
function showInputError(input, message) {
  input.classList.add('error');
  const formGroup = input.closest('.form-group');
  const errorElement = document.createElement('p');
  errorElement.className = 'input-error-message';
  errorElement.textContent = message;
  formGroup.appendChild(errorElement);
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === 'index.html' && href === './') || 
        (currentPage === '' && href === './')) {
      link.classList.add('active');
    }
    
    // Add page transition to all navigation links
    link.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      
      // Only process internal links
      if (target && target.startsWith('/portfolio') && !target.includes('#')) {
        e.preventDefault();
        
        // Add animation class to html
        document.documentElement.classList.add('is-animating');
        
        // Add transition class to main content
        document.body.classList.add('transition-fade');
        
        // Navigate after transition
        setTimeout(() => {
          window.location.href = target;
        }, 600);
      }
    });
  });
}

// Typing animation for hero section
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove a character
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add a character
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init TypeWriter On DOM Load
document.addEventListener('DOMContentLoaded', function() {
  const txtElement = document.querySelector('.txt-type');
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
  }
});

// Theme toggle functionality
function initThemeToggle() {
  // Create theme toggle button if it doesn't exist
  if (!document.querySelector('.theme-toggle')) {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
    themeToggle.innerHTML = `
      <i class="fas fa-moon moon-icon"></i>
      <i class="fas fa-sun sun-icon"></i>
    `;
    document.body.appendChild(themeToggle);
  }
  
  const themeToggle = document.querySelector('.theme-toggle');
  
  // Check if user has a theme preference stored
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Add event listener to toggle button
  themeToggle.addEventListener('click', () => {
    // Toggle theme
    let theme = 'light';
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      theme = 'dark';
    }
    
    // Set the theme on the html element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Store the user's preference
    localStorage.setItem('theme', theme);
    
    // Update partner logos to reset their hover state if any
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach(logo => {
      logo.style.transition = 'none';
      logo.offsetHeight; // Trigger reflow
      logo.style.transition = '';
    });
    
    // Announce theme change for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Theme switched to ${theme} mode`;
    document.body.appendChild(announcement);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
    
    // Dispatch custom event for theme change
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  });
}

// Initialize partner logos interaction
function initPartnerLogos() {
  const partnerLogos = document.querySelectorAll('.partner-logo');
  
  // Add staggered animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  partnerLogos.forEach(logo => {
    observer.observe(logo);
    
    // Add hover interactions
    logo.addEventListener('mouseenter', function() {
      const img = this.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
    });
    
    logo.addEventListener('mouseleave', function() {
      const img = this.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });
}

// The initPartnerLogos function is now called from the main DOMContentLoaded event

// Initialize image gallery modal functionality
function initImageGallery() {
  // Create modal container if it doesn't exist
  if (!document.getElementById('gallery-modal')) {
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-image-container">
          <img src="" alt="" class="modal-image">
        </div>
        <p class="modal-caption"></p>
        <div class="modal-nav">
          <button class="modal-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
          <button class="modal-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="modal-counter"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners to close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
    
    // Set up navigation buttons
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      
      if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });
  }
  
  // Find all gallery items and add click listeners
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGallery = [];
  let currentIndex = 0;
  
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Find all gallery items in the same gallery container
      const galleryContainer = item.closest('.image-gallery');
      currentGallery = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
      currentIndex = currentGallery.indexOf(item);
      
      openModal(item);
    });
  });
  
  // Open modal with selected image
  function openModal(item) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalCounter = modal.querySelector('.modal-counter');
    
    // Get image source and caption
    const imgElement = item.querySelector('img');
    const captionElement = item.querySelector('.gallery-caption');
    
    modalImage.src = imgElement.src;
    modalImage.alt = imgElement.alt || '';
    modalCaption.textContent = captionElement ? captionElement.textContent : imgElement.alt || '';
    
    // Update counter
    modalCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    
    // Show modal with animation
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
  
  // Close modal
  function closeModal() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Reset image src after transition for better memory management
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.querySelector('.modal-image').src = '';
      }
    }, 300);
  }
  
  // Navigate to previous image
  function showPrevImage() {
    if (currentGallery.length <= 1) return;
    
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    openModal(currentGallery[currentIndex]);
  }
  
  // Navigate to next image
  function showNextImage() {
    if (currentGallery.length <= 1) return;
    
    currentIndex = (currentIndex + 1) % currentGallery.length;
    openModal(currentGallery[currentIndex]);
  }
}