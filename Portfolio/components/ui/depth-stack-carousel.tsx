"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

// Depth-stack geometry for peeking cards, modeled on reactbits' Depth
// Carousel: each neighbor sits further along the Z axis (pushed back under
// a shared `perspective`) and rotated around the vertical axis so its outer
// edge faces the viewer, rather than a flat 2D tilt. Unlike that reference
// (which only stacks toward one side), neighbors recede symmetrically on
// both sides so the previous card stays visible too.
const PEEK_OFFSET_PX = 400;
const PEEK_DEPTH_PX = 240;
const PEEK_TILT_DEG = 10;
const PEEK_OPACITY = 0.55;
const PEEK_BLUR_PX = 3;
const PEEK_TINT_OPACITY = 0.35;
const PERSPECTIVE_PX = 1400;

// Drag-to-swipe thresholds for the front card: crossing either the distance
// or the velocity threshold advances the stack, whichever comes first (a
// slow deliberate drag vs. a quick flick).
const SWIPE_DISTANCE_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 500;

// Framer Motion recommends memoizing dragConstraints rather than passing a
// new object every render — a fresh reference each time (as this was, being
// inline JSX) can leave the drag gesture's origin out of sync with the
// `animate` prop when a card's role changes, freezing it at a stale peek
// transform after a non-adjacent jump (e.g. clicking a distant dot).
const DRAG_CONSTRAINTS = { left: 0, right: 0 };

// Signed distance from the active card, wrapped around the loop so it's
// always the shortest way there — e.g. with 3 cards, the one "after" the
// last card is 1 step forward, not 2, so a neighbor is always populated on
// both sides regardless of which card is active.
function wrappedOffset(i: number, activeIndex: number, count: number): number {
  const raw = i - activeIndex;
  const half = count / 2;
  if (raw > half) return raw - count;
  if (raw < -half) return raw + count;
  return raw;
}

// Measures every item's natural content height and tracks the tallest one,
// so every card in the stack can share a single height sized to whichever
// has the most content — instead of a fixed value hand-picked per
// breakpoint, which drifts out of sync whenever copy changes. The caller
// mounts one invisible clone per item, in normal flow, as children of the
// returned `containerRef`; each is measured independently (siblings don't
// affect each other's height, they just stack), and a ResizeObserver on
// every child picks up content and breakpoint-driven size changes.
function useMaxMeasuredHeight(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      let max = 0;
      for (const child of Array.from(container.children)) {
        const height = child.getBoundingClientRect().height;
        if (height > max) max = height;
      }
      setMaxHeight(max);
    };

    measure();
    const observer = new ResizeObserver(measure);
    for (const child of Array.from(container.children)) {
      observer.observe(child);
    }
    return () => observer.disconnect();
    // Re-run whenever the number of cards changes shape (children mounted).
  }, [itemCount]);

  return [containerRef, maxHeight] as const;
}

function DepthStackCard({
  index: i,
  count,
  offset,
  onActivate,
  onDragEnd,
  children,
}: {
  index: number;
  count: number;
  offset: number;
  onActivate: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  children: ReactNode;
}) {
  const isActive = offset === 0;
  const isHidden = Math.abs(offset) > 1;
  const sign = Math.sign(offset);
  const targetX = isActive ? 0 : offset * PEEK_OFFSET_PX;

  // `x` is a MotionValue we own and hand to `drag` via `style` (rather than
  // driving it through the declarative `animate` prop) so there's a single
  // source of truth for it. Splitting ownership — `animate` claiming x while
  // `drag` also manages it — is what caused a card to freeze at its old peek
  // position after a non-adjacent jump (e.g. clicking a distant dot): the two
  // systems disagreed about which of them owned the value.
  const x = useMotionValue(targetX);
  useEffect(() => {
    const controls = animate(x, targetX, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [targetX, x]);

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${count}`}
      aria-hidden={!isActive}
      className={cn("absolute inset-0", !isActive && "hidden cursor-pointer sm:block")}
      style={{ zIndex: 10 - Math.abs(offset), x }}
      initial={false}
      animate={
        isActive
          ? { z: 0, rotateY: 0, opacity: 1, filter: "blur(0px)" }
          : {
              z: -PEEK_DEPTH_PX,
              rotateY: sign * PEEK_TILT_DEG,
              opacity: isHidden ? 0 : PEEK_OPACITY,
              filter: `blur(${PEEK_BLUR_PX}px)`,
            }
      }
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      drag={isActive ? "x" : false}
      dragConstraints={DRAG_CONSTRAINTS}
      dragElastic={0.6}
      onDragEnd={isActive ? onDragEnd : undefined}
      onClick={isActive ? undefined : onActivate}
    >
      <div className={cn("relative h-full", !isActive && "pointer-events-none")}>
        {children}
        {!isActive && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-xl bg-black"
            style={{ opacity: isHidden ? 0 : PEEK_TINT_OPACITY }}
          />
        )}
      </div>
    </motion.div>
  );
}

export interface DepthStackCarouselProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, index: number) => ReactNode;
  ariaLabel: string;
  className?: string;
}

export function DepthStackCarousel<T>({
  items,
  getKey,
  renderCard,
  ariaLabel,
  className,
}: DepthStackCarouselProps<T>) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  // Only paint the carousel's focus ring for genuine keyboard focus. The
  // region is a `tabindex` container overlaying the whole card, so a click or
  // drag on a card bubbles focus up to it, and Chrome's `:focus-visible`
  // heuristic then shows the ring whenever the previous input was the keyboard
  // — a blue outline flashing around the card seemingly at random. Tracking a
  // pointer press that's in flight when focus lands lets us suppress it.
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const pointerFocusRef = useRef(false);
  const [spacerContainerRef, measuredHeight] = useMaxMeasuredHeight(count);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_DISTANCE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
        goTo(index + 1);
      } else if (info.offset.x > SWIPE_DISTANCE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
        goTo(index - 1);
      }
    },
    [index, goTo]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
    },
    [index, goTo]
  );

  return (
    <div className={cn("relative", className)}>
      {/* A plain div with a CSS height transition, not a `motion.div` with
          Framer Motion's `animate` prop: this carousel can be nested inside a
          parent `AnimatePresence` (the tab-switch swipe in ProjectsSection),
          and AnimatePresence's internal layout tracking reaches into nested
          `motion` components even without an explicit `layout` prop — it was
          snapshotting this element's height before the ResizeObserver
          measurement resolved and freezing it there, so the card silently
          rendered shorter than its true content. A plain element with a
          native CSS transition sits outside Framer Motion's layout system
          entirely and isn't affected. */}
      <div
        className="relative"
        style={{
          height: measuredHeight,
          transition: "height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Invisible clones of every item, purely to measure natural content
            height — the container is pulled out of layout (absolute), but
            each clone inside it stacks in normal flow, so it sizes to its
            own content independent of its siblings. Every card in the stack
            then shares `measuredHeight` (the tallest of them) so none get
            more or less room than the others. */}
        <div
          ref={spacerContainerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 opacity-0"
        >
          {items.map((item, i) => (
            <div key={getKey(item)}>{renderCard(item, i)}</div>
          ))}
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={() => {
            pointerFocusRef.current = true;
            // Focus lands synchronously right after this handler; clear the
            // flag on the next tick once onFocus has had its chance to read it.
            setTimeout(() => {
              pointerFocusRef.current = false;
            }, 0);
          }}
          onFocus={() => {
            if (!pointerFocusRef.current) setKeyboardFocused(true);
          }}
          onBlur={() => setKeyboardFocused(false)}
          style={{ perspective: PERSPECTIVE_PX }}
          className={cn(
            "absolute inset-0 origin-top outline-none",
            keyboardFocused && "ring-2 ring-accent"
          )}
        >
          {items.map((item, i) => (
            <DepthStackCard
              key={getKey(item)}
              index={i}
              count={count}
              offset={wrappedOffset(i, index, count)}
              onActivate={() => goTo(i)}
              onDragEnd={handleDragEnd}
            >
              {renderCard(item, i)}
            </DepthStackCard>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-panel-strong bg-card text-ink outline-none transition-[color,background-color,border-color,transform] duration-300 ease-out hover:scale-110 hover:border-ink hover:bg-ink hover:text-card active:scale-90 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-10 sm:w-10"
        >
          <CaretLeftIcon
            size={18}
            weight="bold"
            className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
          />
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out",
                i === index ? "w-6 bg-accent" : "w-2 bg-panel-strong hover:bg-ink-muted"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-panel-strong bg-card text-ink outline-none transition-[color,background-color,border-color,transform] duration-300 ease-out hover:scale-110 hover:border-ink hover:bg-ink hover:text-card active:scale-90 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-10 sm:w-10"
        >
          <CaretRightIcon
            size={18}
            weight="bold"
            className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}
