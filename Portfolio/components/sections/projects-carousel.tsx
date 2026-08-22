"use client";

import Image from "next/image";
import { CodeIcon, GithubLogoIcon, ArrowSquareOutIcon, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { TextAnimate } from "@/components/ui/text-animate";
import { type Badge, TechBadge } from "@/components/ui/tech-badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AccordionGallery } from "@/components/ui/accordion-gallery";

const REACT: Badge = { label: "React", color: "20232A", logo: "react", logoColor: "61DAFB" };
const TYPESCRIPT: Badge = { label: "TypeScript", color: "3178C6", logo: "typescript" };
const CSHARP: Badge = { label: "C#", color: "239120" };
const ASPNET: Badge = { label: "ASP.NET", color: "512BD4", logo: "dotnet" };
const BLAZOR: Badge = { label: "Blazor", color: "5C2D91", logo: "blazor" };
const POSTGRESQL: Badge = { label: "PostgreSQL", color: "4169E1", logo: "postgresql" };
const MONGODB: Badge = { label: "MongoDB", color: "47A248", logo: "mongodb" };
const EXPRESS: Badge = { label: "Express", color: "000000", logo: "express" };
const VUE: Badge = { label: "Vue.js", color: "4FC08D", logo: "vuedotjs" };
const JAVA: Badge = { label: "Java", color: "ED8B00", logo: "openjdk" };
const SPRING_BOOT: Badge = { label: "Spring Boot", color: "6DB33F", logo: "springboot" };
const MYSQL: Badge = { label: "MySQL", color: "4479A1", logo: "mysql" };
const NEXTJS: Badge = { label: "Next.js", color: "000000", logo: "nextdotjs" };

const projects = [
  {
    name: "ASideNote",
    description:
      "A comprehensive note-taking and organization application designed for power users.",
    image: "/projects/asidenote.png",
    logo: "/ASideNoteLogo.webp",
    githubUrl: "https://github.com/Cademic/ASideNote",
    liveUrl: "https://asidenote.net",
    techStack: [REACT, TYPESCRIPT, ASPNET, POSTGRESQL],
    highlights: [
      "Built a full-stack note-taking app with an interactive corkboard for dragging, resizing, and organizing notes.",
      "Implemented secure user accounts with JWT authentication, Google sign-in, and email verification.",
      "Connected the React frontend to an ASP.NET Core API and PostgreSQL database to manage users, notes, and boards.",
      "Deployed the application with Docker, GitHub Actions, and Render, with automated testing and security checks.",
    ],
  },
  {
    name: "LunaraCare",
    description: "Healthcare portal focused on postpartum mental health and wellness.",
    image: "/projects/lunaracare.png",
    logo: "/lunara_Logo.png",
    githubUrl: "https://github.com/omniV1/lunaraCare",
    liveUrl: "https://www.lunaracare.org",
    techStack: [REACT, TYPESCRIPT, EXPRESS, MONGODB],
    highlights: [
      "Built a full-stack support platform using React for the frontend and Node.js/Express for the backend.",
      "Added secure login using JWT and Google sign-in with Passport.js.",
      "Set up Docker to make it easier to run the app, database, and testing tools.",
      "Worked with the team using Agile sprints and GitHub Projects to track tasks and keep the project on schedule.",
    ],
  },
  {
    name: "CineScope",
    description: "Movie discovery platform with advanced filtering and recommendation algorithms.",
    image: "/projects/cinescope.png",
    logo: "/cinescope_logo.png",
    githubUrl: "https://github.com/omniV1/CineScope",
    liveUrl: undefined,
    techStack: [CSHARP, BLAZOR, ASPNET, MONGODB],
    highlights: [
      "Built a movie review website using Blazor WebAssembly and an ASP.NET Core backend.",
      "Added the ability for users to create accounts, log in, and create, edit, and delete reviews.",
      "Used MongoDB to store user accounts and movie review data.",
      "Created project documentation including system diagrams, wireframes, and user guides.",
    ],
  },
  {
    name: "Blodged",
    description: "Community-driven platform for developer discussions and resource sharing.",
    image: "/projects/blodged.png",
    logo: "/Blodged_Logo.png",
    githubUrl: "https://github.com/Cademic/blodged",
    liveUrl: undefined,
    techStack: [VUE, TYPESCRIPT, JAVA, SPRING_BOOT],
    highlights: [
      "Built a platform where developers can post questions, share resources, and reply to each other.",
      "Used Vue.js and TypeScript for the frontend and Java with Spring Boot for the backend.",
      "Set up user accounts so people can post, comment, and save resources to their profile.",
      "Organized posts and resources into categories so people can find what they need faster.",
    ],
  },
  {
    name: "MineSweeper",
    description: "Modern recreation of the classic puzzle game with user accounts and leaderboards.",
    image: "/projects/minesweeper.png",
    logo: "/MineSweep_logo.png",
    githubUrl: "https://github.com/NoahStarkenburg/MineSweeper",
    liveUrl: undefined,
    techStack: [CSHARP, ASPNET, MYSQL],
    highlights: [
      "Rebuilt the classic Minesweeper game with a cleaner look and smoother gameplay.",
      "Built the backend with C# and ASP.NET, connected to a MySQL database.",
      "Added user accounts so players can log in and save their progress.",
      "Built a leaderboard so players can see how their times compare to others.",
    ],
  },
  {
    name: "PulsePlayer",
    description:
      "Full-stack music discovery and playlist app with authenticated library management and an admin dashboard.",
    image: "/projects/pulseplayer.png",
    logo: "/pulse-player-logo.png",
    githubUrl: "https://github.com/Cademic/PulsePlayer",
    liveUrl: "https://cst391-music-app-psi.vercel.app",
    techStack: [NEXTJS, TYPESCRIPT, POSTGRESQL],
    highlights: [
      "Built a music app where users can browse songs and build their own playlists.",
      "Used Next.js and TypeScript for the frontend and a PostgreSQL database to store users, songs, and playlists.",
      "Added user accounts so people can log in and manage their own library.",
      "Built an admin dashboard for managing songs and keeping the app's content up to date.",
    ],
  },
];

type Project = (typeof projects)[number];

function ProjectFront({ project }: { project: Project }) {
  const slug = project.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(max-width: 639px) 100vw, 320px"
        className="scale-110 object-cover blur-md"
      />
      <div className="absolute inset-0 bg-black/70 transition-colors duration-300 ease-out group-hover:bg-black/55" />
      <div className="relative flex h-full w-full flex-row items-center justify-center gap-2 px-3 text-center sm:flex-col sm:gap-3">
        {project.logo ? (
          <span className="relative h-8 w-16 shrink-0 sm:h-14 sm:w-32">
            <Image
              src={project.logo}
              alt={`${project.name} logo`}
              fill
              sizes="128px"
              className="object-contain"
            />
          </span>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-14 sm:w-14">
            <CodeIcon size={16} weight="bold" className="sm:hidden" />
            <CodeIcon size={26} weight="bold" className="hidden sm:block" />
          </span>
        )}
        <div className="flex flex-col gap-1">
          <p className="max-w-full truncate font-mono text-sm font-bold text-white">
            {project.name}
          </p>
          <p className="hidden max-w-full truncate font-mono text-xs text-white/50 sm:block">
            ~/{slug}
          </p>
        </div>
      </div>
    </>
  );
}

function ProjectBack({ project, priority }: { project: Project; priority: boolean }) {
  const slug = project.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-panel-strong/60 bg-panel px-3 py-0.5 sm:px-4 sm:py-1.5">
        <span className="h-2 w-2 rounded-full bg-red-500 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-yellow-500 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-green-500 sm:h-2.5 sm:w-2.5" />
        <span className="ml-1.5 truncate font-mono text-[10px] text-ink-muted sm:text-sm">
          ~/projects/{slug}
        </span>
      </div>

      <div className="relative h-6 w-full shrink-0 overflow-hidden bg-panel-strong sm:h-20">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 639px) 100vw, 60vw"
          draggable={false}
          priority={priority}
          className="object-cover select-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      </div>

      {/* A flex column so the tech-stack/links group can be pinned to
          the bottom with mt-auto regardless of how much text is above
          it. The text itself lives in a nested block-flow div, not as a
          direct flex-column child — a line-clamp element as a direct
          flex item in a shrinking column collapses to 0 height instead
          of the container scrolling, so it stays one level removed.
          overflow-y-auto (with the scrollbar visually hidden below) is
          a fallback for content that doesn't quite fit rather than the
          intended read path — the card's sizing is tuned so it isn't
          needed in the common case. */}
      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto p-1 sm:p-3">
        <div className="space-y-0 sm:space-y-1.5">
          <h3 className="font-mono text-xs font-bold text-ink sm:text-lg">
            {project.name}
          </h3>
          {/* The bullets below restate the description in more detail,
              so skip the redundant summary when they're present. */}
          {project.highlights.length === 0 && (
            <p className="line-clamp-3 text-[10px] leading-none text-ink-muted sm:text-base sm:leading-snug">
              {project.description}
            </p>
          )}
          {project.highlights.length > 0 && (
            <ul className="space-y-0 text-[10px] leading-none text-ink-muted sm:space-y-1.5 sm:text-base sm:leading-snug">
              {project.highlights.map((point) => (
                <li key={point} className="flex items-start gap-1 sm:gap-2">
                  <CheckCircle
                    size={11}
                    className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400 sm:hidden"
                  />
                  <CheckCircle
                    size={18}
                    className="mt-0.5 hidden shrink-0 text-sky-600 dark:text-sky-400 sm:block"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-auto space-y-1 pt-1 sm:space-y-2 sm:pt-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {project.techStack.map((badge) => (
              <TechBadge key={badge.label} badge={badge} size={16} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} source code on GitHub`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-panel-strong text-ink transition-[color,background-color,transform,border-color] duration-300 ease-out hover:scale-110 hover:border-ink hover:bg-ink hover:text-card sm:h-10 sm:w-10"
                  >
                    <GithubLogoIcon size={14} className="sm:hidden" />
                    <GithubLogoIcon size={18} className="hidden sm:block" />
                  </a>
                }
              />
              <TooltipContent>Github</TooltipContent>
            </Tooltip>
            {project.liveUrl && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} live site`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-panel-strong text-ink transition-[color,background-color,transform,border-color] duration-300 ease-out hover:scale-110 hover:border-accent hover:bg-accent hover:text-ink-on-accent sm:h-10 sm:w-10"
                    >
                      <ArrowSquareOutIcon size={14} className="sm:hidden" />
                      <ArrowSquareOutIcon size={18} className="hidden sm:block" />
                    </a>
                  }
                />
                <TooltipContent>Live Site</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function ProjectsCarousel() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 mb-10 sm:mb-12 text-center">
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
          as="p"
          by="word"
          animation="fadeIn"
          once
          delay={0.2}
          className="font-mono text-code-md text-sky-600 dark:text-sky-400 uppercase tracking-widest"
        >
          {"// RECENT_PROJECTS"}
        </TextAnimate>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 mb-16 sm:mb-20">
        <AccordionGallery
          ariaLabel="Featured projects"
          items={projects}
          getKey={(project) => project.name}
          getLabel={(project) => project.name}
          renderFront={(project) => <ProjectFront project={project} />}
          renderBack={(project, { priority }) => <ProjectBack project={project} priority={priority} />}
        />
      </div>
    </>
  );
}
