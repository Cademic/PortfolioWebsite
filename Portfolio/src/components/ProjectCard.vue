<!--
  Project card: hero image (links to details), title, brief description.
  Use variant="carousel" in the peek carousel (no panel chrome behind the project).
-->
<script setup lang="ts">
import { computed, inject, nextTick, onMounted, watch, type Ref, ref } from 'vue'

interface Props {
  title: string
  description: string
  imageSrc: string
  detailUrl: string
  imageAlt?: string
  variant?: 'card' | 'carousel'
  /** Hide title (shown in carousel chrome instead) */
  omitTitle?: boolean
  /** True when this card is the centered/active carousel item */
  isMainDisplay?: boolean
  /** Show the media overlay hint icon (GitHub mark) */
  showMediaHint?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: '',
  variant: 'card',
  omitTitle: false,
  isMainDisplay: false,
  showMediaHint: true,
})

const carouselImageLoading = computed(() =>
  props.variant === 'carousel' && props.isMainDisplay ? 'eager' : 'lazy',
)

/** Set by ProjectShowcase after a drag so the synthetic click doesn’t open GitHub */
const suppressCarouselLinkOpen = inject<Ref<boolean>>(
  'portfolioCarouselSuppressLinkOpen',
  ref(false),
)

function namedGlowForTitle(title: string): string | null {
  const key = title.trim().toLowerCase()
  if (key === 'blodged') return '168, 85, 247'
  if (key === 'cinescope') return '239, 68, 68'
  if (key === 'minesweeper') return '59, 130, 246'
  if (key === 'lunara') return '248, 250, 252'
  if (key === 'asidenote') return '59, 130, 246'
  return null
}

const initialNamedGlow = namedGlowForTitle(props.title) ?? '45, 212, 191'
const dominantGlowColor = ref(initialNamedGlow)
const leftGlowColor = ref(initialNamedGlow)
const rightGlowColor = ref(initialNamedGlow)
const mediaStyle = computed(() => ({
  '--project-glow-color': dominantGlowColor.value,
  '--project-glow-left': leftGlowColor.value,
  '--project-glow-right': rightGlowColor.value,
}))
const glowSurfaceRef = ref<HTMLElement | null>(null)

function clampRgb(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function titleKey() {
  return props.title.trim().toLowerCase()
}

function applyNamedGlow() {
  const namedGlow = namedGlowForTitle(props.title)
  if (!namedGlow) return false
  dominantGlowColor.value = namedGlow
  leftGlowColor.value = namedGlow
  rightGlowColor.value = namedGlow
  return true
}

function extractDominantColor(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  const sampleSize = 32
  canvas.width = sampleSize
  canvas.height = sampleSize

  try {
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize)
    let sumR = 0
    let sumG = 0
    let sumB = 0
    let weightTotal = 0

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255
      if (alpha < 0.3) continue
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Favor colorful pixels over near-gray pixels for a stronger glow.
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const saturation = max === 0 ? 0 : (max - min) / max
      const weight = alpha * (0.35 + saturation * 1.65)

      sumR += r * weight
      sumG += g * weight
      sumB += b * weight
      weightTotal += weight
    }

    if (weightTotal <= 0) return null

    // Slightly boost for visible glow while keeping tone close to source image.
    const r = clampRgb((sumR / weightTotal) * 1.08)
    const g = clampRgb((sumG / weightTotal) * 1.08)
    const b = clampRgb((sumB / weightTotal) * 1.08)
    return `${r}, ${g}, ${b}`
  } catch {
    return null
  }
}

function syncCarouselGlowFromProps() {
  if (props.variant !== 'carousel') return
  applyNamedGlow()
}

onMounted(syncCarouselGlowFromProps)

function triggerGlowAnimation(reason: string) {
  if (props.variant !== 'carousel' || !props.isMainDisplay) return
  const glow = glowSurfaceRef.value
  if (!glow) return

  glow.classList.remove('project-card__carousel-glow-surface--animating')
  void glow.offsetWidth

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      glow.classList.add('project-card__carousel-glow-surface--animating')
    })
  })
}

onMounted(async () => {
  if (props.variant !== 'carousel' || !props.isMainDisplay) return
  await nextTick()
  triggerGlowAnimation('mounted-main-display')
})

watch(
  () => props.isMainDisplay,
  async (isMainDisplay) => {
    if (!isMainDisplay || props.variant !== 'carousel') return
    await nextTick()
    triggerGlowAnimation('is-main-display-true')
  },
)

watch(
  () => [props.variant, props.title] as const,
  () => syncCarouselGlowFromProps(),
)

function onImageLoad(e: Event) {
  if (applyNamedGlow()) return
  const img = e.target as HTMLImageElement | null
  if (!img) return
  const color = extractDominantColor(img)
  if (color) {
    dominantGlowColor.value = color
    leftGlowColor.value = color
    rightGlowColor.value = color
  }
}

function openRepo() {
  window.location.assign(props.detailUrl)
}

function onCarouselMediaClick() {
  if (suppressCarouselLinkOpen.value) return
  openRepo()
}

function onCarouselAuxClick(e: MouseEvent) {
  if (e.button !== 1) return
  e.preventDefault()
  if (suppressCarouselLinkOpen.value) return
  openRepo()
}

</script>

<template>
  <article
    class="project-card"
    :class="{
      'project-card--carousel': variant === 'carousel',
      'project-card--main-display': variant === 'carousel' && isMainDisplay,
    }"
  >
    <!-- Soft gradients only (no CSS filter): ancestor/sibling filter:blur() makes Chromium defer child animation paints. -->
    <div
      v-if="variant === 'carousel' && isMainDisplay"
      class="project-card__carousel-glow"
      aria-hidden="true"
    >
      <div
        ref="glowSurfaceRef"
        class="project-card__carousel-glow-surface"
      />
    </div>

    <a
      v-if="variant !== 'carousel'"
      :href="detailUrl"
      class="project-card__media"
      :style="mediaStyle"
      :aria-label="`View details for ${title}`"
    >
      <img
        class="project-card__image"
        :src="imageSrc"
        :alt="imageAlt || `${title} screenshot`"
        loading="lazy"
        decoding="async"
        width="1200"
        height="675"
        @load="onImageLoad"
      />
      <span v-if="showMediaHint" class="project-card__media-hint" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </span>
    </a>

    <!-- Not an anchor: avoids native “drag URL” so the carousel can use horizontal drag -->
    <div
      v-else
      class="project-card__media project-card__media--carousel-hit"
      :style="mediaStyle"
      role="button"
      tabindex="0"
      :aria-label="`View details for ${title}`"
      @click="onCarouselMediaClick"
      @keydown.enter.prevent="onCarouselMediaClick"
      @auxclick="onCarouselAuxClick"
    >
      <div class="project-card__carousel-frame">
        <img
          class="project-card__image project-card__image--carousel"
          :src="imageSrc"
          :alt="imageAlt || `${title} screenshot`"
          draggable="false"
          :loading="carouselImageLoading"
          decoding="async"
          width="1200"
          height="675"
          @dragstart.prevent
          @load="onImageLoad"
        />
        <span v-if="showMediaHint" class="project-card__media-hint" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </span>
      </div>
    </div>

    <div class="project-card__body">
      <h3 v-if="!omitTitle" class="project-card__title">{{ title }}</h3>
      <p v-if="variant !== 'carousel'" class="project-card__description">
        {{ description }}
      </p>
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
  background: transparent;
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
  width: 100%;
  max-width: 100%;
  position: relative;
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

/* Grid cards: framed 16:9 tile */
.project-card:not(.project-card--carousel) .project-card__media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: transparent;
  outline: none;
  border-radius: var(--radius-lg, 18px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.project-card:not(.project-card--carousel) .project-card__media:focus-visible {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 0 0 2px var(--color-primary);
}

/* Carousel: no card chrome — image shrink-wraps and centers; hint sits on the bitmap */
.project-card--carousel .project-card__media {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: visible;
  background: transparent;
  outline: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  user-select: none;
  -webkit-user-select: none;
}

.project-card__media--carousel-hit {
  cursor: pointer;
  -webkit-user-drag: none;
}

.project-card--carousel .project-card__media:focus-visible {
  box-shadow: none;
}

.project-card--carousel .project-card__media:focus-visible .project-card__carousel-frame {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 12px;
}

/* Same footprint for every project: fixed frame, image scales inside with contain */
.project-card__carousel-frame {
  position: relative;
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  line-height: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 56px rgba(2, 6, 23, 0.3);
  transition: box-shadow 680ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card--carousel.project-card--main-display {
  isolation: isolate;
  z-index: 0;
}

.project-card--carousel.project-card--main-display .project-card__carousel-frame {
  box-shadow:
    -42px 0 104px rgba(var(--project-glow-left), 0.14),
    42px 0 104px rgba(var(--project-glow-right), 0.14),
    0 0 104px rgba(var(--project-glow-color), 0.1),
    0 24px 56px rgba(2, 6, 23, 0.3);
}

.project-card--carousel.project-card--main-display .project-card__media,
.project-card--carousel.project-card--main-display .project-card__body {
  position: relative;
  z-index: 1;
}

/* Main centered card: soft gradients (no filter: blur — same compositor issue as showcase slides) */
.project-card__carousel-glow {
  position: absolute;
  inset: -42px -38px -34px;
  z-index: 0;
  pointer-events: none;
  border-radius: 34px;
  overflow: visible;
}

.project-card__carousel-glow-surface {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  transform-origin: 50% 52%;
  background:
    radial-gradient(
      ellipse 95% 80% at 18% 50%,
      rgba(var(--project-glow-left), 0.2) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse 95% 80% at 82% 50%,
      rgba(var(--project-glow-right), 0.2) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse 100% 90% at 50% 56%,
      rgba(var(--project-glow-color), 0.14) 0%,
      transparent 62%
    );
  will-change: opacity, transform;
  transform: scale(0.9);
  opacity: 0.18;
}

.project-card__carousel-glow-surface--animating {
  animation: glow-grow-in 680ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes glow-grow-in {
  0% {
    transform: scale(0.9);
    opacity: 0.18;
  }
  60% {
    transform: scale(1.02);
    opacity: 0.82;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.45s var(--ease-out);
  border-radius: 14px;
}

.project-card:not(.project-card--carousel) .project-card__image {
  width: 100%;
  height: 100%;
}

/* Carousel: fill the shared frame; pointer hits the outer hit target */
.project-card--carousel .project-card__image--carousel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  pointer-events: none;
}

/* Grid cards: zoom on hover/focus */
.project-card:not(.project-card--carousel) .project-card__media:hover .project-card__image,
.project-card:not(.project-card--carousel) .project-card__media:focus-visible .project-card__image {
  transform: scale(1.03);
}

.project-card__media-hint {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  color: var(--color-primary);
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.45);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
}

.project-card__media-hint svg {
  width: 18px;
  height: 18px;
}

.project-card__media:hover .project-card__media-hint,
.project-card__media:focus-visible .project-card__media-hint {
  opacity: 1;
  transform: translateY(0);
}

/* Centered carousel card: keep GitHub icon visible at all times */
.project-card--carousel.project-card--main-display .project-card__media-hint {
  opacity: 1;
  transform: translateY(0);
}

@media (hover: none) {
  .project-card__media-hint {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card__carousel-glow-surface {
    animation: none;
    transform: none;
    opacity: 1;
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
