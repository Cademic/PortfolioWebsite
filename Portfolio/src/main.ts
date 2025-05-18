/**
 * Main Application Entry Point
 * 
 * This file initializes the Vue application and sets up global directives.
 * It's responsible for mounting the app to the DOM and configuring app-wide
 * functionality like smooth scrolling.
 */

import { createApp } from 'vue'
import App from './App.vue'

// Create the Vue application instance
const app = createApp(App)

/**
 * Smooth Scrolling Directive
 * 
 * This custom directive enables smooth scrolling to anchor points within the page.
 * When applied to an anchor link with a hash (#) reference, it will intercept clicks
 * and smoothly scroll to the target element instead of the default jump behavior.
 * 
 * Usage: v-smooth-scroll on any <a> element with href="#section-id"
 */
app.directive('smooth-scroll', {
  mounted(el, binding) {
    el.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      
      // Get the target id from href attribute
      const href = el.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        // Account for fixed header by offsetting scroll position
        const headerHeight = 80 // Height of the fixed header in pixels
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight
        
        // Perform the smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  }
})

// Mount the app to the DOM element with id="app"
app.mount('#app')
