"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-card/90 backdrop-blur-sm w-full fixed top-0 z-50 border-b border-panel-strong isolate transform-gpu">
      <div className="grid grid-cols-[auto_1fr_auto] items-center w-full px-6 sm:px-8 py-6 max-w-[1200px] mx-auto">
        <a href="#" className="text-headline-lg-mobile font-bold tracking-tighter text-ink">
          <AnimatedShinyText>CARTER WRIGHT</AnimatedShinyText>
        </a>
        <div className="hidden md:flex justify-center items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-block text-ink-muted font-mono text-label-sm tracking-[0.1em] transition-[color,transform] duration-300 ease-out hover:text-sky-600 dark:hover:text-sky-400 hover:scale-110 hover:underline decoration-accent underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="col-start-3 row-start-1 hidden md:flex items-center gap-4 justify-self-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <AnimatedThemeToggler
                  fromCenter
                  className="text-ink transition-transform duration-300 ease-out hover:scale-110 hover:text-accent"
                />
              }
            />
            <TooltipContent>Toggle Theme</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex hover:scale-110 transition-transform duration-300 ease-out"
                >
                  <ShimmerButton
                    tabIndex={-1}
                    background="var(--color-ink)"
                    shimmerColor="var(--color-card)"
                    borderRadius="0.25rem"
                    className="text-card font-mono text-label-sm uppercase tracking-[0.1em] px-6 py-2"
                  >
                    Resume
                  </ShimmerButton>
                </a>
              }
            />
            <TooltipContent>View my Resume</TooltipContent>
          </Tooltip>
        </div>
        <div className="col-start-3 row-start-1 flex items-center gap-3 md:hidden justify-self-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <AnimatedThemeToggler
                  fromCenter
                  className="text-ink transition-transform duration-300 ease-out hover:scale-110 hover:text-accent"
                />
              }
            />
            <TooltipContent>Toggle Theme</TooltipContent>
          </Tooltip>
          <button
            className="text-ink transition-transform duration-300 ease-out hover:scale-110"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-panel-strong bg-card/90 backdrop-blur-sm"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="self-start inline-block text-ink font-mono text-label-sm tracking-[0.1em] transition-transform duration-300 ease-out hover:scale-110 hover:underline decoration-accent underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="self-start inline-block text-ink font-mono text-label-sm tracking-[0.1em] transition-transform duration-300 ease-out hover:scale-110 hover:underline decoration-accent underline-offset-4"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
