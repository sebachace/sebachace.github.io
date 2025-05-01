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
  initParticles();
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
          
          // Show/hide projects based on filter
          projectCards.forEach(card => {
              if (filter === 'all' || card.getAttribute('data-category') === filter) {
                  card.style.display = 'flex';
              } else {
                  card.style.display = 'none';
              }
          });
      });
  });
}

/**
* Project modals functionality
*/
function initProjectModals() {
  const projectBtns = document.querySelectorAll('.project-details-btn');
  const modal = document.getElementById('projectModal');
  const closeModal = document.querySelector('.close-modal');
  
  // Sample project data (replace with your actual projects)
  const projectData = [
      {
          title: "Predictive Analytics Model",
          description: "A machine learning model for predicting customer behavior using historical transaction data.",
          methodology: "Applied various supervised learning algorithms including Random Forest, Gradient Boosting, and Neural Networks. Performed extensive feature engineering and hyperparameter tuning to optimize model performance.",
          results: "Achieved 92% prediction accuracy, resulting in a 15% increase in customer retention and $2M in annual revenue increase for the client.",
          technologies: ["Python", "scikit-learn", "Pandas", "TensorFlow", "AWS SageMaker"],
          image: "https://via.placeholder.com/900x600",
          codeLink: "https://github.com/",
          demoLink: "#"
      },
      {
          title: "Financial Data Analysis",
          description: "Comprehensive analysis of financial time series data to identify market trends and patterns.",
          methodology: "Utilized time series decomposition, ARIMA modeling, and anomaly detection algorithms to analyze historical stock data and identify patterns.",
          results: "Developed a trading strategy that outperformed market benchmarks by 7% annually in backtesting, with clear visualization of market trends.",
          technologies: ["R", "ggplot2", "Tableau", "tidyverse", "Prophet"],
          image: "https://via.placeholder.com/900x600",
          codeLink: "https://github.com/",
          demoLink: "#"
      },
      {
          title: "Interactive Data Dashboard",
          description: "Interactive visualization dashboard for exploring and analyzing complex datasets.",
          methodology: "Designed and implemented an interactive dashboard using D3.js for visualizing multidimensional data. Applied principles of effective data visualization to present complex information clearly.",
          results: "Created a user-friendly dashboard that allows stakeholders to explore data, filter results, and export findings, leading to more data-driven decision making.",
          technologies: ["D3.js", "JavaScript", "HTML/CSS", "SVG", "JSON"],
          image: "https://via.placeholder.com/900x600",
          codeLink: "https://github.com/",
          demoLink: "#"
      },
      {
          title: "Natural Language Processing",
          description: "Text classification and sentiment analysis model for customer feedback.",
          methodology: "Preprocessed and tokenized text data, applied BERT-based models for sentiment analysis and text classification. Used data augmentation to handle class imbalance.",
          results: "Built a model with 89% accuracy in classifying customer feedback into categories, enabling automated routing and prioritization of customer issues.",
          technologies: ["NLTK", "TensorFlow", "BERT", "spaCy", "Python"],
          image: "https://via.placeholder.com/900x600",
          codeLink: "https://github.com/",
          demoLink: "#"
      }
  ];
  
  // Open modal with project details
  projectBtns.forEach((btn, index) => {
      btn.addEventListener('click', function() {
          const project = projectData[index];
          
          // Populate modal with project data
          document.getElementById('modalTitle').textContent = project.title;
          document.getElementById('modalImage').src = project.image;
          document.getElementById('modalDescription').textContent = project.description;
          document.getElementById('modalMethodology').textContent = project.methodology;
          document.getElementById('modalResults').textContent = project.results;
          
          // Add technologies
          const techContainer = document.getElementById('modalTech');
          techContainer.innerHTML = '';
          project.technologies.forEach(tech => {
              const span = document.createElement('span');
              span.textContent = tech;
              techContainer.appendChild(span);
          });
          
          // Set links
          document.getElementById('codeLink').href = project.codeLink;
          document.getElementById('demoLink').href = project.demoLink;
          
          // Show modal
          modal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
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
  
  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
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
* Contact form validation and submission
*/
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const subject = document.getElementById('subject').value.trim();
          const message = document.getElementById('message').value.trim();
          
          // Validate form
          if (name === '' || email === '' || subject === '' || message === '') {
              alert('Please fill out all fields');
              return;
          }
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
              alert('Please enter a valid email address');
              return;
          }
          
          // In a real scenario, you would send this data to your server
          // For the template, we'll just show a success message
          alert('Thank you for your message! I will get back to you soon.');
          contactForm.reset();
      });
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
          
          // Create a temporary input element
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          
          // Select and copy the text
          tempInput.select();
          document.execCommand('copy');
          
          // Remove the temporary input
          document.body.removeChild(tempInput);
          
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
* Initialize particles.js background
*/
function initParticles() {
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
      particlesJS('particles-js', {
          particles: {
              number: { 
                  value: 50,
                  density: { enable: true, value_area: 800 } 
              },
              color: { value: '#64ffda' },
              shape: {
                  type: 'circle',
                  stroke: { width: 0, color: '#000000' }
              },
              opacity: {
                  value: 0.5,
                  random: false,
                  anim: { enable: false }
              },
              size: {
                  value: 3,
                  random: true,
                  anim: { enable: false }
              },
              line_linked: {
                  enable: true,
                  distance: 150,
                  color: '#64ffda',
                  opacity: 0.4,
                  width: 1
              },
              move: {
                  enable: true,
                  speed: 1,
                  direction: 'none',
                  random: false,
                  straight: false,
                  out_mode: 'out',
                  bounce: false,
                  attract: { enable: false }
              }
          },
          interactivity: {
              detect_on: 'canvas',
              events: {
                  onhover: { enable: true, mode: 'grab' },
                  onclick: { enable: true, mode: 'push' },
                  resize: true
              },
              modes: {
                  grab: { distance: 140, line_linked: { opacity: 1 } },
                  push: { particles_nb: 4 }
              }
          },
          retina_detect: true
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
* Download resume functionality
*/
document.addEventListener('DOMContentLoaded', function() {
  const downloadResumeBtn = document.getElementById('downloadResume');
  
  if (downloadResumeBtn) {
      downloadResumeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // In a real portfolio, this would link to an actual PDF file
        //   alert('In the actual portfolio, this button would download your resume PDF.');
          
          // Example of how to trigger a download (uncomment and update when you have an actual resume file)
          const link = document.createElement('a');
          link.href = '/resources/Resume Seb ENG_2025.pdf';
          link.download = 'Resume Seb ENG_2025.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
      });
  }
});

/**
* This function allows for custom theming by changing CSS variables
* You can expose this functionality to users or use it to have multiple theme options
* @param {Object} colors - Object containing color variables to update
*/
function updateTheme(colors) {
  const root = document.documentElement;
  
  // Update CSS variables with new colors
  if (colors.primary) root.style.setProperty('--primary-color', colors.primary);
  if (colors.primaryLight) root.style.setProperty('--primary-light', colors.primaryLight);
  if (colors.primaryDark) root.style.setProperty('--primary-dark', colors.primaryDark);
  if (colors.accent) root.style.setProperty('--accent-color', colors.accent);
  if (colors.textPrimary) root.style.setProperty('--text-primary', colors.textPrimary);
  if (colors.textSecondary) root.style.setProperty('--text-secondary', colors.textSecondary);
  if (colors.bgColor) root.style.setProperty('--bg-color', colors.bgColor);
  if (colors.cardBg) root.style.setProperty('--card-bg', colors.cardBg);
  
  // If using particles.js, update particle colors as well
  if (window.pJSDom && window.pJSDom.length > 0) {
      const particles = window.pJSDom[0].pJS.particles;
      
      if (colors.accent) {
          particles.color.value = colors.accent;
          particles.line_linked.color = colors.accent;
      }
      
      // Refresh particles
      window.pJSDom[0].pJS.fn.particlesRefresh();
  }
}

// Example theme presets (uncomment to use)
/*
const themes = {
  blue: {
      primary: '#0a192f',
      primaryLight: '#112240', 
      primaryDark: '#051124',
      accent: '#64ffda',
      textPrimary: '#e6f1ff',
      textSecondary: '#8892b0',
      bgColor: '#0a192f',
      cardBg: '#112240'
  },
  purple: {
      primary: '#2d1950',
      primaryLight: '#3b2269',
      primaryDark: '#1e1038',
      accent: '#bd93f9',
      textPrimary: '#f8f8f2',
      textSecondary: '#c0b9d6',
      bgColor: '#2d1950',
      cardBg: '#3b2269'
  },
  dark: {
      primary: '#1a1a1a',
      primaryLight: '#2c2c2c',
      primaryDark: '#0f0f0f',
      accent: '#3699ff',
      textPrimary: '#ffffff',
      textSecondary: '#b0b0b0',
      bgColor: '#1a1a1a',
      cardBg: '#2c2c2c' 
  }
};

// To change theme:
// updateTheme(themes.purple);
*/