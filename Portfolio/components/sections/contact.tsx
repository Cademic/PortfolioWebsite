import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";
import { Meteors } from "@/components/ui/meteors";

export function Contact() {
  return (
    <section id="contact" className="bg-sky-50 dark:bg-sky-950/20 border-t border-sky-100 dark:border-sky-900/40">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative isolate h-[350px] w-full overflow-hidden">
        <Meteors number={20} className="-z-10" />
        <div className="max-w-2xl mx-auto text-center pt-16 sm:pt-16">
          <TextAnimate
            as="h2"
            by="character"
            animation="slideLeft"
            once
            className="text-headline-lg-mobile sm:text-headline-lg font-bold text-ink mb-6"
          >
            Let&apos;s Connect
          </TextAnimate>
          <TextAnimate
            as="p"
            by="line"
            animation="fadeIn"
            once
            delay={0.15}
            className="text-body-md text-ink-muted mb-10"
          >
            Interested in working together or just want to say hi? I&apos;m currently open to new opportunities and collaborations.
          </TextAnimate>
          <a
            href="mailto:carterwright221@gmail.com"
            className="group mt-2 inline-flex items-center gap-2 rounded-full border border-panel-strong bg-card px-6 py-3 text-sm font-medium text-ink shadow-sm outline-none transition-[transform,box-shadow,background-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-ink hover:text-card hover:shadow-lg active:translate-y-0 active:scale-95 active:duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <EnvelopeSimpleIcon
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110"
              aria-hidden="true"
            />
            carterwright221@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
