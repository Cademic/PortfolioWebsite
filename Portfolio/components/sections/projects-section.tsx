"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { SecurityExperience } from "@/components/sections/security-experience";
import { cn } from "@/lib/utils";

type ProjectsTab = "software" | "security";

const TABS: { id: ProjectsTab; label: string; tagline: string }[] = [
  { id: "software", label: "Development", tagline: "// DEVELOPMENT_PROJECTS" },
  { id: "security", label: "Cybersecurity", tagline: "// CYBERSECURITY_PROJECTS" },
];

// Swipe the outgoing carousel fully off-screen while the incoming one slides
// in from the opposite side, in the direction implied by the tab order —
// `custom` (the switch's direction) is threaded through so exit and enter
// animate the same way. `popLayout` pops the exiting card out of flow so it
// floats away independently instead of collapsing the layout while the
// incoming (differently-sized) carousel already occupies normal flow.
const slideVariants = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: `${-direction * 100}%` }),
};

export function ProjectsSection() {
  const [tab, setTab] = useState<ProjectsTab>("software");
  const [direction, setDirection] = useState(0);
  const active = TABS.find((t) => t.id === tab)!;

  const selectTab = (next: ProjectsTab) => {
    if (next === tab) return;
    const nextIndex = TABS.findIndex((t) => t.id === next);
    const currentIndex = TABS.findIndex((t) => t.id === tab);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setTab(next);
  };

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 mb-6 sm:mb-8 text-center">
        <TextAnimate
          as="h2"
          by="character"
          animation="slideLeft"
          once
          className="text-headline-lg-mobile font-bold text-ink mb-2"
        >
          Check Out My Work
        </TextAnimate>
        <TextAnimate
          key={tab}
          as="p"
          by="text"
          animation="fadeIn"
          once
          className="font-mono text-code-md text-sky-600 dark:text-sky-400 uppercase tracking-widest"
        >
          {active.tagline}
        </TextAnimate>
      </div>

      <div
        role="tablist"
        aria-label="Project category"
        className="mx-auto mb-10 sm:mb-12 flex w-fit gap-1 rounded border border-panel-strong bg-card p-1 shadow-lg"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => selectTab(t.id)}
            className={cn(
              "relative rounded bg-card px-5 py-2 font-mono text-label-sm uppercase tracking-widest outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-accent",
              tab === t.id ? "text-ink-on-accent" : "text-ink-muted hover:text-ink"
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId="projects-tab-highlight"
                className="absolute inset-0 rounded bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Clips the horizontal tab-swipe motion. Must be `overflow-hidden`
          (both axes), not `overflow-x-hidden` alone: per the CSS overflow
          spec, pairing a non-`visible` overflow-x with the default
          `visible` overflow-y forces the y-axis to compute to `auto`,
          silently turning this into a real vertical scroll container. That
          swallowed DepthStackCarousel's invisible, absolutely-positioned
          height-measurement clones (stacked in normal flow, one per card)
          into its scrollable area, capping this section at one card's
          height and giving it its own internal scrollbar. The -m-3/p-3 pair
          widens the actual clip boundary by 12px on every side without
          shifting anything visible, so the nav arrows' hover:scale-110 (and
          similar) don't get clipped when they sit near an edge — the slide
          transition still travels a full 100% width, far more than this
          buffer, so it's still fully contained. */}
      <div className="-m-3 overflow-hidden p-3">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={tab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "software" ? <ProjectsCarousel /> : <SecurityExperience />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
