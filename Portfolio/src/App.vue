<!--
  App.vue
  
  The main application component that serves as the entry point for the portfolio website.
  
  This component:
  1. Imports and orchestrates all child components
  2. Contains project data
  3. Implements the contact form functionality
  4. Defines the overall page structure and sections
  5. Contains the global styling for the application
-->

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import ProjectCard from './components/ProjectCard.vue'

/**
 * Project data array containing information about each project
 * Each project includes title, description, technology tags, and links
 */
const projects = [
  {
    title: 'MineSweeper',
    description: 'Developed a full-stack replication of the classic Minesweeper game using C# and Razor Pages. Integrated a MySQL database for storing users, game states, and scores.',
    tags: [
      { name: 'C#' },
      { name: '.NET Framework' },
      { name: 'MySQL' },
      { name: 'GitHub' }
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/NoahStarkenburg/MineSweeper' }
    ]
  },
  {
    title: 'Blodged',
    description: 'Developing a blogging/social media platform with RESTful APIs using Java and Spring Boot. Designed and implemented MySQL schema for user authentication and post management. Integrated Spring Security for secure authentication and role-based access.',
    tags: [
      { name: 'Java' },
      { name: 'Spring Boot' },
      { name: 'MySQL' },
      { name: 'RESTful API' }
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/Cademic/blodged' }
    ]
  },
  {
    title: 'CineScope',
    description: 'Built a movie review app enabling user ratings and reviews. Collaborated using Jira, Confluence, and GitHub for project management.',
    tags: [
      { name: 'C#' },
      { name: '.NET Framework' },
      { name: 'Jira' },
      { name: 'MongoDB' }
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/omniV1/CineScope' }
    ]
  },
  {
    title: 'Lunara Postpartum Support Platform',
    description: 'Lunara is a comprehensive platform designed to provide support for individuals during the postpartum period. It features a robust backend API and a modern frontend interface.',
    tags: [
      { name: 'Express.js' },
      { name: 'MongoDB' },
      { name: 'TypeScript' },
      { name: 'React' },
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/omniV1/AQC' }
    ]
  },
  {
    title: 'TableWorks',
    description: 'Creating a web application designed to help users organize and manage data efficiently using customizable lists and a table-based layout.',
    tags: [
      { name: 'Spring Boot' },
      { name: 'PostgreSQL' },
      { name: 'TypeScript' },
      { name: 'React' },
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/Cademic/TableWorks' }
    ]
  }
  
]

/**
 * Contact form state variables
 * @property {boolean} formSubmitting - Tracks when the form is being submitted
 * @property {boolean} formSubmitted - Tracks if the form was successfully submitted
 * @property {string} formError - Stores any error messages during form submission
 */
const formSubmitting = ref(false)
const formSubmitted = ref(false)
const formError = ref('')

/**
 * Handles the contact form submission using Formspree
 * Sends data asynchronously and manages submission state
 * 
 * @param {Event} event - The form submission event
 */
const handleSubmit = async (event: Event) => {
  event.preventDefault()
  formSubmitting.value = true
  formError.value = ''
  
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  
  try {
    // Submit form data to Formspree endpoint
    const response = await fetch('https://formspree.io/f/mpwdbery', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      // Handle successful submission
      formSubmitted.value = true
      form.reset()
    } else {
      // Handle error response from Formspree
      const data = await response.json()
      formError.value = data.error || 'Something went wrong. Please try again.'
    }
  } catch (error) {
    // Handle network errors
    formError.value = 'Network error. Please try again.'
    console.error('Form submission error:', error)
  } finally {
    formSubmitting.value = false
  }
}
</script>

<template>
  <div class="app">
    <!-- Site header with navigation -->
    <TheHeader />
    
    <main class="main">
      <!-- Hero/Home Section -->
      <section id="home" class="hero">
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__title">Hi, I'm <span class="highlight">Carter Wright</span></h1>
            <p class="hero__subtitle">Full-Stack Software Developer</p>
            <div class="hero__cta">
              <a href="#projects" class="btn btn--primary" v-smooth-scroll>View My Work</a>
              <a href="#contact" class="btn btn--secondary" v-smooth-scroll>Contact Me</a>
              <a href="/resume.pdf" class="btn btn--primary" target="_blank" rel="noopener noreferrer">View Resume</a>
            </div>
            <div class="social-links">
                  <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- About Section -->
      <section id="about" class="section">
        <div class="container">
          <h2 class="section__title">About Me</h2>
          <div class="about__content about__content--with-image">
            <img src="/CarterPFP.jpg" alt="Carter Wright" class="about__image" />
            <div class="about__intro">
              <p>Hello! My name is Carter Wright. I am an upcoming software developer looking to enhance my skills while doing what I love.</p>
              <br>
              <p>I am originally from Michigan, but currently living in <b>Pheonix, AZ</b> as I am studing for my <b>Bachelors in Software Development at Grand Canyon University</b>. I am set to graduate in April 2026 and searching for the perfect postion to get my foot into the door in this career.</p>
              <br>
              <p>My recent work has focused on full-stack web development using <b>C# ASP.NET</b>, <b>Enterprise Java</b>, and <b>Node.js</b>. I also have experience in cybersecurity and integrating industry-standard frameworks such as <b>NIST</b>, <b>CIS</b>, <b>MITRE</b>, and <b>OWASP</b> into my applications.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Projects Section -->
      <section id="projects" class="section">
        <div class="container">
          <h2 class="section__title">My Projects</h2>
          <div class="projects__grid">
            <ProjectCard 
              v-for="project in projects" 
              :key="project.title"
              :title="project.title"
              :description="project.description"
              :tags="project.tags"
              :links="project.links"
            />
          </div>
        </div>
      </section>
      
      <!-- Skills Section -->
      <section id="skills" class="section">
        <div class="container">
          <h2 class="section__title">Skills</h2>
          <div class="skills__grid">
            <div class="skill skills-container">
              <h3 class="skill__title">Languages & Technologies</h3>
              <div class="skill-subtitle"><span class="code-keyword">const</span> <span class="code-var">mySkills</span> = {</div>
              <div class="skill__list">

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">ASP.NET/C#</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 85%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Java</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">JavaScript/TypeScript</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 65%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Python</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 70%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">HTML/CSS</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">C/C++</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 60%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">SQL</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 85%"></div>
                  </div>
                </div>

              </div>
              <div class="skill-closing">}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Contact Section -->
      <section id="contact" class="section">
        <div class="container">
          <h2 class="section__title">Contact Me</h2>
          <div class="contact-wrapper">
            <div class="contact">
              <div class="contact__info">
                <h3 class="contact-subtitle">Get In Touch</h3>
                <p class="contact-text">Feel free to reach out through any of these channels:</p>
                <ul class="contact__list">
                  <li class="contact-item">
                    <span class="contact-icon">📧</span>
                    <span class="contact-label">Email:</span>
                    <span class="contact-value">carterwright221@gmail.com</span>
                  </li>
                  <li class="contact-item">
                    <span class="contact-icon">📱</span>
                    <span class="contact-label">Phone:</span>
                    <span class="contact-value">(810)-569-3888</span>
                  </li>
                  <li class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span class="contact-label">Location:</span>
                    <span class="contact-value">Phoenix, AZ</span>
                  </li>
                </ul>
                <div class="social-links">
                  <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
              
              <div class="contact__form-container">
                <h3 class="contact-subtitle">Send a Message</h3>
                
                <!-- Show success message when form is submitted -->
                <div v-if="formSubmitted" class="form-status form-status--success">
                  Thank you for your message! I'll get back to you soon.
                </div>
                
                <!-- Show error message if there was an error -->
                <div v-if="formError" class="form-status">
                  {{ formError }}
                </div>
                
                <!-- Contact form using Formspree for submission -->
                <form 
                  class="contact__form" 
                  @submit="handleSubmit"
                  action="https://formspree.io/f/mpwdbery" 
                  method="POST"
                >
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      placeholder="Your Name"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="your.email@example.com"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows="8" 
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn--primary"
                    :disabled="formSubmitting"
                  >
                    {{ formSubmitting ? 'Sending...' : 'Send Message' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
  </main>
    
    <!-- Site footer -->
    <TheFooter />
  </div>
</template>

<style>
/* Import Google Font for monospace */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/**
 * Global CSS Variables
 * Defines color palette, spacing, and fonts used throughout the application
 */
:root {
  /* Color Palette - Based on a dark coding theme */
  --color-primary: #00e0ff;         /* Primary accent color - bright cyan */
  --color-primary-dark: #00b8cc;    /* Darker version of primary for hover states */
  --color-secondary: #ff5f56;       /* Secondary accent - soft red */
  --color-accent-1: #ffbd2e;        /* Yellow accent for highlights */
  --color-accent-2: #27c93f;        /* Green accent for success states */
  --color-accent-3: #bd93f9;        /* Purple accent for additional highlights */
  
  /* Text Colors */
  --color-text: #f8f8f2;            /* Primary text color - off-white */
  --color-text-light: #8f93a2;      /* Secondary text color - light gray */
  
  /* Background Colors */
  --color-background: #282a36;      /* Main background - dark blue-gray */
  --color-background-alt: #1e1f29;  /* Alternate background - slightly darker */
  --color-background-code: #21222c; /* Code blocks background - even darker */
  
  /* Border Colors */
  --color-border: #44475a;          /* Border color - medium gray */
  
  /* Layout Variables */
  --container-width: 1200px;        /* Maximum content width */
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 2.5rem;
  
  /* Typography */
  --font-mono: 'JetBrains Mono', monospace;
}

/* Global Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Enable smooth scrolling for the entire site */
html {
  scroll-behavior: smooth;
}

/* Base Body Styles */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  line-height: 1.5;
  background-color: var(--color-background);
}

/* Typography Defaults */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  font-family: var(--font-mono);
}

/* Main Content Area */
.main {
  padding-top: 80px; /* Height of the fixed header */
}

/* Container for Content Sections */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Standard Section Styling */
.section {
  padding: var(--spacing-lg) 0;
  position: relative;
  scroll-margin-top: 80px; /* Accounts for fixed header height when scrolling to anchors */
}

/* Section Title Styling */
.section__title {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  text-align: center;
  position: relative;
  color: var(--color-primary);
  display: inline-block;
}

/* Code-like tag decorations for section titles */
.section__title::before {
  content: '<';
  margin-right: 0.5rem;
  opacity: 0.7;
}

.section__title::after {
  content: '/>';
  margin-left: 0.5rem;
  opacity: 0.7;
}

/* 
 * Hero Section Styling 
 * First section of the page with the main headline and CTA buttons
 */
.hero {
  padding: var(--spacing-lg) 0;
  background-color: var(--color-background-alt);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  scroll-margin-top: 80px; /* Accounts for fixed header height */
}

/* Background grid pattern for hero section */
.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, var(--color-background-alt) 50%, transparent 50%),
    linear-gradient(to bottom, var(--color-background-alt) 50%, transparent 50%);
  background-size: 30px 30px;
  opacity: 0.05;
  pointer-events: none;
}

/* Gradient fade at bottom of hero section */
.hero::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to bottom, transparent, var(--color-background-alt) 90%);
  z-index: 1;
}

/* Hero content container */
.hero__content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Main headline styling */
.hero__title {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  position: relative;
  display: inline-block;
}

/* Decorative code-like elements for the title */
.hero__title::before {
  content: 'System.Out.Println("';
  font-size: 1rem;
  position: absolute;
  top: -1.5rem;
  left: 0;
  color: var(--color-accent-1);
  font-family: var(--font-mono);
  opacity: 0.7;
}

.hero__title::after {
  content: '");';
  font-size: 1rem;
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  color: var(--color-accent-1);
  font-family: var(--font-mono);
  opacity: 0.7;
}

/* Subtitle styling */
.hero__subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-mono);
}

/* Name highlight with cursor effect */
.highlight {
  color: var(--color-primary);
  position: relative;
}

/* Blinking cursor after highlighted name */
.highlight::after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: var(--color-primary);
  animation: blink 1s step-end infinite;
  opacity: 0.5;
  vertical-align: text-bottom;
  margin-left: 5px;
}

/* Cursor blink animation */
@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.5; }
}

/* Call to action button container */
.hero__cta {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* 
 * Button Styles 
 * Used for CTA buttons and form submission
 */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-mono);
  position: relative;
  border: none;
}

/* Terminal-like prompt before buttons */
.btn::before {
  content: '>';
  margin-right: 0.5rem;
  font-weight: bold;
}

/* Primary button - solid background */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-background);
}

/* Primary button hover effect */
.btn--primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 224, 255, 0.3);
}

/* Secondary button - outlined style */
.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* Secondary button hover effect */
.btn--secondary:hover {
  background-color: rgba(0, 224, 255, 0.1);
  transform: translateY(-2px);
}

/* Project Cards */
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

/* Skills Section */
.skills__grid {
  display: flex;
  justify-content: center;
}

.skills-container {
  max-width: 800px;
  width: 100%;
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  position: relative;
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
}

.skill-name {
  color: var(--color-text);
}

.skill-percentage {
  color: var(--color-accent-1);
}

.skill-bar {
  height: 8px;
  background-color: var(--color-background-alt);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-border);
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-2), var(--color-primary));
  border-radius: 4px;
  position: relative;
  transition: width 1.5s ease;
  animation: progress 1.5s ease;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0.15) 25%, 
              transparent 25%, 
              transparent 50%, 
              rgba(255, 255, 255, 0.15) 50%, 
              rgba(255, 255, 255, 0.15) 75%, 
              transparent 75%, 
              transparent);
  background-size: 20px 20px;
  animation: move 1s linear infinite;
  opacity: 0.3;
}

@keyframes progress {
  0% {
    width: 0;
  }
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

.skill-subtitle {
  font-family: var(--font-mono);
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.skill-closing {
  font-family: var(--font-mono);
  color: var(--color-text-light);
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Contact Section */
.contact-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.contact {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-lg);
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.contact-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-weight: 600;
}

.contact-text {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

.contact__list {
  list-style: none;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.contact-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.contact-label {
  color: var(--color-accent-1);
  margin-right: 0.5rem;
  font-weight: 500;
}

.contact-value {
  color: var(--color-text);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.social-link {
  color: var(--color-primary);
  transition: color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
}

.social-link:hover {
  color: var(--color-accent-2);
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

.contact__form-container {
  position: relative;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-accent-1);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input {
  height: 50px;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 224, 255, 0.1);
}

.form-status {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: rgba(255, 95, 86, 0.1);
  color: var(--color-secondary);
  border-left: 3px solid var(--color-secondary);
}

.form-status--success {
  background-color: rgba(39, 201, 63, 0.1);
  color: var(--color-accent-2);
  border-left: 3px solid var(--color-accent-2);
}

@media (max-width: 768px) {
  .contact {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .contact__info {
    margin-bottom: 2rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-alt);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Responsive styles */
@media (max-width: 768px) {
  .hero__title {
    font-size: 2.5rem;
  }
  
  .hero__subtitle {
    font-size: 1.125rem;
  }
  
  .contact {
    grid-template-columns: 1fr;
  }
  
  /* Section comment already removed */
}

/* About Section */
.about__content,
.about__content--with-image {
  max-width: 2000px;
  margin: 0 auto;
}

.about__intro {
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.about__intro::before {
  content: '/**';
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--color-accent-3);
  font-family: var(--font-mono);
  opacity: 0.6;
}

.about__intro::after {
  content: '*/';
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--color-accent-3);
  font-family: var(--font-mono);
  opacity: 0.6;
}

.code-keyword {
  color: var(--color-secondary);
}

.code-var {
  color: var(--color-accent-2);
}

.code-comment {
  color: var(--color-accent-3);
  font-size: 0.85rem;
}

.about__content--with-image {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.about__image {
  width: 500px;
  height: 700px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  border: 2px solid var(--color-border);
  background: var(--color-background-code);
}

@media (max-width: 900px) {
  .about__content--with-image {
    flex-direction: column;
    align-items: center;
  }
  .about__image {
    width: 70vw;
    max-width: 420px;
    height: auto;
    margin-bottom: 1.5rem;
  }
}

</style>
