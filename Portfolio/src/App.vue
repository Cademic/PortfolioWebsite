<script setup lang="ts">
import { ref, reactive } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import ProjectCard from './components/ProjectCard.vue'

// Project data
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
    description: 'Created a blogging/social media platform with RESTful APIs using Java and Spring Boot. Designed and implemented MySQL schema for user authentication and post management. Integrated Spring Security for secure authentication and role-based access.',
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
      { name: 'GitHub' }
    ],
    links: [
      { text: 'Source Code', url: 'https://github.com/omniV1/CineScope' }
    ]
  }
]

// Contact form
const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const formStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const handleSubmit = async () => {
  isSubmitting.value = true
  formStatus.value = null
  
  try {
    // In a real application, you would send the form data to a backend service
    // For demo purposes, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    formStatus.value = {
      type: 'success',
      message: 'Thank you for your message! I will get back to you soon.'
    }
    
    // Reset the form
    contactForm.name = ''
    contactForm.email = ''
    contactForm.message = ''
  } catch (error) {
    formStatus.value = {
      type: 'error',
      message: 'There was an error sending your message. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="app">
    <TheHeader />
    
    <main class="main">
      <section id="home" class="hero">
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__title">Hi, I'm <span class="highlight">Carter Wright</span></h1>
            <p class="hero__subtitle">Full-Stack Developer | Passion for clean code</p>
            <div class="hero__cta">
              <a href="#projects" class="btn btn--primary">View My Work</a>
              <a href="#contact" class="btn btn--secondary">Contact Me</a>
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" class="section">
        <div class="container">
          <h2 class="section__title">About Me</h2>
          <div class="about__content">
            <div class="about__intro">
              <p>I have a passion for technology and have had since I was a child. After deciding to pursue a future career in software, I landed on software development where I can show my love for programming. I am currently a Senior at Grand Canyon University working towards a Bachelor's in Software Development plus a Minor in Cyber Security.</p>
              <br>
              <p>I would love to answer any questions you may have, feel free to contact me using my email or my LinkedIn!</p>
            </div>
          </div>
        </div>
      </section>
      
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
                    <span class="skill-percentage">85%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 85%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Java</span>
                    <span class="skill-percentage">80%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">JavaScript</span>
                    <span class="skill-percentage">65%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 65%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Python</span>
                    <span class="skill-percentage">70%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 70%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">HTML/CSS</span>
                    <span class="skill-percentage">80%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">C/C++</span>
                    <span class="skill-percentage">70%</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 60%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">SQL</span>
                    <span class="skill-percentage">85%</span>
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
      
      <section id="contact" class="section">
        <div class="container">
          <h2 class="section__title">Contact Me</h2>
          <div class="contact">
            <div class="contact__info">
              <p>Feel free to reach out to me through any of the channels below:</p>
              <ul class="contact__list">
                <li><strong>Email:</strong> carterwright221@gmail.com</li>
                <li><strong>Phone:</strong> (810)-569-3888</li>
                <li><strong>Location:</strong> Phoenix, AZ</li>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer">linkedin.com/in/carterdanw/</a></li>
                <li><strong>GitHub:</strong> <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer">github.com/cademic</a></li>
              </ul>
            </div>
            
            <form class="contact__form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="contactForm.name"
                  placeholder="Your Name"
                  required
                >
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="contactForm.email"
                  placeholder="your.email@example.com"
                  required
                >
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  v-model="contactForm.message"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <div v-if="formStatus" class="form-status" :class="{ 'form-status--success': formStatus.type === 'success' }">
                {{ formStatus.message }}
              </div>
              <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
    
    <TheFooter />
  </div>
</template>

<style>
/* Import Google Font for monospace */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --color-primary: #00e0ff;
  --color-primary-dark: #00b8cc;
  --color-secondary: #ff5f56;
  --color-accent-1: #ffbd2e;
  --color-accent-2: #27c93f;
  --color-accent-3: #bd93f9;
  --color-text: #f8f8f2;
  --color-text-light: #8f93a2;
  --color-background: #282a36;
  --color-background-alt: #1e1f29;
  --color-background-code: #21222c;
  --color-border: #44475a;
  --container-width: 1200px;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  line-height: 1.5;
  background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  font-family: var(--font-mono);
}

.main {
  padding-top: 80px; /* Height of the fixed header */
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.section {
  padding: var(--spacing-xl) 0;
  position: relative;
}

.section::before {
  content: '/** ' attr(id) ' */';
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: var(--color-text-light);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  opacity: 0.5;
}

.section__title {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  text-align: center;
  position: relative;
  color: var(--color-primary);
  display: inline-block;
}

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

/* Hero Section */
.hero {
  padding: var(--spacing-xl) 0;
  background-color: var(--color-background-alt);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
}

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

.hero__content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero__title {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  position: relative;
  display: inline-block;
}

.hero__title::before {
  content: 'System.Println("';
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

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-mono);
}

.highlight {
  color: var(--color-primary);
  position: relative;
}

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

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.5; }
}

.hero__cta {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Buttons */
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

.btn::before {
  content: '>';
  margin-right: 0.5rem;
  font-weight: bold;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.btn--primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 224, 255, 0.3);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn--secondary:hover {
  background-color: rgba(0, 224, 255, 0.1);
  transform: translateY(-2px);
}

/* Project Cards */
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
  margin: 2rem 0;
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
.contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-background-code);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  color: var(--color-text);
  font-size: 0.875rem;
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
  
  .section::before {
    display: none;
  }
}

/* About Section */
.about__content {
  max-width: 800px;
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

.about__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.about__card {
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  height: 100%;
  position: relative;
}

.about__subtitle {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: 1.1rem;
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

.about__list {
  list-style-type: none;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.about__list li {
  margin-bottom: 0.5rem;
  position: relative;
}

.indented {
  padding-left: 1.5rem;
}

.card-closing {
  font-family: var(--font-mono);
  color: var(--color-text);
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .about__details {
    grid-template-columns: 1fr;
  }
  
  .about__card {
    margin-bottom: var(--spacing-md);
  }
}

</style>
