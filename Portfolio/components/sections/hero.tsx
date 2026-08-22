import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { HeroHeading } from "@/components/hero-heading";

export function Hero() {
  return (
    <section className="relative flex items-center px-6 sm:px-8 py-20 sm:py-0 sm:min-h-[70vh] overflow-hidden">
      
      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <HeroHeading
              text="Hi, I'm Carter Wright"
              className="text-[38px] sm:text-display-lg font-extrabold tracking-tight text-ink"
            />
          </div>
          <TypingAnimation
            words={["Full-stack software developer", "Cybersecurity analyst"]}
            className="text-2xl sm:text-headline-lg-mobile text-ink-muted mb-10 max-w-2xl font-normal animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both"
            typeSpeed={100}
            deleteSpeed={50}
            delay={500}
            pauseDelay={2000}
            loop
          />
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            <InteractiveHoverButton
              href="#projects"
              className="bg-accent text-ink-on-accent px-8 py-4 rounded font-mono text-label-sm uppercase text-center font-bold tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              View projects
            </InteractiveHoverButton>
            <a
              href="#contact"
              className="group relative isolate overflow-hidden rounded border border-ink px-8 py-4 text-center font-mono text-label-sm uppercase tracking-widest text-ink outline-none transition-[transform,color] duration-300 ease-out hover:scale-105 active:scale-95 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <span className="transition-colors duration-300 ease-out group-hover:text-card">
                Contact
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
