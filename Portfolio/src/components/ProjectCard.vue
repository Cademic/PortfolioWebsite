<!--
  Project card: hero image (links to details), title, brief description.
  Use variant="carousel" in the peek carousel (no panel chrome behind the project).
-->
<script setup lang="ts">
interface Props {
  title: string
  description: string
  imageSrc: string
  detailUrl: string
  imageAlt?: string
  variant?: 'card' | 'carousel'
  /** Hide title (shown in carousel chrome instead) */
  omitTitle?: boolean
  /** Accent ring on screenshot — center slide in cover-flow */
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  imageAlt: '',
  variant: 'card',
  omitTitle: false,
  isActive: false,
})
</script>

<template>
  <article
    class="project-card"
    :class="{ 'project-card--carousel': variant === 'carousel' }"
  >
    <a
      :href="detailUrl"
      class="project-card__media"
      :class="{ 'project-card__media--active': variant === 'carousel' && isActive }"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`View ${title} on GitHub — more information`"
    >
      <img
        class="project-card__image"
        :src="imageSrc"
        :alt="imageAlt || `${title} screenshot`"
        loading="lazy"
        decoding="async"
        width="1200"
        height="675"
      />
      <span class="project-card__media-hint" aria-hidden="true">View on GitHub</span>
    </a>

    <div class="project-card__body">
      <h3 v-if="!omitTitle" class="project-card__title">{{ title }}</h3>
      <p class="project-card__description">{{ description }}</p>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--radius-lg, 18px);
  overflow: hidden;
  background: linear-gradient(165deg, var(--color-surface-raised, #161b26), var(--color-background-code, #12161f));
  border: 1px solid var(--color-border);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    transform 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
}

.project-card:not(.project-card--carousel):hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(45, 212, 191, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* Carousel: no panel behind project — image + text float on page background */
.project-card--carousel {
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
}

.project-card--carousel:hover {
  transform: none;
  box-shadow: none;
}

.project-card__media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
  outline: none;
  border-radius: var(--radius-lg, 18px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.project-card--carousel .project-card__media {
  transition:
    box-shadow 0.45s var(--ease-out),
    transform 0.45s var(--ease-out);
}

.project-card__media:hover:not(.project-card__media--active) {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.project-card__media:focus-visible {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 0 0 2px var(--color-primary);
}

.project-card__media--active:focus-visible {
  box-shadow:
    0 28px 64px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(251, 191, 36, 0.45),
    0 0 0 2px rgba(45, 212, 191, 0.35),
    0 0 100px rgba(45, 212, 191, 0.12),
    inset 0 0 0 2px var(--color-primary);
}

/* Center slide: subtle gold + teal rim (reference-style glow) */
.project-card__media--active {
  box-shadow:
    0 28px 64px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(251, 191, 36, 0.45),
    0 0 0 2px rgba(45, 212, 191, 0.35),
    0 0 100px rgba(45, 212, 191, 0.12);
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.45s var(--ease-out);
}

.project-card__media:hover .project-card__image,
.project-card__media:focus-visible .project-card__image {
  transform: scale(1.03);
}

.project-card__media-hint {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-full);
  color: #041016;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
}

.project-card__media:hover .project-card__media-hint,
.project-card__media:focus-visible .project-card__media-hint {
  opacity: 1;
  transform: translateY(0);
}

@media (hover: none) {
  .project-card__media-hint {
    opacity: 1;
    transform: none;
  }
}

.project-card__body {
  padding: 1.15rem 0.25rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-card--carousel .project-card__body {
  padding: 1rem 0.15rem 0;
}

.project-card__title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.2rem, 2.2vw, 1.45rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  line-height: 1.2;
}

.project-card__description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-muted, #94a3b8);
}

.project-card--carousel .project-card__description {
  font-size: 1rem;
}
</style>
