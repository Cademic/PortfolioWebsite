<!--
  Cover-flow style carousel: 3D perspective, radial glow, side slides recede; serif hero title in chrome.
-->
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import ProjectCard from './ProjectCard.vue'

interface ProjectItem {
  title: string
  tagline?: string
  description: string
  imageSrc: string
  detailUrl: string
  imageAlt?: string
}

interface Props {
  projects: ProjectItem[]
}

const props = defineProps<Props>()

const SLIDE_GAP_PX = 20
const SLIDE_WIDTH_RATIO = 0.68
const SLIDE_MAX_PX = 880

const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
const slideWidth = ref(0)

const activeIndex = ref(0)
const reducedMotion = ref(false)
const touchStartX = ref<number | null>(null)

const total = computed(() => props.projects.length)

const currentProject = computed(() => props.projects[activeIndex.value])

const translatePx = computed(() => {
  const vw = viewportWidth.value
  const sw = slideWidth.value
  const i = activeIndex.value
  if (!vw || !sw || total.value === 0) return 0
  return vw / 2 - i * (sw + SLIDE_GAP_PX) - sw / 2
})

const trackStyle = computed(() => ({
  transform: `translate3d(${translatePx.value}px, 0, 0)`,
  transition: reducedMotion.value
    ? 'none'
    : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
}))

function measure() {
  const el = viewportRef.value
  if (!el) return
  const w = el.clientWidth
  viewportWidth.value = w
  const sw = Math.min(w * SLIDE_WIDTH_RATIO, SLIDE_MAX_PX)
  slideWidth.value = sw
  el.style.setProperty('--showcase-slide-w', `${sw}px`)
}

let ro: ResizeObserver | null = null

function goTo(index: number) {
  if (total.value === 0) return
  const next = ((index % total.value) + total.value) % total.value
  activeIndex.value = next
}

function prev() {
  goTo(activeIndex.value - 1)
}

function next() {
  goTo(activeIndex.value + 1)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(e: TouchEvent) {
  if (touchStartX.value === null) return
  const endX = e.changedTouches[0]?.clientX ?? touchStartX.value
  const delta = endX - touchStartX.value
  touchStartX.value = null
  if (Math.abs(delta) < 40) return
  if (delta < 0) next()
  else prev()
}

let mq: MediaQueryList | null = null

function updateReducedMotion() {
  reducedMotion.value = mq?.matches ?? false
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateReducedMotion()
  mq.addEventListener?.('change', updateReducedMotion)

  nextTick(() => {
    measure()
    if (viewportRef.value) {
      ro = new ResizeObserver(() => measure())
      ro.observe(viewportRef.value)
    }
  })
})

onUnmounted(() => {
  mq?.removeEventListener?.('change', updateReducedMotion)
  ro?.disconnect()
})

watch(
  () => props.projects.length,
  (len) => {
    if (activeIndex.value >= len) activeIndex.value = Math.max(0, len - 1)
    nextTick(measure)
  }
)

function slideClass(index: number) {
  return {
    'showcase__slide--active': index === activeIndex.value,
    'showcase__slide--peek-left': index < activeIndex.value,
    'showcase__slide--peek-right': index > activeIndex.value,
  }
}
</script>

<template>
  <div
    class="showcase"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`Project showcase, ${total} projects`"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="showcase__chrome">
      <div class="showcase__chrome-center">
        <p v-if="currentProject?.tagline" class="showcase__tagline">
          {{ currentProject.tagline }}
        </p>
        <h2 class="showcase__display-title" aria-live="polite">
          {{ currentProject?.title ?? '' }}
        </h2>
      </div>
      <p class="showcase__counter">
        <span class="showcase__counter-current">{{ activeIndex + 1 }}</span>
        <span class="showcase__counter-sep">/</span>
        <span class="showcase__counter-total">{{ total }}</span>
      </p>
    </div>

    <div
      ref="viewportRef"
      class="showcase__viewport"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div class="showcase__viewport-glow" aria-hidden="true" />
      <div class="showcase__viewport-inner">
        <div class="showcase__track" :style="trackStyle">
          <div
            v-for="(project, index) in projects"
            :key="project.detailUrl"
            class="showcase__slide"
            :class="slideClass(index)"
            :aria-hidden="index !== activeIndex"
          >
            <p
              v-if="index !== activeIndex"
              class="showcase__peek-title"
              aria-hidden="true"
            >
              {{ project.title }}
            </p>
            <ProjectCard
              :title="project.title"
              :description="project.description"
              :image-src="project.imageSrc"
              :detail-url="project.detailUrl"
              :image-alt="project.imageAlt"
              variant="carousel"
              :omit-title="true"
              :is-active="index === activeIndex"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="showcase__controls">
      <button
        type="button"
        class="showcase__btn"
        aria-label="Previous project"
        :disabled="total <= 1"
        @click="prev"
      >
        <span class="showcase__btn-icon" aria-hidden="true">‹</span>
      </button>

      <div class="showcase__dots" role="tablist" aria-label="Project slides">
        <button
          v-for="(project, index) in projects"
          :key="`dot-${project.detailUrl}`"
          type="button"
          role="tab"
          class="showcase__dot"
          :class="{ 'showcase__dot--active': index === activeIndex }"
          :aria-selected="index === activeIndex"
          :aria-label="`Go to project ${index + 1}: ${project.title}`"
          @click="goTo(index)"
        />
      </div>

      <button
        type="button"
        class="showcase__btn"
        aria-label="Next project"
        :disabled="total <= 1"
        @click="next"
      >
        <span class="showcase__btn-icon" aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  --font-display: 'DM Serif Display', Georgia, 'Times New Roman', serif;

  outline: none;
  border-radius: var(--radius-xl, 24px);
  padding: clamp(1.25rem, 3vw, 2rem);
  background: linear-gradient(
    165deg,
    rgba(18, 16, 28, 0.92) 0%,
    rgba(12, 14, 22, 0.98) 45%,
    rgba(8, 10, 16, 1) 100%
  );
  border: 1px solid var(--color-border);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.showcase:focus-visible {
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.55),
    0 0 0 2px rgba(45, 212, 191, 0.4);
}

.showcase__chrome {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
}

.showcase__chrome-center {
  flex: 1;
  min-width: 0;
  text-align: center;
  padding: 0 0.5rem;
}

.showcase__tagline {
  font-family: var(--font-sans);
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted, #94a3b8);
  margin: 0 0 0.35rem;
}

.showcase__display-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 3.25rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 0;
  text-wrap: balance;
}

.showcase__counter {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin: 0;
  padding-top: 0.25rem;
  flex-shrink: 0;
}

.showcase__counter-current {
  color: var(--color-accent-2);
  font-weight: 600;
}

.showcase__counter-sep {
  opacity: 0.45;
  margin: 0 0.15rem;
}

.showcase__viewport {
  position: relative;
  overflow: hidden;
  margin: 0 -0.5rem 1.5rem;
  padding: 2rem 0 2.5rem;
  touch-action: pan-y pinch-zoom;
  perspective: 1400px;
  perspective-origin: 50% 42%;
}

.showcase__viewport-glow {
  position: absolute;
  left: 50%;
  top: 38%;
  transform: translate(-50%, -50%);
  width: min(90%, 720px);
  height: min(55vh, 420px);
  background: radial-gradient(
    ellipse at center,
    rgba(99, 102, 241, 0.12) 0%,
    rgba(45, 212, 191, 0.08) 35%,
    transparent 68%
  );
  pointer-events: none;
  z-index: 0;
}

.showcase__viewport-inner {
  position: relative;
  z-index: 1;
  width: 100%;
}

.showcase__track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 20px;
  width: max-content;
  will-change: transform;
  transform-style: preserve-3d;
}

.showcase__slide {
  position: relative;
  flex: 0 0 var(--showcase-slide-w, min(68vw, 880px));
  width: var(--showcase-slide-w, min(68vw, 880px));
  min-width: 0;
  box-sizing: border-box;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition:
    opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  backface-visibility: hidden;
}

.showcase__slide--peek-left {
  z-index: 1;
  opacity: 0.38;
  transform: translateZ(-80px) rotateY(26deg) scale(0.86);
  filter: brightness(0.55) saturate(0.65);
}

.showcase__slide--peek-right {
  z-index: 1;
  opacity: 0.38;
  transform: translateZ(-80px) rotateY(-26deg) scale(0.86);
  filter: brightness(0.55) saturate(0.65);
}

.showcase__slide--active {
  z-index: 10;
  opacity: 1;
  transform: translateZ(48px) rotateY(0deg) scale(1);
  filter: none;
}

.showcase__peek-title {
  position: absolute;
  top: -0.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.5vw, 1.65rem);
  font-style: italic;
  color: rgba(241, 245, 249, 0.35);
  margin: 0;
  pointer-events: none;
  z-index: 2;
}

.showcase__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}

.showcase__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-primary);
  cursor: pointer;
  transition:
    background 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
}

.showcase__btn:hover:not(:disabled) {
  background: rgba(45, 212, 191, 0.12);
  border-color: rgba(45, 212, 191, 0.35);
  transform: translateY(-2px);
}

.showcase__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.showcase__btn-icon {
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 300;
  margin-top: -2px;
}

.showcase__dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.showcase__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-background-alt);
  padding: 0;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.showcase__dot:hover {
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.showcase__dot--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.15);
}

@media (max-width: 768px) {
  .showcase__slide--peek-left {
    transform: translateZ(-40px) rotateY(14deg) scale(0.9);
    opacity: 0.45;
  }

  .showcase__slide--peek-right {
    transform: translateZ(-40px) rotateY(-14deg) scale(0.9);
    opacity: 0.45;
  }

  .showcase__peek-title {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .showcase__chrome {
    flex-direction: column;
    align-items: center;
  }

  .showcase__counter {
    width: 100%;
    text-align: center;
  }

  .showcase__controls {
    gap: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .showcase__slide--peek-left,
  .showcase__slide--peek-right {
    transform: scale(0.92);
    filter: brightness(0.65);
  }

  .showcase__slide--active {
    transform: scale(1);
  }
}
</style>
