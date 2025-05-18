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
    imageUrl: 'https://via.placeholder.com/600x400?text=MineSweeper',
    tags: [
      { name: 'C#' },
      { name: '.NET Framework' },
      { name: 'MySQL' },
      { name: 'GitHub' }
    ],
    links: [
      { text: 'Source Code', url: '#' }
    ]
  },
  {
    title: 'Blodged',
    description: 'Created a blogging/social media platform with RESTful APIs using Java and Spring Boot. Designed and implemented MySQL schema for user authentication and post management. Integrated Spring Security for secure authentication and role-based access.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Blodged',
    tags: [
      { name: 'Java' },
      { name: 'Spring Boot' },
      { name: 'MySQL' },
      { name: 'RESTful API' }
    ],
    links: [
      { text: 'Source Code', url: '#' }
    ]
  },
  {
    title: 'CineScope',
    description: 'Built a movie review app enabling user ratings and reviews. Collaborated using Jira, Confluence, and GitHub for project management.',
    imageUrl: 'https://via.placeholder.com/600x400?text=CineScope',
    tags: [
      { name: 'C#' },
      { name: '.NET Framework' },
      { name: 'Jira' },
      { name: 'GitHub' }
    ],
    links: [
      { text: 'Source Code', url: '#' }
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
            <div class="about__text">
              <p>I'm a Software Development student at Grand Canyon University with a minor in Cyber Security. I'm passionate about creating clean, efficient code and building applications that solve real-world problems.</p>
              <p><strong>Education:</strong></p>
              <ul>
                <li>Bachelor of Science in Software Development (Expected May 2026)</li>
                <li>Minor in Cyber Security</li>
                <li>GCU Tech Club & IEEE Club member</li>
              </ul>
              <p><strong>Experience:</strong></p>
              <p>Currently working as an Asset and Space Database Assistant at Grand Canyon Education, where I:</p>
              <ul>
                <li>Use databases to locate and input assets</li>
                <li>Streamline preventive maintenance schedules</li>
                <li>Communicate with teammates to complete projects</li>
                <li>Maintain upkeep and troubleshoot facility applications</li>
              </ul>
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
              :imageUrl="project.imageUrl"
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
            <div class="skill">
              <h3 class="skill__title">Languages</h3>
              <ul class="skill__list">
                <li>Java</li>
                <li>C#</li>
                <li>C</li>
                <li>C++</li>
                <li>Python</li>
                <li>Go</li>
                <li>JavaScript</li>
                <li>HTML/CSS</li>
                <li>Bash</li>
              </ul>
            </div>
            
            <div class="skill">
              <h3 class="skill__title">Frameworks & Technologies</h3>
              <ul class="skill__list">
                <li>Spring Boot</li>
                <li>.NET Framework</li>
                <li>React</li>
                <li>RESTful APIs</li>
                <li>MySQL</li>
                <li>PostgreSQL</li>
                <li>MongoDB</li>
              </ul>
            </div>
            
            <div class="skill">
              <h3 class="skill__title">Tools & Other Skills</h3>
              <ul class="skill__list">
                <li>Git & GitHub</li>
                <li>VS Code</li>
                <li>Visual Studio</li>
                <li>Eclipse</li>
                <li>MySQL Workbench</li>
                <li>Agile</li>
                <li>Jira & Confluence</li>
                <li>Ubuntu, Windows, MacOS</li>
              </ul>
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
@import './styles/App.css';
</style>
