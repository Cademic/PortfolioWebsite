import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/sections/hero";
import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { SecurityExperience } from "@/components/sections/security-experience";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex-1 bg-paper text-ink antialiased">
      <SiteNav />
      <main className="pt-24">
        <Hero />
        <section
          id="projects"
          className="relative isolate py-24 border-t border-panel-strong overflow-hidden"
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
          <ProjectsCarousel />
          <SecurityExperience />
        </section>
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
