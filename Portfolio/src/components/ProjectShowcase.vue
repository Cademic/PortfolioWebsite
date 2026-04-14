<!--
  Cover-flow carousel: 3D perspective, infinite loop (shift + reset, DEV pattern).
  https://dev.to/laurxn/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0
-->
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
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
  showLogos?: boolean
  showDescriptions?: boolean
  showMediaHint?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLogos: true,
  showDescriptions: true,
  showMediaHint: true,
})
const emit = defineEmits<{
  (e: 'active-project-change', project: ProjectItem): void
}>()
const CAROUSEL_STATE_STORAGE_KEY = 'portfolio-showcase-order-v1'

function logoForProject(title: string): string | null {
  const key = title.trim().toLowerCase()
  if (key === 'asidenote') return '/ASideNote_Logo.png'
  if (key === 'cinescope') return '/cinescope_logo.png'
  if (key === 'blodged') return '/Blodged_Logo.png'
  if (key === 'minesweeper') return '/MineSweep_logo.png'
  if (key === 'lunara') return '/lunara_Logo.png'
  return null
}

const SLIDE_GAP_DESKTOP_PX = 28
const SLIDE_GAP_TABLET_PX = 20
const SLIDE_GAP_MOBILE_PX = 12
const SLIDE_WIDTH_RATIO_DESKTOP = 0.62
const SLIDE_WIDTH_RATIO_TABLET = 0.74
const SLIDE_WIDTH_RATIO_MOBILE = 0.86
const SLIDE_MAX_PX = 820

const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
const slideWidth = ref(0)

/** Fixed DOM slot that stays visually centered (middle of the row). */
function centerSlot(n: number): number {
  if (n <= 1) return 0
  return Math.floor(n / 2)
}

/** Rotated row: items[centerSlot(n)] is the centered project after each settle. */
const items = ref<ProjectItem[]>([])

/** Horizontal offset from the centered layout; rAF + ease-out quint (fluent deceleration). */
const translateExtraPx = ref(0)
/** True while rAF is tweening translateExtra (track has transition: none). */
const translateAnimating = ref(false)
/** Instant jump after rotate (track + slides): no CSS interpolation for one paint. */
const snapInstant = ref(false)
const reducedMotion = ref(false)
const suppressIdleTransitions = ref(true)
/** In-flight navigation; extra steps queue until this finishes. */
const transitioning = ref(false)
let queuedSteps = 0
let translateRafId: number | null = null

/** Pointer drag / swipe (touch + mouse left button) */
const activePointerId = ref<number | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetPx = ref(0)
const isTrackDragging = ref(false)
const pointerDragMoved = ref(false)
const suppressSlideClick = ref(false)
const suppressCarouselLinkOpen = ref(false)
const pointerDownStartedAt = ref(0)
const pointerDownSlideIndex = ref<number | null>(null)
const pointerDownDetailUrl = ref<string | null>(null)
const pointerLastX = ref(0)
const pointerLastMovedAt = ref(0)
const pointerVelocityPxPerMs = ref(0)
const pointerAxisLock = ref<'undecided' | 'x' | 'y'>('undecided')

provide('portfolioCarouselSuppressLinkOpen', suppressCarouselLinkOpen)

const SWIPE_THRESHOLD_PX = 48
const DRAG_DETECT_PX = 4
const MAX_DRAG_STEPS = 48
const BRIEF_CLICK_MS = 220
const MOBILE_BREAKPOINT_PX = 640
const MOBILE_SWIPE_THRESHOLD_PX = 11
const DESKTOP_FLICK_VELOCITY_PX_PER_MS = 0.6
const MOBILE_FLICK_VELOCITY_PX_PER_MS = 0.25
const VELOCITY_MOMENTUM_MS_MOBILE = 240
const VELOCITY_MOMENTUM_MS_DESKTOP = 180
const DIRECTION_LOCK_MIN_PX = 3
/** Programmatic slide duration (CSS transition on track — compositor-smooth). */
const TRACK_TRANSITION_MS_BASE = 300
const TRACK_TRANSITION_MS_PER_STEP = 34
const TRACK_TRANSITION_MS_MAX = 560
/** iOS-like deceleration for horizontal slides */
const SLIDE_EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

const total = computed(() => props.projects.length)

const centerIndex = computed(() => centerSlot(total.value))
const nearestVisualIndex = computed(() => {
  const n = items.value.length
  if (n <= 0) return 0
  const rounded = Math.round(fractionalCenter.value)
  return Math.max(0, Math.min(n - 1, rounded))
})
const activeDisplayIndex = computed(() =>
  transitioning.value || translateAnimating.value || isTrackDragging.value
    ? nearestVisualIndex.value
    : centerIndex.value,
)

watch(
  [activeDisplayIndex, items],
  ([index, currentItems]) => {
    const emitIndex =
      transitioning.value || translateAnimating.value || isTrackDragging.value
        ? centerIndex.value
        : index
    const activeProject = currentItems[emitIndex]
    if (!activeProject) return
    emit('active-project-change', activeProject)
  },
  { immediate: true },
)

const indicatorImageSources = computed(() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const project of props.projects) {
    if (!project.imageSrc || seen.has(project.imageSrc)) continue
    seen.add(project.imageSrc)
    out.push(project.imageSrc)
  }
  return out
})

const activeIndicatorIndex = computed(() => {
  const activeItem = items.value[activeDisplayIndex.value]
  if (!activeItem) return 0
  const idx = indicatorImageSources.value.findIndex((src) => src === activeItem.imageSrc)
  return idx >= 0 ? idx : 0
})

function absoluteImageUrl(src: string): string {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('data:')) return src
  return new URL(src, window.location.origin).href
}

function preloadBitmap(url: string): Promise<void> {
  return new Promise((resolve) => {
    const href = absoluteImageUrl(url)
    if (!href) {
      resolve()
      return
    }
    const img = new Image()
    const done = () => resolve()
    img.onload = () => {
      img.decode?.().then(done).catch(done)
    }
    img.onerror = done
    img.src = href
  })
}

function uniqueProjectImageUrls(projects: ProjectItem[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of projects) {
    if (p.imageSrc && !seen.has(p.imageSrc)) {
      seen.add(p.imageSrc)
      out.push(p.imageSrc)
    }
  }
  return out
}

async function preloadAllProjectImages() {
  const urls = uniqueProjectImageUrls(props.projects)
  await Promise.all(urls.map((u) => preloadBitmap(u)))
}

function shouldPreloadAll() {
  // Small galleries (like project detail pages) should feel instant/infinite.
  // Preloading all images avoids decode lag when looping through 3-6 slides.
  return props.projects.length <= 6
}

function preloadAroundCenter() {
  const list = items.value
  const n = list.length
  if (n === 0) return
  const m = centerIndex.value
  const urls = new Set<string>()
  for (let d = -5; d <= 5; d++) {
    const idx = m + d
    if (idx >= 0 && idx < n) {
      const src = list[idx]?.imageSrc
      if (src) urls.add(src)
    }
  }
  for (const url of urls) void preloadBitmap(url)
}

/** Place projects[0] at the center slot so the first project is centered on load. */
function rebuildItemsFromProjects() {
  const p = props.projects
  const n = p.length
  if (n === 0) {
    items.value = []
    return
  }
  const m = centerSlot(n)
  const out: ProjectItem[] = []
  for (let i = 0; i < n; i++) {
    out.push(p[(i - m + n) % n]!)
  }
  items.value = out
}

function persistCarouselState() {
  if (!items.value.length) return
  const orderedDetailUrls = items.value.map((project) => project.detailUrl)
  try {
    sessionStorage.setItem(
      CAROUSEL_STATE_STORAGE_KEY,
      JSON.stringify(orderedDetailUrls),
    )
  } catch {
    /* ignore storage errors */
  }
}

function tryRestoreCarouselState(): boolean {
  try {
    const raw = sessionStorage.getItem(CAROUSEL_STATE_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== props.projects.length) {
      return false
    }

    const detailUrls = parsed.filter(
      (value): value is string => typeof value === 'string',
    )
    if (detailUrls.length !== props.projects.length) return false

    const projectByDetailUrl = new Map(
      props.projects.map((project) => [project.detailUrl, project]),
    )
    const restoredItems: ProjectItem[] = []
    for (const detailUrl of detailUrls) {
      const project = projectByDetailUrl.get(detailUrl)
      if (!project) return false
      restoredItems.push(project)
    }
    items.value = restoredItems
    return true
  } catch {
    return false
  }
}

function rotateLeft() {
  const row = items.value
  if (row.length <= 1) return
  const first = row.shift()!
  row.push(first)
}

function rotateRight() {
  const row = items.value
  if (row.length <= 1) return
  const last = row.pop()!
  row.unshift(last)
}

const slideGapPx = computed(() => {
  const w = viewportWidth.value
  if (w <= 640) return SLIDE_GAP_MOBILE_PX
  if (w <= 1024) return SLIDE_GAP_TABLET_PX
  return SLIDE_GAP_DESKTOP_PX
})

const slideSpanPx = computed(() => slideWidth.value + slideGapPx.value)

const baseTranslatePx = computed(() => {
  const vw = viewportWidth.value
  const sw = slideWidth.value
  const n = items.value.length
  const m = centerSlot(n)
  if (!vw || !sw || n === 0) return 0
  return vw / 2 - m * (sw + slideGapPx.value) - sw / 2
})

const translatePx = computed(
  () => baseTranslatePx.value + dragOffsetPx.value + translateExtraPx.value,
)

const trackTransitionDurationMs = ref(TRACK_TRANSITION_MS_BASE)

const trackStyle = computed(() => ({
  transform: `translate3d(${translatePx.value}px, 0, 0)`,
  transition:
    isTrackDragging.value ||
    translateAnimating.value ||
    snapInstant.value ||
    suppressIdleTransitions.value ||
    reducedMotion.value
      ? 'none'
      : `transform ${trackTransitionDurationMs.value}ms ${SLIDE_EASE_CSS}`,
}))

function measure() {
  const el = viewportRef.value
  if (!el) return
  const w = el.clientWidth
  viewportWidth.value = w
  const widthRatio =
    w <= 640
      ? SLIDE_WIDTH_RATIO_MOBILE
      : w <= 1024
        ? SLIDE_WIDTH_RATIO_TABLET
        : SLIDE_WIDTH_RATIO_DESKTOP
  const sw = Math.min(w * widthRatio, SLIDE_MAX_PX)
  slideWidth.value = sw
  el.style.setProperty('--showcase-gap', `${slideGapPx.value}px`)
  el.style.setProperty('--showcase-slide-w', `${sw}px`)
}

let ro: ResizeObserver | null = null

function stopTranslateRaf() {
  if (translateRafId !== null) {
    cancelAnimationFrame(translateRafId)
    translateRafId = null
  }
}

/** Strong ease-out — reads fluent left/right (deceleration like native scroll views). */
function easeOutQuint(t: number) {
  return 1 - (1 - t) ** 5
}

function scheduleSnapReenable() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      snapInstant.value = false
      trackTransitionDurationMs.value = TRACK_TRANSITION_MS_BASE
    })
  })
}

/** Visual center slides along the row; includes drag so coverflow updates while scrubbing. */
const fractionalCenter = computed(() => {
  const n = items.value.length
  const m = centerSlot(n)
  const span = slideSpanPx.value
  if (!span || n === 0) return m
  return m - (translateExtraPx.value + dragOffsetPx.value) / span
})

function animateTranslateExtra(
  from: number,
  to: number,
  durationMs: number,
  onComplete: () => void,
) {
  stopTranslateRaf()
  translateAnimating.value = true
  const t0 = performance.now()
  function step(now: number) {
    const elapsed = now - t0
    const t = Math.min(1, durationMs > 0 ? elapsed / durationMs : 1)
    const e = easeOutQuint(t)
    translateExtraPx.value = Math.round((from + (to - from) * e) * 100) / 100
    if (t < 1) {
      translateRafId = requestAnimationFrame(step)
    } else {
      translateRafId = null
      translateExtraPx.value = to
      translateAnimating.value = false
      /** Let the browser paint the final translate before reorder + reset (avoids a 1-frame jump). */
      requestAnimationFrame(() => {
        requestAnimationFrame(onComplete)
      })
    }
  }
  translateRafId = requestAnimationFrame(step)
}

function drainQueuedSteps() {
  if (queuedSteps === 0) return
  const s = queuedSteps
  queuedSteps = 0
  runNextSteps(s)
}

/** After translate animation: rotate buffer + instant reset (same frame, no reorder before motion). */
function settleAfterTranslate(steps: number, forward: boolean) {
  for (let i = 0; i < steps; i++) {
    if (forward) rotateLeft()
    else rotateRight()
  }
  snapInstant.value = true
  translateExtraPx.value = 0
  transitioning.value = false
  scheduleSnapReenable()
  preloadAroundCenter()
}

function runNextSteps(steps: number, startOffsetPx = 0) {
  const n = total.value
  if (n === 0 || steps === 0) return
  if (n === 1) return

  if (transitioning.value) {
    queuedSteps += steps
    return
  }

  const abs = Math.min(Math.abs(steps), MAX_DRAG_STEPS)
  const dir = steps > 0 ? 1 : -1

  if (reducedMotion.value) {
    for (let s = 0; s < abs; s++) {
      if (dir > 0) rotateLeft()
      else rotateRight()
    }
    translateExtraPx.value = 0
    preloadAroundCenter()
    nextTick(drainQueuedSteps)
    return
  }

  const span = slideSpanPx.value
  if (span <= 0) return

  const duration = Math.min(
    TRACK_TRANSITION_MS_MAX,
    TRACK_TRANSITION_MS_BASE + (abs - 1) * TRACK_TRANSITION_MS_PER_STEP,
  )

  transitioning.value = true
  const from = startOffsetPx

  if (dir < 0) {
    animateTranslateExtra(from, abs * span, duration, () => {
      settleAfterTranslate(abs, false)
      nextTick(drainQueuedSteps)
    })
    return
  }

  animateTranslateExtra(from, -abs * span, duration, () => {
    settleAfterTranslate(abs, true)
    nextTick(drainQueuedSteps)
  })
}

function next() {
  suppressIdleTransitions.value = false
  runNextSteps(1)
}

function prev() {
  suppressIdleTransitions.value = false
  runNextSteps(-1)
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

function cleanupPointerDrag(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return
  try {
    viewportRef.value?.releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
  viewportRef.value?.classList.remove('showcase__viewport--dragging')
  activePointerId.value = null
}

function onPointerDown(e: PointerEvent) {
  if (total.value <= 1) return
  if (e.pointerType === 'mouse' && e.button !== 0) return
  if (e.pointerType === 'touch' && e.cancelable) {
    e.preventDefault()
  }
  suppressIdleTransitions.value = false
  trackTransitionDurationMs.value = TRACK_TRANSITION_MS_BASE
  activePointerId.value = e.pointerId
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragOffsetPx.value = 0
  isTrackDragging.value = false
  pointerDragMoved.value = false
  pointerDownStartedAt.value = performance.now()
  pointerLastX.value = e.clientX
  pointerLastMovedAt.value = pointerDownStartedAt.value
  pointerVelocityPxPerMs.value = 0
  pointerAxisLock.value = 'undecided'
  const target = e.target as HTMLElement | null
  const slideEl = target?.closest('.showcase__slide') as HTMLElement | null
  const slideIndexRaw = slideEl?.dataset.slideIndex
  if (slideIndexRaw !== undefined) {
    const parsedIndex = Number.parseInt(slideIndexRaw, 10)
    pointerDownSlideIndex.value = Number.isFinite(parsedIndex)
      ? parsedIndex
      : null
  } else {
    pointerDownSlideIndex.value = null
  }
  pointerDownDetailUrl.value = slideEl?.dataset.detailUrl ?? null
  // Avoid immediate click-through redirects while deciding tap vs drag.
  suppressCarouselLinkOpen.value = true
}

function onPointerMove(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return
  const dx = e.clientX - dragStartX.value
  const dy = e.clientY - dragStartY.value
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)

  if (pointerAxisLock.value === 'undecided') {
    if (absX < DIRECTION_LOCK_MIN_PX && absY < DIRECTION_LOCK_MIN_PX) return
    if (absX < 1 && absY >= DIRECTION_LOCK_MIN_PX) {
      pointerAxisLock.value = 'y'
      suppressCarouselLinkOpen.value = false
      return
    }
    // Any gesture with horizontal movement (including diagonal) controls carousel.
    pointerAxisLock.value = 'x'
  }

  if (pointerAxisLock.value === 'y') return

  if (!isTrackDragging.value) {
    isTrackDragging.value = true
    viewportRef.value?.classList.add('showcase__viewport--dragging')
    try {
      viewportRef.value?.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  dragOffsetPx.value = dx
  if (e.cancelable) {
    e.preventDefault()
  }
  if (absX > DRAG_DETECT_PX) {
    pointerDragMoved.value = true
  }
  const now = performance.now()
  const dt = now - pointerLastMovedAt.value
  if (dt > 0) {
    pointerVelocityPxPerMs.value = (e.clientX - pointerLastX.value) / dt
  }
  pointerLastX.value = e.clientX
  pointerLastMovedAt.value = now
}

function onPointerUp(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return
  const finalDx = e.clientX - dragStartX.value
  const drag = dragOffsetPx.value === 0 ? finalDx : dragOffsetPx.value
  const moved = pointerDragMoved.value || Math.abs(drag) > DRAG_DETECT_PX
  const pressDurationMs = performance.now() - pointerDownStartedAt.value
  const tappedDetailUrl = pointerDownDetailUrl.value
  cleanupPointerDrag(e)

  if (total.value <= 1) {
    dragOffsetPx.value = 0
    isTrackDragging.value = false
    pointerDragMoved.value = false
    pointerAxisLock.value = 'undecided'
    return
  }

  if (pointerAxisLock.value === 'y') {
    dragOffsetPx.value = 0
    isTrackDragging.value = false
    pointerDragMoved.value = false
    pointerAxisLock.value = 'undecided'
    pointerDownStartedAt.value = 0
    pointerDownSlideIndex.value = null
    pointerDownDetailUrl.value = null
    pointerVelocityPxPerMs.value = 0
    return
  }

  const span = slideSpanPx.value
  let steps = 0
  const isMobileViewport = viewportWidth.value <= MOBILE_BREAKPOINT_PX
  if (
    isMobileViewport &&
    pointerAxisLock.value === 'undecided' &&
    Math.abs(drag) > 2
  ) {
    // Fast flicks can end before enough move events arrive; infer horizontal intent on release.
    pointerAxisLock.value = 'x'
  }
  const momentumMs = isMobileViewport ? VELOCITY_MOMENTUM_MS_MOBILE : VELOCITY_MOMENTUM_MS_DESKTOP
  const momentumPx = pointerVelocityPxPerMs.value * momentumMs
  const effectiveDrag = drag + momentumPx
  const swipeThresholdPx = isMobileViewport
    ? Math.min(MOBILE_SWIPE_THRESHOLD_PX, span * 0.14)
    : SWIPE_THRESHOLD_PX
  if (span > 0 && Math.abs(effectiveDrag) >= swipeThresholdPx) {
    const stepSpan = Math.max(1, span * 0.58)
    const projectedSteps = Math.ceil(Math.abs(effectiveDrag) / stepSpan)
    steps = (effectiveDrag < 0 ? 1 : -1) * projectedSteps
  }
  if (steps === 0 && Math.abs(effectiveDrag) >= swipeThresholdPx) {
    steps = effectiveDrag < 0 ? 1 : -1
  }
  if (
    steps === 0 &&
    isMobileViewport &&
    pointerAxisLock.value === 'x' &&
    Math.abs(effectiveDrag) > 1
  ) {
    // Any committed horizontal drag on mobile should advance, not snap back.
    steps = effectiveDrag < 0 ? 1 : -1
  }
  if (steps === 0 && isMobileViewport && moved && Math.abs(effectiveDrag) >= DRAG_DETECT_PX) {
    // On mobile, a short diagonal/horizontal drag should still progress.
    steps = effectiveDrag < 0 ? 1 : -1
  }
  const flickThreshold = isMobileViewport
    ? MOBILE_FLICK_VELOCITY_PX_PER_MS
    : DESKTOP_FLICK_VELOCITY_PX_PER_MS
  if (steps === 0 && Math.abs(pointerVelocityPxPerMs.value) >= flickThreshold) {
    steps = pointerVelocityPxPerMs.value < 0 ? 1 : -1
  }
  if (steps !== 0) {
    steps = steps > 0 ? 1 : -1
  }
  steps = Math.max(-MAX_DRAG_STEPS, Math.min(MAX_DRAG_STEPS, steps))

  const releaseOffset = dragOffsetPx.value
  translateExtraPx.value = releaseOffset
  dragOffsetPx.value = 0
  isTrackDragging.value = false

  if (steps !== 0) {
    runNextSteps(steps, releaseOffset)
  } else {
    const settleMs = Math.min(
      280,
      Math.max(
        120,
        Math.abs(releaseOffset) / Math.max(1, span) * TRACK_TRANSITION_MS_BASE,
      ),
    )
    animateTranslateExtra(releaseOffset, 0, settleMs, () => {})
  }

  const isBriefClick =
    steps === 0 &&
    !moved &&
    Math.abs(drag) <= DRAG_DETECT_PX &&
    pressDurationMs <= BRIEF_CLICK_MS

  if (isBriefClick && tappedDetailUrl) {
    persistCarouselState()
    window.location.assign(tappedDetailUrl)
  }

  const shouldSuppressTap =
    !isBriefClick || steps !== 0 || moved || Math.abs(drag) > DRAG_DETECT_PX
  if (shouldSuppressTap) {
    suppressSlideClick.value = true
    queueMicrotask(() => {
      suppressSlideClick.value = false
    })
  }
  setTimeout(() => {
    suppressCarouselLinkOpen.value = false
  }, 40)
  pointerDownStartedAt.value = 0
  pointerDownSlideIndex.value = null
  pointerDownDetailUrl.value = null
  pointerDragMoved.value = false
  pointerVelocityPxPerMs.value = 0
  pointerAxisLock.value = 'undecided'
}

function onPointerCancel(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return
  cleanupPointerDrag(e)
  dragOffsetPx.value = 0
  isTrackDragging.value = false
  pointerDragMoved.value = false
  pointerDownStartedAt.value = 0
  pointerDownSlideIndex.value = null
  pointerDownDetailUrl.value = null
  suppressCarouselLinkOpen.value = false
  pointerVelocityPxPerMs.value = 0
  pointerAxisLock.value = 'undecided'
}

/** Shortest signed steps on the project circle from current center to target slot index. */
function stepsFromCenterToSlot(clickedSlot: number): number {
  const n = total.value
  const m = centerIndex.value
  if (n <= 1) return 0
  let forward = (clickedSlot - m + n) % n
  let backward = forward - n
  if (forward <= -backward) return forward
  return backward
}

function onSlideActivate(slotIndex: number, e: MouseEvent) {
  if (suppressSlideClick.value) {
    e.preventDefault()
  }
}

let mq: MediaQueryList | null = null

function updateReducedMotion() {
  reducedMotion.value = mq?.matches ?? false
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateReducedMotion()
  mq.addEventListener?.('change', updateReducedMotion)

  if (!tryRestoreCarouselState()) {
    rebuildItemsFromProjects()
  }

  nextTick(() => {
    measure()
    if (viewportRef.value) {
      ro = new ResizeObserver(() => measure())
      ro.observe(viewportRef.value)
      const vp = viewportRef.value
      vp.addEventListener('wheel', onWheel, { passive: false })
      wheelCleanup = () => vp.removeEventListener('wheel', onWheel)
    }
    if (shouldPreloadAll()) {
      void preloadAllProjectImages()
    }
    preloadAroundCenter()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suppressIdleTransitions.value = false
      })
    })
  })
})

onUnmounted(() => {
  stopTranslateRaf()
  mq?.removeEventListener?.('change', updateReducedMotion)
  ro?.disconnect()
  wheelCleanup?.()
})

watch(
  () => props.projects.length,
  () => {
    stopTranslateRaf()
    queuedSteps = 0
    if (!tryRestoreCarouselState()) {
      rebuildItemsFromProjects()
    }
    translateExtraPx.value = 0
    transitioning.value = false
    nextTick(measure)
  },
)

watch(
  () => props.projects.map((p) => p.imageSrc).join('\0'),
  () => {
    if (!tryRestoreCarouselState()) {
      rebuildItemsFromProjects()
    }
    if (shouldPreloadAll()) {
      void preloadAllProjectImages()
    }
    nextTick(() => preloadAroundCenter())
  },
)

watch(items, () => {
  preloadAroundCenter()
})


function slideOffset(index: number) {
  return index - fractionalCenter.value
}

const slideEase = '0.32s cubic-bezier(0.22, 1, 0.36, 1)'

function slideVisualStyle(index: number) {
  const off = slideOffset(index)
  const abs = Math.abs(off)
  const dist = Math.min(abs, 4)
  const sign = off === 0 ? 0 : off > 0 ? 1 : -1
  const isMobile = viewportWidth.value <= 640

  if (reducedMotion.value) {
    return {
      zIndex: abs < 0.5 ? '20' : '1',
      opacity: abs < 0.5 ? '1' : '0.42',
      transform: abs < 0.5 ? 'translateZ(0) scale(1)' : 'translateZ(0) scale(0.9)',
      filter: 'brightness(0.7)',
      transition: 'none',
    }
  }

  if (isMobile) {
    const isCenter = abs < 0.5
    const sideScale = 1
    const sideDepth = -28
    return {
      zIndex: isCenter ? '20' : '1',
      opacity: '1',
      transform: isCenter
        ? 'translateZ(0) scale(1)'
        : `translateZ(${sideDepth}px) scale(${sideScale})`,
      filter: 'none',
      transition: snapInstant.value || suppressIdleTransitions.value
        ? 'none'
        : `opacity ${slideEase}, transform ${slideEase}`,
    }
  }

  const rot = -sign * Math.min(28, 12 + dist * 14)
  const opacity = abs < 0.5 ? 1 : Math.max(0.22, 0.92 - dist * 0.2)
  const scale = abs < 0.5 ? 1 : Math.max(0.78, 0.96 - dist * 0.045)
  const tz = abs < 0.5 ? 40 : -55 - dist * 22
  const bright = abs < 0.5 ? 1 : Math.max(0.45, 0.82 - dist * 0.12)
  const z = Math.round(20 - dist)

  // Keep filter changes instant on slides. Chromium can defer descendant keyframe paints
  // when an ancestor is actively transitioning filter, which makes glow animations pop in late.
  const filter =
    abs < 0.5
      ? 'none'
      : `brightness(${bright}) saturate(${abs >= 0.5 ? 0.72 : 1})`

  return {
    zIndex: String(z),
    opacity: String(opacity),
    transform: `translateZ(${tz}px) rotateY(${rot}deg) scale(${scale})`,
    filter,
    transition: snapInstant.value || suppressIdleTransitions.value
      ? 'none'
      : `opacity ${slideEase}, transform ${slideEase}`,
  }
}

function slideHeaderStyle(index: number) {
  const isMobile = viewportWidth.value <= MOBILE_BREAKPOINT_PX
  if (isMobile) return { opacity: '1' }
  const abs = Math.abs(slideOffset(index))
  const opacity = abs < 0.5 ? 1 : Math.max(0.3, 0.88 - abs * 0.18)
  return { opacity: String(opacity) }
}

function isSlideActive(index: number) {
  return index === activeDisplayIndex.value
}

function onWheel(e: WheelEvent) {
  if (total.value <= 1) return
  suppressIdleTransitions.value = false
  const dx = e.deltaX
  const dy = e.deltaY
  const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy
  if (Math.abs(dominant) < 18) return
  if (Math.abs(dx) <= Math.abs(dy) && !e.shiftKey) return
  e.preventDefault()
  if (dominant > 0) next()
  else prev()
}

let wheelCleanup: (() => void) | null = null
</script>

<template>
  <div
    class="showcase"
    :class="{ 'showcase--minimal': !showLogos && !showDescriptions }"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`Project showcase, ${total} projects. Click and drag horizontally to browse, or tap a side project.`"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div
      ref="viewportRef"
      class="showcase__viewport"
      @pointerdown.capture="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <div class="showcase__viewport-inner">
        <div
          class="showcase__track"
          :class="{ 'showcase__track--instant': snapInstant }"
          :style="trackStyle"
        >
          <div
            v-for="(project, index) in items"
            :key="project.detailUrl"
            class="showcase__slide"
            :data-slide-index="index"
            :data-detail-url="project.detailUrl"
            :class="{
              'showcase__slide--inactive': !isSlideActive(index),
              'showcase__slide--instant': snapInstant,
            }"
            :style="slideVisualStyle(index)"
            @click="onSlideActivate(index, $event)"
          >
            <div
              v-if="showLogos"
              class="showcase__slide-head"
              :style="slideHeaderStyle(index)"
            >
              <img
                v-if="logoForProject(project.title)"
                class="showcase__slide-logo"
                :class="{
                  'showcase__slide-logo--minesweeper':
                    project.title.trim().toLowerCase() === 'minesweeper',
                }"
                :src="logoForProject(project.title)!"
                :alt="`${project.title} logo`"
                loading="lazy"
                decoding="async"
              />
            </div>
            <ProjectCard
              :title="project.title"
              :description="project.description"
              :image-src="project.imageSrc"
              :detail-url="project.detailUrl"
              :image-alt="project.imageAlt"
              variant="carousel"
              :omit-title="true"
              :is-main-display="isSlideActive(index)"
              :show-media-hint="showMediaHint"
            />
            <p v-if="showDescriptions" class="showcase__slide-description">
              {{ project.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div
    v-if="indicatorImageSources.length > 1"
    class="showcase__indicators"
    aria-hidden="true"
  >
    <span
      v-for="(src, index) in indicatorImageSources"
      :key="src"
      class="showcase__indicator-dot"
      :class="{ 'showcase__indicator-dot--active': index === activeIndicatorIndex }"
    />
  </div>
</template>

<style scoped>
.showcase {
  --font-display: 'DM Serif Display', Georgia, 'Times New Roman', serif;

  outline: none;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  padding: 0 clamp(0.75rem, 3vw, 1.5rem) 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.showcase:focus-visible {
  box-shadow: none;
  outline: 2px solid rgba(45, 212, 191, 0.55);
  outline-offset: 4px;
  border-radius: 4px;
}

.showcase__viewport {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  min-height: min(44vh, 540px);
  margin: 0;
  padding: clamp(0.75rem, 2vw, 1.5rem) 0 clamp(1.25rem, 3vw, 2.25rem);
  touch-action: none;
  perspective: 1400px;
  perspective-origin: 50% 42%;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.showcase__viewport--dragging {
  cursor: grabbing;
  touch-action: none;
}

.showcase__viewport :deep(.project-card__image) {
  -webkit-user-drag: none;
  user-select: none;
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
  gap: var(--showcase-gap, 28px);
  width: max-content;
  will-change: transform;
  transform-style: preserve-3d;
}

.showcase__track--instant {
  transition: none !important;
}

.showcase__slide--instant {
  transition: none !important;
}

.showcase__slide--instant .showcase__slide-head {
  transition: none !important;
}

.showcase__slide {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 0 var(--showcase-slide-w, min(68vw, 880px));
  width: var(--showcase-slide-w, min(68vw, 880px));
  min-width: 0;
  box-sizing: border-box;
  transform-style: preserve-3d;
  transform-origin: center center;
  backface-visibility: hidden;
}

/* Side slides: whole card is the hit target (title, image, edges) */
.showcase__slide--inactive {
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
}

.showcase__slide--inactive :deep(.project-card) {
  pointer-events: none;
}

/* Center slide: ignore hits except the screenshot link (so side slides stay clickable) */
.showcase__slide--active {
  pointer-events: none;
}

.showcase__slide--active .showcase__slide-head {
  pointer-events: none;
}

.showcase__slide--active :deep(.project-card) {
  pointer-events: none;
}

.showcase__slide--active :deep(.project-card__media) {
  pointer-events: auto;
  cursor: pointer;
}

.showcase__slide-head {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: clamp(4.25rem, 10.5vw, 5.75rem);
  margin-bottom: clamp(0.65rem, 1.5vw, 1rem);
  padding-inline: 0.5rem;
  box-sizing: border-box;
  transition: opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.showcase__slide-logo {
  display: block;
  max-width: min(84%, 460px);
  max-height: clamp(3rem, 8vw, 4.6rem);
  width: auto;
  height: auto;
  object-fit: contain;
}

.showcase__slide-logo--minesweeper {
  max-width: min(94%, 540px);
  max-height: clamp(3.6rem, 9.5vw, 5.6rem);
}

.showcase__slide-description {
  margin: 0;
  padding: 0.85rem 0.35rem 0;
  font-size: clamp(0.95rem, 1.8vw, 1.02rem);
  line-height: 1.55;
  color: rgba(148, 163, 184, 0.95);
  text-align: center;
  text-wrap: balance;
}

.showcase--minimal .showcase__slide {
  gap: 0;
}

.showcase__indicators {
  display: none;
}

.showcase__indicator-dot {
  display: inline-block;
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  transition: all 220ms ease;
}

.showcase__indicator-dot--active {
  width: 1.3rem;
  background: rgba(0, 224, 255, 0.95);
}

@media (max-width: 1024px) {
  .showcase__viewport {
    min-height: min(40vh, 470px);
    perspective: 1200px;
  }
}

@media (max-width: 640px) {
  .showcase {
    padding-inline: 0.25rem;
  }

  .showcase__viewport {
    min-height: min(34vh, 360px);
    padding: 0.45rem 0 0.7rem;
    perspective: 900px;
  }

  .showcase__slide-description {
    padding-top: 0.55rem;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .showcase__indicators {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.45rem;
    padding-top: 0.35rem;
  }
}

</style>
