<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__copyright">
          © {{ new Date().getFullYear() }} Carter Wright. All rights reserved.
        </div>
        <div class="footer__social">
          <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f9fafb;
  padding: 2rem 0;
  margin-top: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer__copyright {
  color: #6b7280;
  font-size: 0.875rem;
}

.footer__social {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #6b7280;
  transition: color 0.3s;
}

.social-link:hover {
  color: #4f46e5;
}

@media (max-width: 640px) {
  .footer__content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 