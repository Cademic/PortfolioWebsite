"use client";

import { useState } from "react";
import type { Icon } from "@phosphor-icons/react/lib";
import { CodeIcon, DatabaseIcon, CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

type Badge = { label: string; color: string; logo?: string; logoColor?: string };

function badgeUrl({ label, color, logo, logoColor = "white" }: Badge) {
  const params = new URLSearchParams({ style: "for-the-badge", logoColor });
  if (logo) params.set("logo", logo);
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?${params.toString()}`;
}

function SkillBadge({ badge }: { badge: Badge }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      className={cn(
        "relative inline-flex h-7 shrink-0 items-center",
        !loaded && "w-20 overflow-hidden"
      )}
    >
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-skeleton rounded bg-panel-strong"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={badgeUrl(badge)}
        alt={badge.label}
        height={28}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-7 w-auto rounded transition-opacity duration-300 ease-out hover:scale-110",
          loaded ? "opacity-100" : "absolute inset-0 opacity-0"
        )}
      />
    </span>
  );
}

const groups: { title: string; icon: Icon; reverse?: boolean; badges: Badge[] }[] = [
  {
    title: "Languages & Frameworks",
    icon: CodeIcon,
    badges: [
      { label: "TypeScript", color: "3178C6", logo: "typescript" },
      { label: "JavaScript", color: "F7DF1E", logo: "javascript", logoColor: "black" },
      { label: "Java", color: "ED8B00", logo: "openjdk" },
      { label: "C#", color: "239120" },
      { label: "HTML5", color: "E34F26", logo: "html5" },
      { label: "CSS3", color: "1572B6", logo: "css3" },
      { label: "React", color: "20232A", logo: "react", logoColor: "61DAFB" },
      { label: "Next.js", color: "000000", logo: "nextdotjs" },
      { label: "Vue.js", color: "4FC08D", logo: "vuedotjs" },
      { label: "Node.js", color: "339933", logo: "nodedotjs" },
      { label: "Express", color: "000000", logo: "express" },
      { label: "Spring Boot", color: "6DB33F", logo: "springboot" },
      { label: "ASP.NET", color: "512BD4", logo: "dotnet" },
      { label: "Blazor", color: "5C2D91", logo: "blazor" },
    ],
  },
  {
    title: "Databases & Tools",
    icon: DatabaseIcon,
    reverse: true,
    badges: [
      { label: "MongoDB", color: "47A248", logo: "mongodb" },
      { label: "MySQL", color: "4479A1", logo: "mysql" },
      { label: "PostgreSQL", color: "4169E1", logo: "postgresql" },
      { label: "Docker", color: "2496ED", logo: "docker" },
      { label: "Git", color: "F05032", logo: "git" },
      { label: "Postman", color: "FF6C37", logo: "postman" },
      { label: "REST APIs", color: "005571" },
      { label: "JWT / OAuth", color: "000000", logo: "jsonwebtokens" },
      { label: "Agile / Scrum", color: "0052CC" },
      { label: "CI/CD", color: "2088FF", logo: "githubactions" },
    ],
  },
];

export function Skills() {
  const [showAll, setShowAll] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);

  return (
    <section id="skills" className="py-24 bg-paper relative w-full overflow-hidden">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <TextAnimate
            as="h2"
            by="character"
            animation="slideLeft"
            once
            className="text-headline-lg-mobile font-bold text-ink mb-2"
          >
            Tech Stack
          </TextAnimate>
          <TextAnimate
            as="p"
            by="word"
            animation="fadeIn"
            once
            delay={0.2}
            className="font-mono text-code-md text-sky-600 dark:text-sky-400 uppercase tracking-widest"
          >
            // CORE_SKILLS
          </TextAnimate>
        </div>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-500 ease-out",
            showAll ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8">
              {groups.map(({ title, icon: GroupIcon, badges, reverse }) => (
                <div key={title}>
                  <h3 className="text-lg sm:text-headline-lg-mobile text-ink mb-3 flex items-center gap-2 font-bold px-6 sm:px-8 whitespace-nowrap">
                    <GroupIcon size={22} className="text-accent" /> {title}
                  </h3>
                  <div className="relative">
                    <Marquee
                      pauseOnHover
                      reverse={reverse}
                      repeat={2}
                      className="[--duration:70s] [--gap:0.75rem]"
                    >
                      {badges.map((b) => (
                        <SkillBadge key={b.label} badge={b} />
                      ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setShowAll((v) => !v);
              setHasExpanded(true);
            }}
            aria-expanded={showAll}
            className="flex items-center gap-2 rounded-full border border-panel-strong px-5 py-2.5 font-mono text-label-sm uppercase tracking-widest text-ink transition-colors duration-300 ease-out hover:border-ink hover:bg-ink hover:text-card"
          >
            {showAll ? "Hide All Skills" : "Show All Skills"}
            <CaretDownIcon
              size={16}
              weight="bold"
              className={cn("transition-transform duration-300 ease-out", showAll && "rotate-180")}
            />
          </button>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-500 ease-out",
            showAll ? "grid-rows-[1fr] mt-8" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            {hasExpanded && (
              <div className="flex flex-col gap-8 pt-2">
                {groups.map(({ title, icon: GroupIcon, badges }) => (
                  <div key={title}>
                    <h4 className="text-body-md text-ink-muted mb-3 flex items-center gap-2 font-bold uppercase tracking-wide">
                      <GroupIcon size={18} className="text-accent" /> {title}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {badges.map((b) => (
                        <SkillBadge key={b.label} badge={b} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
