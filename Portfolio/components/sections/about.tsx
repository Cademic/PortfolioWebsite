import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";

const hobbies = [
  "Exercising and Working Out",
  "Golfing and Soccer",
  "Car Enthusiast and Sim Racing",
  "Lego collecting and Gaming",
];

export function About() {
  return (
    <section id="about" className="relative py-24 bg-sky-50 dark:bg-sky-950/20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <TextAnimate
              as="h2"
              by="character"
              animation="slideLeft"
              once
              className="text-headline-lg-mobile sm:text-headline-lg font-bold text-ink mb-6"
            >
              About Me
            </TextAnimate>
            <TextAnimate
              as="p"
              by="line"
              animation="fadeIn"
              once
              delay={0.1}
              className="text-body-md text-ink-muted mb-4"
            >
              Hello! My name is Carter Wright. I am a software developer and graduate of Grand Canyon University, where I earned my Bachelor&apos;s in Software Development.
            </TextAnimate>
            <TextAnimate
              as="p"
              by="line"
              animation="fadeIn"
              once
              delay={0.2}
              className="text-body-md text-ink-muted mb-4"
            >
              I am currently residing in Michigan and seeking full-time software development opportunities. Alongside my job search, I am growing my client base and completing commission-based web design projects for individuals and businesses.
            </TextAnimate>
          </div>
          <div className="bg-panel rounded-lg p-8 border border-sky-100 dark:border-sky-900/40 shadow-sm">
            <TextAnimate
              as="h3"
              by="word"
              animation="slideUp"
              once
              className="text-headline-lg-mobile text-ink mb-4 font-bold"
            >
              My Hobbies
            </TextAnimate>
            <ul className="space-y-4 text-ink-muted text-body-md">
              {hobbies.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
