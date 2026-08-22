"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react"

import { cn } from "@/lib/utils"

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
  /**
   * CSS media query. When set, the circles render only once
   * `window.matchMedia(mediaQuery).matches` is true — nothing renders during
   * SSR or before that's known on the client, so a breakpoint-gated caller
   * never double-mounts another instance's circles.
   */
  mediaQuery?: string
}

function subscribeToMediaQuery(query: string | undefined, onChange: () => void) {
  if (!query) return () => {}
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getServerSnapshot() {
  return null
}

function useMediaQuery(query: string | undefined): boolean | null {
  return useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => (query ? window.matchMedia(query).matches : null),
    getServerSnapshot
  )
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  mediaQuery,
  className,
  style,
  ...props
}: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  const matchesQuery = useMediaQuery(mediaQuery)
  const shouldRender = mediaQuery == null || matchesQuery === true

  useEffect(() => {
    if (!shouldRender) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 mask-[radial-gradient(closest-side,white_45%,transparent)] select-none",
        className
      )}
      style={
        {
          ...style,
          "--ripple-play-state": isVisible ? "running" : "paused",
        } as CSSProperties
      }
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70
        const opacity = mainCircleOpacity - i * 0.03
        const animationDelay = `${i * 0.06}s`

        return (
          <div
            key={i}
            className="animate-ripple bg-foreground/25 absolute rounded-full border transform-gpu will-change-transform [animation-play-state:var(--ripple-play-state)]"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: `var(--foreground)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
})

Ripple.displayName = "Ripple"
