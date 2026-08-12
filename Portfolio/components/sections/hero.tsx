import { HeroShaderBackground } from "@/components/hero-shader-background";
import { Ripple } from "@/components/ui/ripple";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { HeroHeading } from "@/components/hero-heading";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center px-6 sm:px-8 overflow-hidden">
      <HeroShaderBackground className="absolute inset-0 w-full h-full -z-10 animate-in fade-in duration-1000 fill-mode-both" />
      <Ripple
        mainCircleSize={420}
        numCircles={10}
        className="animate-in fade-in duration-1000 fill-mode-both"
      />
      <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <HeroHeading
              text="Hi, I'm Carter Wright"
              className="text-[40px] sm:text-display-lg font-extrabold tracking-tight text-ink"
            />
          </div>
          <TypingAnimation
            words={["Full-stack software developer", "Cybersecurity analyst"]}
            className="text-headline-lg-mobile text-ink-muted mb-10 max-w-2xl font-normal animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both"
            typeSpeed={100}
            deleteSpeed={50}
            delay={500}
            pauseDelay={2000}
            loop
          />
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            <InteractiveHoverButton
              href="#projects"
              className="bg-accent text-ink-on-accent px-8 py-4 rounded font-mono text-label-sm uppercase text-center font-bold tracking-widest transition-shadow hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]"
            >
              View projects
            </InteractiveHoverButton>
            <a
              href="#contact"
              className="border border-ink px-8 py-4 rounded font-mono text-label-sm uppercase text-center tracking-widest text-ink transition-[color,background-color,transform] duration-300 ease-out hover:bg-ink hover:text-card hover:scale-110"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
