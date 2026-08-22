"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import type { Icon } from "@phosphor-icons/react/lib";
import {
  BugIcon,
  TerminalWindowIcon,
  ShieldWarningIcon,
  CheckCircle,
  ArrowSquareOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";
import { type Badge, TechBadge } from "@/components/ui/tech-badge";
import { cn } from "@/lib/utils";

const BURP_SUITE: Badge = { label: "Burp Suite", color: "FF6633", logo: "burpsuite" };
const OWASP_ZAP: Badge = { label: "OWASP ZAP", color: "000000", logo: "owasp" };
const KALI_LINUX: Badge = { label: "Kali Linux", color: "557C94", logo: "kalilinux" };
const NMAP: Badge = { label: "Nmap", color: "1B1B1B" };
const WINDOWS_EVENT_VIEWER: Badge = { label: "Windows Event Viewer", color: "737373" };
const COMMAND_LINE: Badge = { label: "Command Line", color: "4D4D4D" };
const WINDOWS_SERVER: Badge = { label: "Windows Server", color: "0078D6" };
const GREENBONE_OPENVAS: Badge = { label: "Greenbone/OpenVAS", color: "66B92E" };
const METASPLOIT: Badge = { label: "Metasploit", color: "2596CD", logo: "metasploit" };
const MSFVENOM: Badge = { label: "MSFVenom", color: "2596CD" };
const THE_HARVESTER: Badge = { label: "theHarvester", color: "1B1B1B" };

interface SecurityEngagement {
  title: string;
  icon: Icon;
  tools: Badge[];
  bullets: string[];
  disclaimer?: string;
  reportHref: string;
}

const engagements: SecurityEngagement[] = [
  {
    title: "OWASP Juice Shop Penetration Assessment",
    icon: BugIcon,
    tools: [BURP_SUITE, OWASP_ZAP, KALI_LINUX, NMAP],
    bullets: [
      "Performed a web application penetration test on OWASP Juice Shop.",
      "Found and tested vulnerabilities including SQL Injection, XSS, IDOR, broken access controls, and CAPTCHA bypasses.",
      "Used Burp Suite, OWASP ZAP, Kali Linux, and Nmap to scan the application, analyze traffic, and test security weaknesses.",
      "Created a penetration testing report with findings, risk levels, and recommended fixes.",
    ],
    reportHref: "/reports/owasp-juice-shop-report.pdf",
  },
  {
    title: "TryHackMe – Investigating Windows",
    icon: TerminalWindowIcon,
    tools: [WINDOWS_EVENT_VIEWER, COMMAND_LINE, WINDOWS_SERVER],
    bullets: [
      "Investigated a compromised Windows system by reviewing logs, processes, scheduled tasks, and files.",
      "Analyzed security events to find suspicious activity and possible signs of compromise.",
      "Used Windows administration and basic digital forensics techniques in a virtual lab.",
      "Practiced incident response by investigating simulated cyberattacks and identifying what happened.",
    ],
    reportHref: "/reports/tryhackme-investigating-windows.pdf",
  },
  {
    title: "AutoLiv Penetration Test (Academic Case Study)",
    icon: ShieldWarningIcon,
    tools: [KALI_LINUX, NMAP, GREENBONE_OPENVAS, METASPLOIT, MSFVENOM, THE_HARVESTER],
    bullets: [
      "Course project for GCU's Cybersecurity and Ethical Hacking class, using AutoLiv as a fictional case-study target.",
      "Started with OSINT recon, then pulled employee and infrastructure data with theHarvester, SpiderFoot, and dnsenum.",
      "Scanned the lab network with Nmap, found vulnerabilities with Greenbone/OpenVAS, and broke into legacy Windows and Metasploitable boxes with Metasploit.",
      "Built a custom backdoor with MSFVenom and wrote it all up in a 90-page report with fixes for each finding.",
    ],
    disclaimer:
      "All activities were conducted strictly within the academic sandbox environment. No real AutoLiv systems were targeted.",
    reportHref: "/reports/AutoLiv-Pen-Testing-Report.pdf",
  },
];

function EngagementCard({ engagement }: { engagement: SecurityEngagement }) {
  const EngagementIcon = engagement.icon;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-panel-strong bg-card shadow-lg">
      <div className="flex shrink-0 items-center gap-2 border-b border-panel-strong/60 bg-panel px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-1.5 truncate font-mono text-xs text-ink-muted">{engagement.title}</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <EngagementIcon size={24} className="mt-0.5 shrink-0 text-accent" />
          <h3 className="font-mono text-lg font-bold text-ink">{engagement.title}</h3>
        </div>
        <ul className="mt-3 space-y-2 text-body-md text-ink-muted">
          {engagement.bullets.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle size={18} className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {engagement.disclaimer && (
          <p className="mt-4 border-l-2 border-panel-strong pl-3 text-label-sm italic text-ink-muted">
            {engagement.disclaimer}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {engagement.tools.map((badge) => (
            <TechBadge key={badge.label} badge={badge} size={20} />
          ))}
        </div>
        <a
          href={engagement.reportHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-panel-strong px-5 py-2.5 font-mono text-label-sm uppercase tracking-widest text-ink transition-colors duration-300 ease-out hover:border-ink hover:bg-ink hover:text-card"
        >
          View Report
          <ArrowSquareOutIcon size={16} weight="bold" />
        </a>
      </div>
    </div>
  );
}

// Depth-stack geometry for peeking cards, modeled on reactbits' Depth
// Carousel: each neighbor sits further along the Z axis (pushed back under
// a shared `perspective`) and rotated around the vertical axis so its inner
// edge faces the viewer, rather than a flat 2D tilt. Unlike that reference
// (which only stacks toward one side), neighbors recede symmetrically on
// both sides so the previous card stays visible too.
const PEEK_OFFSET_PX = 225;
const PEEK_DEPTH_PX = 200;
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

function DepthStackCard({
  engagement,
  index: i,
  count,
  offset,
  onActivate,
  onDragEnd,
}: {
  engagement: SecurityEngagement;
  index: number;
  count: number;
  offset: number;
  onActivate: () => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
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
      className={cn("absolute inset-0", !isActive && "cursor-pointer")}
      style={{ zIndex: 10 - Math.abs(offset), x }}
      initial={false}
      animate={
        isActive
          ? { z: 0, rotateY: 0, opacity: 1, filter: "blur(0px)" }
          : {
              z: -PEEK_DEPTH_PX,
              rotateY: -sign * PEEK_TILT_DEG,
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
        <EngagementCard engagement={engagement} />
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

export function SecurityExperience() {
  const count = engagements.length;
  const [index, setIndex] = useState(0);

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
    <div id="cybersecurity" className="relative">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-8 mb-10 sm:mb-12 text-center">
        <TextAnimate
          as="h2"
          by="character"
          animation="slideLeft"
          once
          className="text-headline-lg-mobile font-bold text-ink mb-2 whitespace-nowrap tracking-tighter sm:tracking-normal"
        >
          Cybersecurity Experience
        </TextAnimate>
        <TextAnimate
          as="p"
          by="word"
          animation="fadeIn"
          once
          delay={0.2}
          className="font-mono text-code-md text-sky-600 dark:text-sky-400 uppercase tracking-widest"
        >
          {"// SECURITY_ENGAGEMENTS"}
        </TextAnimate>
      </div>

      <div className="mx-auto max-w-[680px] px-3 sm:px-8">
        <div className="relative h-[828px] sm:h-[580px]">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Cybersecurity engagements"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ perspective: PERSPECTIVE_PX }}
            className="absolute inset-x-0 top-0 h-[920px] origin-top scale-90 outline-none focus-visible:ring-2 focus-visible:ring-accent sm:relative sm:top-auto sm:h-[580px] sm:scale-100"
          >
            {engagements.map((engagement, i) => (
              <DepthStackCard
                key={engagement.title}
                engagement={engagement}
                index={i}
                count={count}
                offset={wrappedOffset(i, index, count)}
                onActivate={() => goTo(i)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous engagement"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-panel-strong text-ink outline-none transition-[color,background-color,border-color,transform] duration-300 ease-out hover:scale-110 hover:border-ink hover:bg-ink hover:text-card active:scale-90 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <CaretLeftIcon
              size={18}
              weight="bold"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
            />
          </button>

          <div className="flex items-center gap-2">
            {engagements.map((engagement, i) => (
              <button
                key={engagement.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to engagement ${i + 1}`}
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
            aria-label="Next engagement"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-panel-strong text-ink outline-none transition-[color,background-color,border-color,transform] duration-300 ease-out hover:scale-110 hover:border-ink hover:bg-ink hover:text-card active:scale-90 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <CaretRightIcon
              size={18}
              weight="bold"
              className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
