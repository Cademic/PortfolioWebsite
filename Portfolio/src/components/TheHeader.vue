<script setup lang="ts">
import { ref } from 'vue';

const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <h1><span class="logo__bracket">{</span> Carter Wright <span class="logo__bracket">}</span></h1>
      </div>
      
      <button class="menu-toggle" @click="toggleMenu">
        <span class="menu-icon"></span>
      </button>
      
      <nav class="nav" :class="{ 'nav--open': menuOpen }">
        <ul class="nav__list">
          <li class="nav__item"><a href="#home" class="nav__link">Home</a></li>
          <li class="nav__item"><a href="#about" class="nav__link">About</a></li>
          <li class="nav__item"><a href="#projects" class="nav__link">Projects</a></li>
          <li class="nav__item"><a href="#skills" class="nav__link">Skills</a></li>
          <li class="nav__item"><a href="#contact" class="nav__link">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-background-alt);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  border-bottom: 1px solid var(--color-border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.nav__link {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: color 0.3s;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  position: relative;
}

.nav__link:hover {
  color: var(--color-primary);
}

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: relative;
  }
  
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
  
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--color-background-alt);
    padding: 1rem 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border-bottom: 1px solid var(--color-border);
  }
  
  .nav--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav__list {
    flex-direction: column;
    padding: 0 1rem;
  }
  
  .nav__item {
    margin: 0;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  
  .nav__item:last-child {
    border-bottom: none;
  }
  
  .nav__item::before {
    display: none;
  }
}
</style> 