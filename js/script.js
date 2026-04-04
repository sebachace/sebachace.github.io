/**
 * Data Science Portfolio - JavaScript Functionality
 * This script handles all the interactive elements of the portfolio:
 * - Navigation and scrolling
 * - Project filtering and modals
 * - Skill animations
 * - Scroll reveal animations
 * - Contact form validation
 * - Particles background
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions
  initNavigation();
  initProjectFilters();
  initProjectModals();
  initSkillsAnimation();
  initScrollReveal();
  initContactForm();
  initCopyEmail();
  initBackToTop();
  initTypingAnimation();
});

/**
* Navigation functionality
* - Handles sticky navigation
* - Mobile menu toggle
* - Active nav links on scroll
*/
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Sticky navbar on scroll
  window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
      
      // Update active nav link based on scroll position
      let current = '';
      sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
              current = section.getAttribute('id');
          }
      });
      
      allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === current) {
              link.classList.add('active');
          }
      });
  });
  
  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  allNavLinks.forEach(link => {
      link.addEventListener('click', function() {
          navLinks.classList.remove('active');
          navToggle.classList.remove('active');
      });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !navToggle.contains(e.target)) {
          navLinks.classList.remove('active');
          navToggle.classList.remove('active');
      }
  });
}

/**
* Project filtering functionality
*/
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          // Remove active class from all buttons
          filterBtns.forEach(b => b.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          const filter = this.getAttribute('data-filter');
          
          // Show/hide projects based on filter with fade transition
          projectCards.forEach(card => {
              const matches = filter === 'all' || card.getAttribute('data-category') === filter;
              if (matches) {
                  card.style.display = 'flex';
                  requestAnimationFrame(() => { card.style.opacity = '1'; });
              } else {
                  card.style.opacity = '0';
                  setTimeout(() => { card.style.display = 'none'; }, 250);
              }
          });
      });
  });
}

/**
* Project modals functionality
*/
function initProjectModals() {
  // Only apply to cards that don't have their own custom viz modal (no onclick attribute)
  const projectBtns = document.querySelectorAll('.project-details-btn:not([onclick])');
  const modal = document.getElementById('projectModal');
  const closeModal = document.querySelector('.close-modal');

  if (!modal) return;

  const projectData = [
      {
          title: "Predictive Analytics Model",
          description: "A machine learning model tuning risk indicators in one of Italy's biggest banks, abstracting non-business-related rules from empirical data, allowing the client to reduce total effort to resolve alerts.",
          methodology: "Applied supervised learning algorithms including Random Forest, Gradient Boosting, and Neural Networks. Performed extensive feature engineering and hyperparameter tuning to optimize model performance within strict regulatory constraints.",
          results: "The model successfully reduced false positive alerts, significantly cutting manual review effort for the compliance team and improving overall operational efficiency.",
          technologies: ["Python", "scikit-learn", "Pandas", "TensorFlow"],
          image: "images/Intelligent_Dashboarding.jpeg"
      }
  ];

  // Open modal with project details
  projectBtns.forEach((btn, index) => {
      btn.addEventListener('click', function() {
          const project = projectData[index];
          if (!project) return;

          document.getElementById('modalTitle').textContent = project.title;
          document.getElementById('modalImage').src = project.image;
          document.getElementById('modalDescription').textContent = project.description;
          document.getElementById('modalMethodology').textContent = project.methodology;
          document.getElementById('modalResults').textContent = project.results;

          const techContainer = document.getElementById('modalTech');
          techContainer.innerHTML = '';
          project.technologies.forEach(tech => {
              const span = document.createElement('span');
              span.textContent = tech;
              techContainer.appendChild(span);
          });

          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
      });
  });
  
  // Close modal
  closeModal.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scrolling
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
      if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
  });
  
  // Close modal with ESC key (covers project modal + all viz modals)
  document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return;
      if (modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
      if (typeof closeNetworkViz === 'function') closeNetworkViz();
      if (typeof closeOptimizationViz === 'function') closeOptimizationViz();
      if (typeof closeNlpViz === 'function') closeNlpViz();
  });
}

/**
* Skills animation - animate progress bars on scroll
*/
function initSkillsAnimation() {
  const skillsSection = document.querySelector('.skills-section');
  const progressBars = document.querySelectorAll('.skill-progress');
  
  function animateSkills() {
      if (isElementInViewport(skillsSection)) {
          progressBars.forEach(bar => {
              const progress = bar.getAttribute('data-progress');
              bar.style.width = `${progress}%`;
          });
          // Remove event listener after animation
          window.removeEventListener('scroll', animateSkills);
      }
  }
  
  // Initial check and add scroll listener
  animateSkills();
  window.addEventListener('scroll', animateSkills);
}

/**
* Scroll reveal animation
* Animate elements as they come into view
*/
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  
  function revealOnScroll() {
      revealItems.forEach(item => {
          if (isElementInViewport(item, 0.2)) {
              item.classList.add('active');
          }
      });
  }
  
  // Initial check and add scroll listener
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
}

/**
* Contact form validation and submission via Formspree
*/
function initContactForm() {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  // Real-time blur validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  contactForm.querySelectorAll('input, textarea').forEach(function(field) {
      field.addEventListener('blur', function() {
          const group = field.closest('.form-group');
          if (!group) return;
          const empty = field.value.trim() === '';
          const invalidEmail = field.type === 'email' && !empty && !emailRegex.test(field.value.trim());
          group.classList.toggle('field-error', empty || invalidEmail);
      });
      field.addEventListener('input', function() {
          const group = field.closest('.form-group');
          if (group) group.classList.remove('field-error');
      });
  });

  contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (name === '' || email === '' || subject === '' || message === '') {
          showFormStatus('Please fill out all fields.', 'error');
          return;
      }

      if (!emailRegex.test(email)) {
          showFormStatus('Please enter a valid email address.', 'error');
          return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
          const response = await fetch('https://formspree.io/f/xqedvlrj', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, subject, message })
          });

          if (response.ok) {
              showFormStatus('Thank you! Your message has been sent.', 'success');
              contactForm.reset();
          } else {
              showFormStatus('Something went wrong. Please try again or email me directly.', 'error');
          }
      } catch (err) {
          showFormStatus('Something went wrong. Please try again or email me directly.', 'error');
      } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
      }
  });
}

function showFormStatus(message, type) {
  const statusEl = document.getElementById('formStatus');
  if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = 'form-status ' + type;
      statusEl.style.display = 'block';
      setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
  }
}

/**
* Copy email functionality
*/
function initCopyEmail() {
  const copyBtn = document.querySelector('.copy-btn');
  
  if (copyBtn) {
      copyBtn.addEventListener('click', function() {
          const email = this.getAttribute('data-copy');
          
          navigator.clipboard.writeText(email).catch(() => {
              // Fallback for browsers that don't support Clipboard API
              const tempInput = document.createElement('input');
              tempInput.value = email;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
          });
          
          // Show copied confirmation
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i>';
          
          // Reset after 2 seconds
          setTimeout(() => {
              this.innerHTML = originalText;
          }, 2000);
      });
  }
}


/**
* Utility function to check if element is in viewport
* @param {HTMLElement} el - The element to check
* @param {number} offset - Offset value (0 to 1) to determine when element is considered in viewport
* @returns {boolean} - Whether element is in viewport
*/
function isElementInViewport(el, offset = 0) {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Check if element is in viewport with offset
  return (
      rect.top <= windowHeight * (1 - offset) &&
      rect.bottom >= 0
  );
}


/**
* Back-to-top button functionality
*/
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
          btn.classList.add('visible');
      } else {
          btn.classList.remove('visible');
      }
  });

  btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
* Cycling typewriter animation on home subtitle
*/
function initTypingAnimation() {
  const el = document.querySelector('.home-content h2');
  if (!el) return;

  const phrases = [
      'Sr. Data Scientist & ML Engineer',
      'Team builder',
      'Empathetic listener',
      'Realistic Optimist'
  ];

  el.textContent = '';
  const textNode = document.createTextNode('');
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(textNode);
  el.appendChild(cursor);

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
          charIndex++;
          textNode.nodeValue = current.slice(0, charIndex);
          if (charIndex === current.length) {
              deleting = true;
              setTimeout(tick, 2200);
          } else {
              setTimeout(tick, 65);
          }
      } else {
          charIndex--;
          textNode.nodeValue = current.slice(0, charIndex);
          if (charIndex === 0) {
              deleting = false;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              setTimeout(tick, 350);
          } else {
              setTimeout(tick, 35);
          }
      }
  }

  tick();
}

