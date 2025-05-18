import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Custom directive for smooth scrolling
app.directive('smooth-scroll', {
  mounted(el, binding) {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      
      // Get the target id from href attribute
      const href = el.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        const headerHeight = 80 // Approximate header height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  }
})

app.mount('#app')
