"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Fraction of the row/column the active panel occupies; the rest is split
// evenly across the remaining collapsed panels. Ported from the flex-grow
// math in reactbits' Accordion Gallery (expandRatio). Both values are tuned
// alongside the back face's content density (see ProjectBack) to be the
// smallest ratio that still fits the longest project's content without an
// inner scrollbar, down to a ~320px viewport.
const EXPAND_RATIO_DESKTOP = 0.44;
const EXPAND_RATIO_MOBILE = 0.63;
const TILT_DEG = 6;
// Perspective distance for the flip/tilt 3D transforms. The expanded card can
// be ~450px wide, and CSS perspective foreshortening magnifies the near edge
// as it rotates — too tight a value (e.g. 1000) makes that edge visually
// bulge taller than the card's resting box, which then gets clipped by the
// flat overflow-hidden wrapper (see the comment on the tilt wrapper below).
// A larger perspective keeps that magnification small enough to stay inside
// the clip box through the whole rotation.
const PERSPECTIVE = 2200;
// Hover-intent delay before a card's expand/tilt is committed. `flex-grow`
// is animated via CSS transition, which — unlike transform/opacity — forces
// layout on every frame. Sweeping the pointer quickly across several cards
// fires onMouseEnter for each one, restarting that layout-triggering
// transition dozens of times a second and stuttering. Waiting a short beat
// before committing means a card the pointer only passes over never starts
// a transition at all — only the one it settles on does.
const HOVER_INTENT_DELAY = 90;

// Same flip mechanic as animate-ui's FlipCard (installed at
// components/animate-ui/components/community/flip-card.tsx): named
// variants + the `backface-hidden` utility, just applied to caller-supplied
// front/back content instead of its profile-card layout.
const FLIP_EASE = [0.65, 0, 0.35, 1] as const;

const cardVariants = {
  front: { rotateY: 0, transition: { duration: 0.9, ease: FLIP_EASE } },
  back: { rotateY: 180, transition: { duration: 0.9, ease: FLIP_EASE } },
};

function growFor(expandRatio: number, count: number): number {
  return (expandRatio * (count - 1)) / (1 - expandRatio);
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export interface AccordionGalleryRenderProps {
  priority: boolean;
}

interface AccordionGalleryPanelProps<T> {
  item: T;
  index: number;
  count: number;
  isActive: boolean;
  isFlipped: boolean;
  grow: number;
  tiltDirection: -1 | 0 | 1;
  onActivate: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onFocusStart: () => void;
  onFocusEnd: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  priority: boolean;
  getLabel: (item: T) => string;
  renderFront: (item: T, render: AccordionGalleryRenderProps) => ReactNode;
  renderBack: (item: T, render: AccordionGalleryRenderProps) => ReactNode;
}

function AccordionGalleryPanel<T>({
  item,
  index,
  count,
  isActive,
  isFlipped,
  grow,
  tiltDirection,
  onActivate,
  onHoverStart,
  onHoverEnd,
  onFocusStart,
  onFocusEnd,
  onKeyDown,
  priority,
  getLabel,
  renderFront,
  renderBack,
}: AccordionGalleryPanelProps<T>) {
  // Even with a large PERSPECTIVE, the rotating face's near edge is briefly
  // magnified past the card's resting height mid-flip (perspective
  // foreshortening) — clipping that against the flat box below would cut
  // off the top/bottom of the animation. Only clip to rounded corners at
  // rest; let the brief bulge show during the flip itself.
  const [isFlipAnimating, setIsFlipAnimating] = useState(false);
  const renderProps: AccordionGalleryRenderProps = { priority };

  return (
    <div
      role="listitem"
      aria-current={isActive ? "true" : undefined}
      aria-label={getLabel(item)}
      aria-posinset={index + 1}
      aria-setsize={count}
      tabIndex={0}
      onClick={onActivate}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onFocusStart}
      onBlur={onFocusEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        } else {
          onKeyDown(e);
        }
      }}
      style={{ flexGrow: grow }}
      className={cn(
        "group relative flex min-h-11 min-w-11 flex-1 cursor-pointer rounded-xl bg-transparent outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none sm:min-h-0 sm:min-w-11",
        isFlipAnimating ? "overflow-visible" : "overflow-hidden"
      )}
    >
      {/* Tilt + 3D perspective live on this inner wrapper, not the clipping
          div above — a rounded-corner overflow-hidden container that is
          itself 3D-transformed can fail to clip its 3D-transformed children
          correctly (visible as the flip's back face leaking past the
          rounded corners mid-rotation), so the clip boundary must stay flat. */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transform: `rotateY(${tiltDirection * TILT_DEG}deg)`,
          perspective: PERSPECTIVE,
        }}
      >
        <motion.div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-xl bg-zinc-950"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={isFlipped ? "back" : "front"}
          variants={cardVariants}
          onAnimationStart={() => setIsFlipAnimating(true)}
          onAnimationComplete={() => setIsFlipAnimating(false)}
        >
          {renderFront(item, renderProps)}
        </motion.div>

        <motion.div
          className={cn(
            "backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-card",
            !isFlipped && "pointer-events-none"
          )}
          initial={{ rotateY: 180 }}
          animate={isFlipped ? "front" : "back"}
          variants={cardVariants}
          style={{ transformStyle: "preserve-3d", rotateY: 180 }}
        >
          {renderBack(item, renderProps)}
        </motion.div>
      </div>
    </div>
  );
}

interface AccordionGalleryProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderFront: (item: T, render: AccordionGalleryRenderProps) => ReactNode;
  renderBack: (item: T, render: AccordionGalleryRenderProps) => ReactNode;
  ariaLabel: string;
  className?: string;
}

export function AccordionGallery<T>({
  items,
  getKey,
  getLabel,
  renderFront,
  renderBack,
  ariaLabel,
  className,
}: AccordionGalleryProps<T>) {
  const count = items.length;
  // `active` only tracks the last-selected card for aria-current — it no
  // longer drives expansion. With nothing hovered or focused, every panel
  // sits at its small, collapsed size; only a hovered or keyboard-focused
  // card expands (and flips to its back), so `expanded` doubles as the
  // flipped index too.
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const supportsHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const grow = growFor(isDesktop ? EXPAND_RATIO_DESKTOP : EXPAND_RATIO_MOBILE, count);
  const expanded = hovered ?? focused;

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);
  useEffect(() => clearHoverTimeout, [clearHoverTimeout]);

  const handleActivate = useCallback((i: number) => {
    setActive(i);
  }, []);

  const handleHoverStart = useCallback(
    (i: number) => {
      clearHoverTimeout();
      hoverTimeoutRef.current = setTimeout(() => {
        setHovered(i);
      }, HOVER_INTENT_DELAY);
    },
    [clearHoverTimeout]
  );

  const handleHoverEnd = useCallback(
    (i: number) => {
      clearHoverTimeout();
      setHovered((h) => (h === i ? null : h));
    },
    [clearHoverTimeout]
  );

  const handleFocusStart = useCallback((i: number) => {
    setFocused(i);
  }, []);

  const handleFocusEnd = useCallback((i: number) => {
    setFocused((f) => (f === i ? null : f));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % count);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + count) % count);
      }
    },
    [count]
  );

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      style={{ perspective: PERSPECTIVE }}
      className={cn("flex h-[480px] flex-col gap-2 sm:h-[440px] sm:flex-row sm:gap-3", className)}
    >
      {items.map((item, i) => (
        <AccordionGalleryPanel
          key={getKey(item)}
          item={item}
          index={i}
          count={count}
          isActive={i === active}
          isFlipped={i === expanded}
          grow={i === expanded ? grow : 1}
          tiltDirection={expanded === null ? 0 : i === expanded ? 0 : i < expanded ? 1 : -1}
          onActivate={() => handleActivate(i)}
          onHoverStart={supportsHover ? () => handleHoverStart(i) : undefined}
          onHoverEnd={supportsHover ? () => handleHoverEnd(i) : undefined}
          onFocusStart={() => handleFocusStart(i)}
          onFocusEnd={() => handleFocusEnd(i)}
          onKeyDown={handleKeyDown}
          priority={i === 0}
          getLabel={getLabel}
          renderFront={renderFront}
          renderBack={renderBack}
        />
      ))}
    </div>
  );
}
