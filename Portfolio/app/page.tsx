import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/sections/hero";
import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex-1 bg-paper text-ink antialiased">
      <SiteNav />
      <main className="pt-24">
        <Hero />
        <ProjectsCarousel />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
