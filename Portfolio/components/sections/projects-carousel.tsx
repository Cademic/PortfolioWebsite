"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  CaretLeftIcon,
  CaretRightIcon,
  GithubLogoIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

const projects = [
  {
    name: "ASideNote",
    description:
      "A comprehensive note-taking and organization application designed for power users.",
    image: "/projects/asidenote.png",
    githubUrl: "https://github.com/Cademic/ASideNote",
    liveUrl: "https://asidenote.net",
  },
  {
    name: "LunaraCare",
    description: "Healthcare portal focused on postpartum mental health and wellness.",
    image: "/projects/lunaracare.png",
    githubUrl: "https://github.com/omniV1/lunaraCare",
    liveUrl: "https://www.lunaracare.org",
  },
  {
    name: "CineScope",
    description: "Movie discovery platform with advanced filtering and recommendation algorithms.",
    image: "/projects/cinescope.png",
    githubUrl: "https://github.com/omniV1/CineScope",
    liveUrl: undefined,
  },
  {
    name: "Blodged",
    description: "Community-driven platform for developer discussions and resource sharing.",
    image: "/projects/blodged.png",
    githubUrl: "https://github.com/Cademic/blodged",
    liveUrl: undefined,
  },
  {
    name: "MineSweeper",
    description: "Modern recreation of the classic puzzle game with user accounts and leaderboards.",
    image: "/projects/minesweeper.png",
    githubUrl: "https://github.com/NoahStarkenburg/MineSweeper",
    liveUrl: undefined,
  },
  {
    name: "PulsePlayer",
    description:
      "Full-stack music discovery and playlist app with authenticated library management and an admin dashboard.",
    image: "/projects/pulseplayer.png",
    githubUrl: "https://github.com/Cademic/PulsePlayer",
    liveUrl: "https://cst391-music-app-psi.vercel.app",
  },
];

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const slug = project.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <div
      data-card
      className="group relative flex w-[62vw] max-w-[260px] shrink-0 flex-col overflow-hidden rounded-xl  bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent/40 hover:shadow-xl hover:shadow-black/10 hover:z-10 sm:w-[400px] sm:max-w-none"
    >
      <div className="flex items-center gap-2 border-b border-panel-strong/60 bg-panel px-3 py-2 sm:px-4 sm:py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-1.5 truncate font-mono text-xs text-ink-muted">
          ~/projects/{slug}
        </span>
      </div>
      <div className="relative h-32 w-full overflow-hidden bg-panel-strong sm:h-56">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 639px) 62vw, 400px"
          draggable={false}
          className="object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <h3 className="flex items-baseline gap-2 text-lg sm:text-headline-lg-mobile font-bold text-ink mb-2 sm:mb-3 font-mono">
          {project.name}
        </h3>
        <p className="text-sm sm:text-body-md text-ink-muted mb-3 sm:mb-5 flex-1">{project.description}</p>
        <div className="flex items-center gap-3 border-t border-panel-strong/60 pt-3 sm:pt-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} source code on GitHub`}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-panel-strong text-ink transition-[color,background-color,transform,border-color] duration-300 ease-out hover:border-ink hover:bg-ink hover:text-card hover:scale-110"
          >
            <GithubLogoIcon size={18} />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name} live site`}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-panel-strong text-ink transition-[color,background-color,transform,border-color] duration-300 ease-out hover:border-accent hover:bg-accent hover:text-ink-on-accent hover:scale-110"
            >
              <ArrowSquareOutIcon size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const AUTOPLAY_PX_PER_SEC = 55;
const SET_COUNT = 3;

const ARROW_PROXIMITY_PX = 160;

export function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    offset: 0,
    setWidth: 0,
    paused: false,
    dragging: false,
    moved: false,
    pointerId: null as number | null,
    dragStartX: 0,
    dragStartOffset: 0,
    tweening: false,
    tweenFrom: 0,
    tweenTo: 0,
    tweenStartTime: 0,
    tweenDuration: 0,
    lastFrameTime: 0,
  });

  const items = [...projects, ...projects, ...projects];

  function applyTransform() {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${state.current.offset}px,0,0)`;
  }

  function wrapOffset() {
    const s = state.current;
    if (s.setWidth <= 0) return;
    while (s.offset <= -2 * s.setWidth) s.offset += s.setWidth;
    while (s.offset > 0) s.offset -= s.setWidth;
  }

  function measure() {
    const track = trackRef.current;
    if (!track) return;
    const width = track.scrollWidth / SET_COUNT;
    if (width <= 0) return;
    const s = state.current;
    const hadWidth = s.setWidth > 0;
    s.setWidth = width;
    if (!hadWidth) {
      s.offset = -width;
      applyTransform();
    } else {
      wrapOffset();
      applyTransform();
    }
  }

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (trackRef.current) ro.observe(trackRef.current);

    let rafId: number;
    function frame(now: number) {
      const s = state.current;
      if (s.lastFrameTime === 0) s.lastFrameTime = now;
      const dt = now - s.lastFrameTime;
      s.lastFrameTime = now;

      if (s.dragging) {
        // offset is driven directly by pointer move
      } else if (s.tweening) {
        const elapsed = now - s.tweenStartTime;
        const t = Math.min(1, s.tweenDuration > 0 ? elapsed / s.tweenDuration : 1);
        const eased = 1 - Math.pow(1 - t, 3);
        s.offset = s.tweenFrom + (s.tweenTo - s.tweenFrom) * eased;
        if (t >= 1) s.tweening = false;
      } else if (!s.paused && s.setWidth > 0) {
        s.offset -= (AUTOPLAY_PX_PER_SEC * dt) / 1000;
      }
      wrapOffset();
      applyTransform();
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  function getStepWidth() {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const a = (track.children[0] as HTMLElement).getBoundingClientRect();
    const b = (track.children[1] as HTMLElement).getBoundingClientRect();
    return b.left - a.left;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const s = state.current;
    s.dragging = true;
    s.moved = false;
    s.tweening = false;
    s.pointerId = e.pointerId;
    s.dragStartX = e.clientX;
    s.dragStartOffset = s.offset;
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    const dx = e.clientX - s.dragStartX;
    if (!s.moved) {
      if (Math.abs(dx) <= 4) return;
      s.moved = true;
      // Only capture once an actual drag is confirmed — capturing on every
      // pointerdown retargets the eventual click to this container, which
      // stops link/button clicks inside cards from firing their default action.
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    s.offset = s.dragStartOffset + dx;
    wrapOffset();
    applyTransform();
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onMouseEnter() {
    state.current.paused = true;
  }

  function onMouseLeave() {
    state.current.paused = false;
  }

  function scrollByCard(direction: 1 | -1) {
    const step = getStepWidth();
    if (!step) return;
    const s = state.current;
    s.tweenFrom = s.offset;
    s.tweenTo = s.offset - direction * step;
    s.tweenStartTime = performance.now();
    s.tweenDuration = 450;
    s.tweening = true;
  }

  function onCarouselMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const nearLeft = x <= ARROW_PROXIMITY_PX;
    const nearRight = x >= rect.width - ARROW_PROXIMITY_PX;
    if (leftArrowRef.current) leftArrowRef.current.style.opacity = nearLeft ? "1" : "0";
    if (rightArrowRef.current) rightArrowRef.current.style.opacity = nearRight ? "1" : "0";
  }

  function onCarouselMouseLeave() {
    if (leftArrowRef.current) leftArrowRef.current.style.opacity = "0";
    if (rightArrowRef.current) rightArrowRef.current.style.opacity = "0";
  }

  return (
    <section
      id="projects"
      className="relative isolate py-24 sm:py-section-gap border-t border-panel-strong overflow-hidden"
    >
      <GridPattern
      
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 mb-16">
        <TextAnimate
          as="h2"
          by="character"
          animation="slideLeft"
          once
          className="text-headline-lg-mobile sm:text-headline-lg font-bold text-ink mb-2"
        >
          Check Out My Work
        </TextAnimate>
        <TextAnimate
          as="p"
          by="word"
          animation="fadeIn"
          once
          delay={0.2}
          className="font-mono text-code-md text-sky-600 dark:text-sky-400 uppercase tracking-widest"
        >
          // RECENT_PROJECTS
        </TextAnimate>
      </div>
      <div
        className="relative px-6 sm:px-8"
        onMouseMove={onCarouselMouseMove}
        onMouseLeave={onCarouselMouseLeave}
      >
        <div
          ref={leftArrowRef}
          className="hidden sm:flex absolute left-0 top-6 bottom-14 z-20 w-8 sm:w-10 items-center justify-center opacity-0 transition-opacity duration-300"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg bg-ink/20"
          />
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => scrollByCard(-1)}
            className="relative flex items-center justify-center text-card drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] hover:text-accent hover:scale-110 transition-[color,transform]"
          >
            <CaretLeftIcon size={28} weight="bold" />
          </button>
        </div>

        <div
          ref={rightArrowRef}
          className="hidden sm:flex absolute right-0 top-6 bottom-14 z-20 w-8 sm:w-10 items-center justify-center opacity-0 transition-opacity duration-300"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg bg-ink/20"
          />
          <button
            type="button"
            aria-label="Next project"
            onClick={() => scrollByCard(1)}
            className="relative flex items-center justify-center text-card drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] hover:text-accent hover:scale-110 transition-[color,transform]"
          >
            <CaretRightIcon size={28} weight="bold" />
          </button>
        </div>

        <div
          className="overflow-hidden pt-6 pb-14"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex gap-6 sm:gap-12 will-change-transform cursor-grab active:cursor-grabbing select-none"
          >
            {items.map((project, i) => (
              <ProjectCard key={`${project.name}-${i}`} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
