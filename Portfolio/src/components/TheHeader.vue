<!--
  TheHeader.vue
  
  This component renders the site header with navigation menu.
  It includes a responsive menu that collapses on mobile devices
  and implements smooth scrolling to page sections.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/**
 * Tracks whether the mobile menu is open
 * Used to toggle the navigation menu on small screens
 */
const menuOpen = ref(false);

/**
 * Toggles the mobile menu open/closed state
 */
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

/**
 * Handles smooth scrolling to page sections when navigation links are clicked
 * 
 * @param {Event} e - The click event
 * @param {string} targetId - The ID of the target section to scroll to
 */
const smoothScroll = (e: Event, targetId: string) => {
  e.preventDefault();
  
  // Close the mobile menu if it's open
  if (menuOpen.value) {
    menuOpen.value = false;
  }
  
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    // Adjust scroll position to account for fixed header
    const headerHeight = 80; // Fixed header height in pixels
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    // Perform smooth scroll
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

const goHome = (e: Event) => {
  e.preventDefault();

  if (menuOpen.value) {
    menuOpen.value = false;
  }

  const isProjectRoute = /^\/projects\/[a-z0-9-]+$/i.test(window.location.pathname);
  if (isProjectRoute) {
    window.location.assign('/');
    return;
  }

  smoothScroll(e, 'home');
};

onMounted(() => {
  /**
   * Sets up scroll event listener to highlight the active navigation link
   * based on which section is currently visible in the viewport
   */
  
  // Get all navigation links and page sections
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');
  
  /**
   * Updates the active navigation link based on scroll position
   * The active link corresponds to the section currently in view
   */
  const highlightNavOnScroll = () => {
    let currentSection = '';
    
    // Determine which section is currently in view
    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop - 100;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id') || '';
      }
    });
    
    // Update active class on navigation links
    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };
  
  // Register scroll event listener
  window.addEventListener('scroll', highlightNavOnScroll);
  
  // Initialize active navigation state on page load
  highlightNavOnScroll();
});
</script>

<template>
  <header class="header">
    <div class="container">
      <!-- Logo/branding -->
      <div class="logo">
        <h1><span class="logo__bracket">{</span> Carter Wright <span class="logo__bracket">}</span></h1>
      </div>
      
      <!-- Mobile menu toggle button -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation menu">
        <span class="menu-icon"></span>
      </button>
      
      <!-- Main navigation -->
      <nav class="nav" :class="{ 'nav--open': menuOpen }">
        <ul class="nav__list">
          <li class="nav__item"><a href="/" class="nav__link" @click="goHome">Home</a></li>
          <li class="nav__item"><a href="#projects" class="nav__link" @click="(e) => smoothScroll(e, 'projects')">Projects</a></li>
          <li class="nav__item"><a href="#about" class="nav__link" @click="(e) => smoothScroll(e, 'about')">About</a></li>
          <li class="nav__item"><a href="#skills" class="nav__link" @click="(e) => smoothScroll(e, 'skills')">Skills</a></li>
          <li class="nav__item"><a href="#contact" class="nav__link" @click="(e) => smoothScroll(e, 'contact')">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* 
 * Header styling
 * Fixed position at the top of the page with subtle shadow and border
 */
.header {
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #101012;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

/* Container for header contents with flexbox layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo styling */
.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  font-family: var(--font-mono);
  color: var(--color-text);
}

.logo__bracket {
  color: var(--color-primary);
  opacity: 0.8;
}

/* Navigation list - horizontal on desktop */
.nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__item {
  margin-left: 2rem;
  position: relative;
}

/* Animated underline effect for navigation items */
.nav__item::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.nav__item:hover::before {
  width: 100%;
}

/* Navigation link styling */
.nav__link {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: color 0.3s;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  position: relative;
}

.nav__link.active,
.nav__link:hover {
  color: var(--color-primary);
}

/* Hide mobile menu toggle by default (desktop) */
.menu-toggle {
  display: none;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  /* Show mobile menu toggle button */
  .menu-toggle {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: relative;
  }
  
  /* Hamburger icon styles */
  .menu-icon, .menu-icon::before, .menu-icon::after {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
  }
  
  .menu-icon {
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .menu-icon::before {
    width: 100%;
    top: -8px;
  }
  
  .menu-icon::after {
    width: 100%;
    bottom: -8px;
  }
  
  /* Mobile navigation menu - hidden by default */
  .nav {
    --mobile-header-offset: 64px;
    position: fixed;
    top: calc(var(--mobile-header-offset) - 1px);
    left: 0;
    width: 100%;
    height: calc(100vh - (var(--mobile-header-offset) - 1px));
    background-color: #101012;
    padding: 1.25rem 0;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    clip-path: inset(0 0 100% 0);
    opacity: 0.35;
    visibility: hidden;
    transition: clip-path 0.35s ease, opacity 0.28s ease, visibility 0.28s ease;
    overflow-y: auto;
    z-index: 95;
  }
  
  /* Mobile navigation menu - open state */
  .nav--open {
    clip-path: inset(0 0 0 0);
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  /* Vertical layout for mobile navigation */
  .nav__list {
    flex-direction: column;
    height: 100%;
    padding: 2.75rem 0 0;
    justify-content: flex-start;
    align-items: center;
  }
  
  .nav__item {
    margin: 0;
    padding: 0.9rem 0;
    text-align: center;
  }

  .nav__link {
    font-size: 1.3rem;
  }
  
  /* Disable underline effect on mobile */
  .nav__item::before {
    display: none;
  }
}
</style> 