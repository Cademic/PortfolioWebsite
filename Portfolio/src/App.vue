<!--
  App.vue

  The main application component that serves as the entry point for the portfolio website.

  This component:
  1. Imports and orchestrates all child components
  2. Reads project data from ./data/projects
  3. Implements the contact form functionality
  4. Defines the overall page structure and sections
  5. Contains section-specific styling for the application (tokens/base/reset live in src/styles)
-->

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import ProjectShowcase from './components/ProjectShowcase.vue'
import ProjectCard from './components/ProjectCard.vue'
import { projects } from './data/projects'

const carouselProjects = computed(() =>
  projects.map((project) => ({
    title: project.title,
    tagline: project.tagline,
    description: project.tagline,
    imageSrc: project.imageSrc,
    imageAlt: project.imageAlt,
    detailUrl: `/projects/${project.slug}`,
  })),
)

const selectedProjectSlug = ref<string | null>(null)

const selectedProject = computed(() =>
  projects.find((project) => project.slug === selectedProjectSlug.value) ?? null,
)

const selectedProjectCarouselProjects = computed(() => {
  const project = selectedProject.value
  if (!project) return []

  const repeatCount = 3
  const gallery: Array<{
    title: string
    tagline: string
    description: string
    imageSrc: string
    imageAlt: string
    detailUrl: string
  }> = []

  for (let cycle = 0; cycle < repeatCount; cycle += 1) {
    for (let index = 0; index < project.galleryImages.length; index += 1) {
      const image = project.galleryImages[index]!
      gallery.push({
        title: project.title,
        tagline: project.tagline,
        description: image.alt,
        imageSrc: image.src,
        imageAlt: image.alt,
        detailUrl: `/projects/${project.slug}#gallery-${cycle + 1}-${index + 1}`,
      })
    }
  }

  return gallery
})

const shouldUseDetailCarousel = computed(() => {
  const project = selectedProject.value
  if (!project) return false
  return project.galleryImages.length > 1
})

let projectRevealObserver: IntersectionObserver | null = null

function cleanupProjectRevealObserver() {
  projectRevealObserver?.disconnect()
  projectRevealObserver = null
}

function initProjectDetailReveal() {
  cleanupProjectRevealObserver()

  nextTick(() => {
    const targetSelector = selectedProject.value
      ? '.project-detail [data-scroll-reveal]'
      : '[data-scroll-reveal="landing"]'
    const targets = Array.from(document.querySelectorAll<HTMLElement>(targetSelector))

    if (!targets.length) return

    const defaultDelayStepMs = selectedProject.value ? 45 : 90
    const defaultDelayMaxMs = selectedProject.value ? 220 : 520

    targets.forEach((el, index) => {
      el.classList.remove('is-revealed')
      const existingDelay = el.style.getPropertyValue('--reveal-delay').trim()
      if (!existingDelay) {
        el.style.setProperty(
          '--reveal-delay',
          `${Math.min(index * defaultDelayStepMs, defaultDelayMaxMs)}ms`,
        )
      }
    })

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    projectRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          projectRevealObserver?.unobserve(entry.target)
        })
      },
      {
        root: null,
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    targets.forEach((el) => projectRevealObserver?.observe(el))
  })
}

function projectSlugFromLocation() {
  const normalizedHash = window.location.hash.replace(/^#/, '')
  const hashMatch = normalizedHash.match(/^\/projects\/([a-z0-9-]+)$/i)
  if (hashMatch?.[1]) return hashMatch[1].toLowerCase()

  const pathMatch = window.location.pathname.match(/^\/projects\/([a-z0-9-]+)$/i)
  return pathMatch?.[1]?.toLowerCase() ?? null
}

function syncSelectedProjectFromLocation() {
  selectedProjectSlug.value = projectSlugFromLocation()
}

function openProject(projectSlug: string) {
  window.history.pushState({}, '', `/projects/${projectSlug}`)
  syncSelectedProjectFromLocation()
}

onMounted(() => {
  syncSelectedProjectFromLocation()
  window.addEventListener('hashchange', syncSelectedProjectFromLocation)
  window.addEventListener('popstate', syncSelectedProjectFromLocation)
  initProjectDetailReveal()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncSelectedProjectFromLocation)
  window.removeEventListener('popstate', syncSelectedProjectFromLocation)
  cleanupProjectRevealObserver()
})

watch(selectedProject, () => {
  initProjectDetailReveal()
})

/**
 * Contact form state variables
 * @property {boolean} formSubmitting - Tracks when the form is being submitted
 * @property {boolean} formSubmitted - Tracks if the form was successfully submitted
 * @property {string} formError - Stores any error messages during form submission
 */
const formSubmitting = ref(false)
const formSubmitted = ref(false)
const formError = ref('')
const activePageGlowColor = ref('#c9784f')

function glowColorForProjectTitle(title: string) {
  const key = title.trim().toLowerCase()
  if (key === 'blodged') return '#9c7a52'
  if (key === 'cinescope') return '#c96b5a'
  if (key === 'minesweeper') return '#6f8f9c'
  if (key === 'lunara') return '#c9a35f'
  if (key === 'asidenote') return '#8a7ccf'
  return '#c9784f'
}

function handleActiveProjectChange(project: { title: string }) {
  activePageGlowColor.value = glowColorForProjectTitle(project.title)
}

const appThemeStyle = computed(() => ({
  '--page-glow-color': activePageGlowColor.value,
}))

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
  <div class="app" :style="appThemeStyle">
    <!-- Site header with navigation -->
    <TheHeader />

    <main class="main">
      <section
        v-if="selectedProject"
        class="section project-detail"
        :aria-labelledby="`${selectedProject.slug}-title`"
      >
        <div class="container project-detail__container">
          <article class="project-detail__hero" data-scroll-reveal>
            <div
              v-if="shouldUseDetailCarousel"
              class="project-detail__hero-carousel"
              aria-label="Project image carousel"
            >
              <ProjectShowcase
                :projects="selectedProjectCarouselProjects"
                :show-logos="false"
                :show-descriptions="false"
                :show-media-hint="false"
                @active-project-change="handleActiveProjectChange"
              />
            </div>
            <div
              v-else
              class="project-detail__single-image-card"
            >
              <ProjectCard
                :title="selectedProject.title"
                :description="selectedProject.summary"
                :image-src="selectedProject.galleryImages[0]?.src || selectedProject.imageSrc"
                :image-alt="selectedProject.galleryImages[0]?.alt || selectedProject.imageAlt"
                :detail-url="`/projects/${selectedProject.slug}`"
                variant="carousel"
                :omit-title="true"
                :is-main-display="true"
                :show-media-hint="false"
              />
            </div>
            <div class="project-detail__hero-content">
              <p class="section__eyebrow">Case Study</p>
              <h1 :id="`${selectedProject.slug}-title`" class="project-detail__title">
                {{ selectedProject.title }}
              </h1>
              <p class="project-detail__tagline">{{ selectedProject.tagline }}</p>
              <p class="project-detail__summary">{{ selectedProject.summary }}</p>
              <div class="project-detail__actions">
                <a :href="selectedProject.githubUrl" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
                  View GitHub
                </a>
                <a
                  v-if="selectedProject.liveUrl"
                  :href="selectedProject.liveUrl"
                  class="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live App
                </a>
              </div>
            </div>
          </article>

          <div class="project-detail__meta">
            <div class="project-detail__facts">
              <article
                v-for="(fact, index) in selectedProject.keyFacts"
                :key="fact.label"
                class="project-detail__fact-card"
                data-scroll-reveal
                :style="{ '--reveal-delay': `${Math.min(index * 80, 240)}ms` }"
              >
                <p class="project-detail__fact-label">{{ fact.label }}</p>
                <p class="project-detail__fact-value">{{ fact.value }}</p>
              </article>
            </div>
            <ul class="project-detail__stack" data-scroll-reveal style="--reveal-delay: 160ms">
              <li v-for="item in selectedProject.techStack" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="project-detail__story">
            <article
              v-for="(section, index) in selectedProject.story"
              :key="section.heading ?? index"
              class="project-detail__story-block"
              data-scroll-reveal
              :style="{ '--reveal-delay': `${Math.min(index * 100, 400)}ms` }"
            >
              <h2 v-if="section.heading" class="project-detail__story-heading">{{ section.heading }}</h2>
              <p class="project-detail__story-body">{{ section.body }}</p>
            </article>
          </div>

          <blockquote
            v-if="selectedProject.pullQuote"
            class="project-detail__pull-quote"
            data-scroll-reveal
          >
            {{ selectedProject.pullQuote }}
          </blockquote>
        </div>
      </section>

      <template v-else>
      <!-- Hero/Home Section -->
      <section id="home" class="hero" data-scroll-reveal="landing">
        <div class="container">
          <div class="hero__content">
            <p class="hero__eyebrow">Full-stack developer &mdash; Michigan</p>
            <h1 class="hero__title">Carter Wright</h1>
            <p class="hero__tagline">
              I design and build full-stack products end to end &mdash; from a postpartum
              care platform to a note-taking canvas &mdash; with a focus on clean
              architecture and software people actually want to use.
            </p>
            <div class="hero__cta">
              <a href="#projects" class="hero__link" v-smooth-scroll>View projects <span aria-hidden="true">&rarr;</span></a>
              <a href="#contact" class="hero__link" v-smooth-scroll>Contact <span aria-hidden="true">&rarr;</span></a>
              <a href="/resume.pdf" class="hero__link" target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">&rarr;</span></a>
            </div>
            <div class="social-links">
                  <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects — full-viewport carousel (edge-to-edge, no panel) -->
      <section
        id="projects"
        class="section section--projects section--projects-fullbleed"
        aria-labelledby="projects-heading"
      >
        <div class="container section--projects__intro" data-scroll-reveal="landing">
          <p class="section__eyebrow">Selected work</p>
          <h2 id="projects-heading" class="section__title">A few things I've built</h2>
          <p class="section__lede">
            Five projects spanning healthcare, social platforms, and developer tools.
            Drag, swipe, or scroll to look through them.
          </p>
        </div>
        <div class="section--projects__carousel">
          <ProjectShowcase :projects="carouselProjects" @active-project-change="handleActiveProjectChange" />
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="section" data-scroll-reveal="landing">
        <div class="container about__container">
          <div class="section__heading" data-scroll-reveal="landing" style="--reveal-delay: 0ms">
            <p class="section__eyebrow">Background</p>
            <h2 class="section__title">About me</h2>
          </div>
          <div class="about__content">
            <p class="about__lede" data-scroll-reveal="landing" style="--reveal-delay: 0ms">
              I'm Carter Wright, a software developer and <b>Grand Canyon University</b> graduate with a
              <b>Bachelor's in Software Development</b>, currently based in <b>Michigan</b>.
            </p>
            <div class="about__body">
              <p data-scroll-reveal="landing" style="--reveal-delay: 100ms">
                I'm seeking full-time software development opportunities, and alongside that search I'm growing my client base with commission-based web design work for individuals and businesses.
              </p>
              <p data-scroll-reveal="landing" style="--reveal-delay: 200ms">
                My recent work has focused on full-stack web development using <b>C# ASP.NET</b>, <b>Enterprise Java</b>, and <b>Node.js</b>, along with cybersecurity work integrating frameworks like <b>NIST</b>, <b>CIS</b>, <b>MITRE</b>, and <b>OWASP</b>.
              </p>
              <p data-scroll-reveal="landing" style="--reveal-delay: 300ms">
                <a href="#contact" v-smooth-scroll>Contact me</a> to learn more about working together, or take a look at my <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a> and <a href="#projects" v-smooth-scroll>projects</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="section" data-scroll-reveal="landing">
        <div class="container">
          <div class="section__heading">
            <p class="section__eyebrow">Toolkit</p>
            <h2 class="section__title">Skills</h2>
          </div>
          <p class="skills__intro" data-scroll-reveal="landing">
            I work primarily in C# and Java on the backend, with TypeScript across most of my frontend work.
          </p>
          <div class="skills__tiers">
            <div class="skill-tier" data-scroll-reveal="landing" style="--reveal-delay: 0ms">
              <h3 class="skill-tier__title">Primary</h3>
              <ul class="skill-tier__list">
                <li>C# / ASP.NET Core</li>
                <li>Java (Enterprise)</li>
                <li>TypeScript / JavaScript</li>
              </ul>
            </div>
            <div class="skill-tier" data-scroll-reveal="landing" style="--reveal-delay: 90ms">
              <h3 class="skill-tier__title">Working knowledge</h3>
              <ul class="skill-tier__list">
                <li>SQL</li>
                <li>HTML / CSS</li>
                <li>Node.js</li>
              </ul>
            </div>
            <div class="skill-tier" data-scroll-reveal="landing" style="--reveal-delay: 180ms">
              <h3 class="skill-tier__title">Exposure</h3>
              <ul class="skill-tier__list">
                <li>C / C++</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="section" data-scroll-reveal="landing">
        <div class="container">
          <div class="section__heading">
            <p class="section__eyebrow">Let's talk</p>
            <h2 class="section__title">Contact</h2>
          </div>
          <div class="contact-wrapper">
            <div class="contact">
              <div class="contact__info" data-scroll-reveal="landing" style="--reveal-delay: 80ms">
                <div class="contact-card-grid">
                  <article class="contact-card" data-scroll-reveal="landing" style="--reveal-delay: 120ms">
                    <div class="contact-card__icon" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75Zm2.8-.75 7.7 5.39 7.7-5.39H4.3Zm16.2 1.56-7.85 5.5a1.125 1.125 0 0 1-1.3 0L3.5 7.56v9.69c0 .414.336.75.75.75h16.5a.75.75 0 0 0 .75-.75V7.56Z" />
                      </svg>
                    </div>
                    <div class="contact-card__text">
                      <p class="contact-card__label">Email</p>
                      <a href="mailto:carterwright221@gmail.com" class="contact-card__value">carterwright221@gmail.com</a>
                    </div>
                  </article>
                  <article class="contact-card" data-scroll-reveal="landing" style="--reveal-delay: 180ms">
                    <div class="contact-card__icon" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"/>
                      </svg>
                    </div>
                    <div class="contact-card__text">
                      <p class="contact-card__label">Phone</p>
                      <a href="tel:+18105693888" class="contact-card__value">(810) 569-3888</a>
                    </div>
                  </article>
                </div>
              </div>

              <div class="contact__form-container" data-scroll-reveal="landing" style="--reveal-delay: 240ms">
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
                  <div class="form-row">
                    <div class="form-group" data-scroll-reveal="landing" style="--reveal-delay: 280ms">
                      <label for="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                      >
                    </div>
                    <div class="form-group" data-scroll-reveal="landing" style="--reveal-delay: 320ms">
                      <label for="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                      >
                    </div>
                  </div>
                  <div class="form-group" data-scroll-reveal="landing" style="--reveal-delay: 360ms">
                    <label for="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      required
                    >
                  </div>
                  <div class="form-group" data-scroll-reveal="landing" style="--reveal-delay: 420ms">
                    <label for="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="8"
                      placeholder="Tell me about your project..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    class="contact__submit-btn"
                    :disabled="formSubmitting"
                    data-scroll-reveal="landing"
                    style="--reveal-delay: 480ms"
                  >
                    {{ formSubmitting ? 'Sending...' : 'Send Message' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      </template>
  </main>

    <!-- Site footer -->
    <TheFooter />
  </div>
</template>

<style>
.project-detail__container {
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.project-detail__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  letter-spacing: -0.01em;
}

.project-detail__hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: stretch;
}

.project-detail__hero-carousel {
  width: 100%;
  overflow: visible;
}

.project-detail__hero-carousel .showcase {
  padding-inline: 0;
}

.project-detail__hero-carousel .showcase__viewport {
  min-height: min(48vh, 620px);
  padding: clamp(1.75rem, 3.2vw, 2.4rem) 0 clamp(0.35rem, 1vw, 0.7rem);
  overflow: visible;
}

.project-detail__single-image-card {
  width: 100%;
}

.project-detail__single-image-card :deep(.project-card__media--carousel-hit) {
  cursor: default;
  pointer-events: none;
}

.project-detail__single-image-card :deep(.project-card__carousel-frame) {
  min-height: min(48vh, 620px);
}

.project-detail__hero-content {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.project-detail__tagline {
  color: var(--color-accent-soft);
  font-size: var(--text-body-lg);
  font-style: italic;
  font-family: var(--font-display);
}

.project-detail__summary {
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-ink-muted);
  max-width: 62ch;
}

.project-detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-detail__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.project-detail__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.1rem;
}

.project-detail__fact-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.project-detail__fact-label {
  margin: 0 0 0.3rem;
  font-family: var(--font-sans);
  font-size: var(--text-micro);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent-soft);
}

.project-detail__fact-value {
  margin: 0;
  color: var(--color-ink-muted);
  line-height: 1.45;
}

.project-detail__stack {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-detail__stack li {
  font-family: var(--font-sans);
  font-size: var(--text-micro);
  letter-spacing: 0.02em;
  color: var(--color-ink-muted);
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
}

.project-detail__story {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 68ch;
}

.project-detail__story-heading {
  margin-bottom: 0.6rem;
  color: var(--color-ink);
  font-size: var(--text-display-md);
  font-style: italic;
  font-weight: 500;
}

.project-detail__story-body {
  margin: 0;
  line-height: var(--leading-relaxed);
  color: var(--color-ink-muted);
  font-size: var(--text-body-lg);
}

.project-detail__pull-quote {
  margin: var(--space-md) 0 0;
  padding-left: var(--space-md);
  border-left: 2px solid var(--color-accent);
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-display-md);
  line-height: var(--leading-snug);
  color: var(--color-ink);
  max-width: 46ch;
}

/*
 * Hero Section Styling
 * First section of the page with the main headline and CTA links
 */
.hero {
  margin-top: -80px;
  padding: calc(80px + clamp(4rem, 12vw, 7rem)) 0 clamp(4rem, 12vw, 6rem);
  background-color: transparent;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 80px;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    ellipse at 20% 20%,
    color-mix(in srgb, var(--page-glow-color) 6%, transparent) 0%,
    transparent 55%
  );
  opacity: 0.5;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.85) 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.85) 55%, transparent 100%);
}

.hero__content {
  max-width: 38rem;
  position: relative;
  z-index: 1;
}

.hero__eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent-soft);
  margin: 0 0 1.1rem;
}

.hero__title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
  font-size: var(--text-display-xl);
  margin: 0 0 1.5rem;
  letter-spacing: -0.01em;
  line-height: var(--leading-tight);
  color: var(--color-ink);
}

.hero__tagline {
  font-size: var(--text-body-lg);
  color: var(--color-ink-muted);
  margin: 0 0 2.25rem;
  line-height: var(--leading-relaxed);
  max-width: 46ch;
}

/* Call to action link row */
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: 2rem;
}

.hero__link {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-ink);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border-strong);
  padding-bottom: 2px;
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
}

.hero__link span {
  display: inline-block;
  transition: transform var(--duration-fast) var(--ease-out);
}

.hero__link:hover {
  color: var(--color-accent-soft);
  border-color: var(--color-accent-soft);
}

.hero__link:hover span {
  transform: translateX(3px);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--color-ink-muted);
  transition: color var(--duration-fast) ease, transform var(--duration-fast) ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: transparent;
}

.social-link:hover {
  color: var(--color-accent-soft);
  transform: translateY(-2px);
}

/*
 * Button styles
 * Used for real actions: project-detail links and contact form submit
 */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border: 1px solid transparent;
}

.btn--primary {
  background-color: var(--color-accent);
  color: var(--color-background);
}

.btn--primary:hover {
  background-color: var(--color-accent-soft);
  transform: translateY(-1px);
}

.btn--secondary {
  background-color: transparent;
  border-color: var(--color-border-strong);
  color: var(--color-ink);
}

.btn--secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-soft);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-ink-muted);
  border-color: var(--color-border-strong);
}

.btn--ghost:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-soft);
}

/* About Section */
.about__container {
  max-width: 52rem;
}

.about__lede {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-display-md);
  line-height: var(--leading-snug);
  color: var(--color-ink);
  max-width: 34rem;
  margin-bottom: var(--space-md);
}

.about__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 62ch;
  color: var(--color-ink-muted);
  line-height: var(--leading-relaxed);
}

.about__body a {
  color: var(--color-accent-soft);
  font-weight: 600;
  text-underline-offset: 0.2em;
}

.about__body a:hover {
  color: var(--color-accent);
}

/* Skills Section */
.skills__intro {
  max-width: 44ch;
  color: var(--color-ink-muted);
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-lg);
}

.skills__tiers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-lg);
}

.skill-tier__title {
  font-family: var(--font-sans);
  font-size: var(--text-meta);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent-soft);
  margin-bottom: 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--color-border);
}

.skill-tier__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.skill-tier__list li {
  color: var(--color-ink);
  font-size: var(--text-body);
}

/* Contact Section */
.contact-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.contact-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.contact-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--color-background-raised);
}

.contact-card__icon {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  color: var(--color-accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.contact-card__icon svg {
  width: 1rem;
  height: 1rem;
}

.contact-card__text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.contact-card__label {
  color: var(--color-ink-muted);
  font-size: 0.88rem;
}

.contact-card__value {
  color: var(--color-ink);
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;
}

.contact-card__value:hover {
  color: var(--color-accent-soft);
}

.contact__form-container {
  position: relative;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-ink);
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.95rem 1rem;
  background-color: var(--color-background-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: border-color var(--duration-fast) ease;
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
  outline: none;
  border-color: var(--color-accent);
}

.contact__submit-btn {
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-background);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.85rem 1.6rem;
  cursor: pointer;
  transition: background var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.contact__submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--color-accent-soft);
}

.contact__submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-status {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  background-color: color-mix(in srgb, var(--color-error) 14%, transparent);
  color: var(--color-error);
}

.form-status--success {
  background-color: color-mix(in srgb, var(--color-success) 14%, transparent);
  color: var(--color-success);
}

@media (max-width: 768px) {
  .contact-card-grid,
  .form-row {
    grid-template-columns: 1fr;
  }

  .skills__tiers {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .project-detail__facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .project-detail__hero-carousel .showcase__viewport {
    min-height: min(30vh, 300px);
    padding: 0.25rem 0 0.35rem;
  }
}
</style>
