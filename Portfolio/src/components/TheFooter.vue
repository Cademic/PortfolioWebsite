<!--
  TheFooter.vue
  
  This component renders the website footer.
  It displays copyright information and social media links
  in a stylized code comment-like format.
-->

<script setup lang="ts">
/**
 * No props or special functionality needed for this component.
 * Simply displays copyright and social media links in the footer.
 */
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <!-- Copyright information styled as a code comment -->
        <div class="footer__copyright">
          <span class="code-comment">// © {{ new Date().getFullYear() }} Carter Wright. All rights reserved.</span>
        </div>
        
        <!-- Social media links -->
        <div class="footer__social">
          <!-- GitHub link -->
          <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          
          <!-- LinkedIn link -->
          <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 
 * Footer container
 * Appears at the bottom of the page with subtle top border
 */
.footer {
  background-color: var(--color-background-alt);
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  position: relative;
}

/* Content container with max width */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

/* Code comment styles for the copyright text */
.code-comment {
  font-family: var(--font-mono);
  color: var(--color-accent-3);
  margin-bottom: 1rem;
  opacity: 0.7;
}

/* Main footer content container */
.footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-code);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

/* Copyright text container */
.footer__copyright {
  color: var(--color-text);
  font-size: 0.875rem;
  font-family: var(--font-mono);
  line-height: 1.5;
}

/* Code syntax highlighting classes */
.code-keyword {
  color: var(--color-secondary);
}

.code-var {
  color: var(--color-accent-2);
}

.code-string {
  color: var(--color-accent-1);
}

.code-comment {
  color: var(--color-accent-3);
}

/* Social media links container */
.footer__social {
  display: flex;
  gap: 1rem;
}

/* Individual social link styling */
.social-link {
  color: var(--color-text-light);
  transition: color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
}

/* Hover effect for social links */
.social-link:hover {
  color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 224, 255, 0.2);
}

/* Responsive styles for small screens */
@media (max-width: 640px) {
  .footer__content {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
}
</style> 