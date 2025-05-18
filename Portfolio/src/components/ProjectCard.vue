<!--
  ProjectCard.vue
  
  This component displays a single project in a card format.
  It receives project data as props and renders a stylized card
  with title, description, technology tags, and links.
-->

<script setup lang="ts">
/**
 * Interface representing a technology tag (e.g., JavaScript, React)
 */
interface Tag {
  name: string;
}

/**
 * Interface representing a link associated with the project
 * (e.g., GitHub repository, live demo)
 */
interface ProjectLink {
  text: string;
  url: string;
}

/**
 * Props interface for the ProjectCard component
 * @property {string} title - The name of the project
 * @property {string} description - Project description text
 * @property {Tag[]} tags - Array of technology tags used in the project
 * @property {ProjectLink[]} links - Array of links related to the project
 */
interface Props {
  title: string;
  description: string;
  tags: Tag[];
  links: ProjectLink[];
}

// Define component props
const props = defineProps<Props>();
</script>

<template>
  <div class="project-card">
    <!-- Card header with code styling -->
    <div class="project-card__header">
      <span class="code-line">import Project from './{{ title }}';</span>
    </div>
    
    <!-- Main card content -->
    <div class="project-card__content">
      <h3 class="project-card__title">{{ title }}</h3>
      <p class="project-card__description">{{ description }}</p>
      
      <!-- Technology tags -->
      <div class="project-card__tags">
        <span class="tag" v-for="tag in tags" :key="tag.name">{{ tag.name }}</span>
      </div>
      
      <!-- Project links (GitHub repositories, etc.) -->
      <div class="project-card__links">
        <a 
          v-for="link in links" 
          :key="link.text" 
          :href="link.url" 
          class="project-card__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
        >
          <svg class="github-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58 0-.28 0-1.03-.02-2.03-3.33.72-4.03-1.6-4.03-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.3 3.5 1 .1-.78.41-1.3.75-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23.96-.26 1.98-.4 3-.4s2.04.14 3 .4c2.28-1.55 3.3-1.23 3.3-1.23.64 1.66.24 2.88.12 3.18.76.84 1.23 1.9 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 
 * Main card container 
 * Card has elevation shadow and rises on hover
 */
.project-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-code);
  border: 1px solid var(--color-border);
  position: relative;
}

/* Hover effect - card rises and shadow deepens */
.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
}

/* Code-inspired header with import statement */
.project-card__header {
  background-color: var(--color-background-alt);
  padding: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
}

/* Code line with ellipsis for overflow */
.code-line {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main content area of the card */
.project-card__content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Decorative code braces in the top-right corner */
.project-card__content::before {
  content: '{ }';
  position: absolute;
  top: -15px;
  right: 15px;
  background-color: var(--color-accent-3);
  color: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: bold;
}

/* Project title styling */
.project-card__title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-accent-2);
}

/* Project description styling */
.project-card__description {
  color: var(--color-text-light);
  margin-bottom: 1.25rem;
  flex: 1;
  line-height: 1.6;
}

/* Container for technology tags */
.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

/* Individual technology tag styling */
.tag {
  background-color: var(--color-background-alt);
  color: var(--color-accent-1);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  border: 1px solid rgba(255, 189, 46, 0.3);
}

/* Container for project links */
.project-card__links {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
}

/* Individual project link styling */
.project-card__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

/* Hover effect for project links */
.project-card__link:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 224, 255, 0.1);
}

/* GitHub icon styling */
.github-icon {
  width: 22px;
  height: 22px;
  fill: var(--color-primary);
}
</style> 