/**
 * Project case-study data.
 * Extracted from App.vue so page markup and content data can evolve independently.
 */

export interface ProjectDetails {
  slug: string
  title: string
  tagline: string
  /** One tight first-person paragraph — what it is and why it exists. */
  summary: string
  imageSrc: string
  imageAlt: string
  galleryImages: Array<{ src: string; alt: string }>
  githubUrl: string
  liveUrl?: string
  /** Small set of genuinely scannable facts — kept short on purpose. */
  keyFacts: Array<{ label: string; value: string }>
  techStack: string[]
  /** Flexible case-study narrative — section count varies by project. */
  story: Array<{ heading?: string; body: string }>
  /** One standout sentence, set large in the layout. */
  pullQuote?: string
}

export const projects: ProjectDetails[] = [
  {
    slug: 'asidenote',
    title: 'ASideNote',
    tagline: 'Visual thinking meets structured writing.',
    summary:
      "ASideNote is a note-taking canvas I built because I kept bouncing between apps that were good at one thing and bad at the other — flexible like a whiteboard, or structured like a document, never both. It lets you drop notes anywhere on an infinite board, edit them with a full rich-text toolset, and cluster them however you're actually thinking, not by folder hierarchy.",
    imageSrc: '/ASideNote_Noteboard.png',
    imageAlt: 'ASideNote cork board with notes',
    galleryImages: [
      { src: '/ASideNote_Noteboard.png', alt: 'ASideNote cork board with notes' },
      { src: '/ASideNote_Dashboard.png', alt: 'ASideNote dashboard view' },
      { src: '/ASideNote_Projects.png', alt: 'ASideNote projects board view' },
    ],
    githubUrl: 'https://github.com/Cademic/ASideNote',
    liveUrl: 'https://asidenote.net',
    keyFacts: [
      { label: 'Stack', value: 'ASP.NET Core 8 + React 18' },
      { label: 'Editor', value: 'TipTap / ProseMirror' },
      { label: 'Status', value: 'Live at asidenote.net' },
    ],
    techStack: ['ASP.NET Core 8', 'React 18', 'TypeScript', 'PostgreSQL', 'Render', 'GitHub Actions'],
    story: [
      {
        heading: 'Why a canvas',
        body:
          "Most note apps make you decide up front how ideas get organized. I wanted the opposite — write first, structure later. Notes live on a canvas where you drag them into clusters as connections become obvious, instead of committing to a folder before you know what you're building.",
      },
      {
        heading: 'Built on TipTap',
        body:
          'The editor runs on TipTap/ProseMirror rather than a plain textarea, so each note supports real formatting, tables, and checklists without turning into its own fragile parser. I paired that with a coordinate-based data model — every note stores its position alongside its content, so the board and the writing stay in sync.',
      },
      {
        heading: 'What was hard',
        body:
          "Getting drag interactions to coexist with an active rich-text editor took the most iteration — a note being edited and a note being dragged need to handle pointer events completely differently, and people switch between the two constantly. I also built the auth layer myself: JWT refresh rotation, Argon2id password hashing, OAuth, all wired through guarded routes.",
      },
    ],
    pullQuote:
      "I'd rather ship a canvas that adapts to how someone actually thinks than a template that makes them think in folders.",
  },
  {
    slug: 'cinescope',
    title: 'CineScope',
    tagline: 'A movie discovery platform built for exploration.',
    summary:
      'CineScope is a movie discovery app I built with a small team, where I worked as both scrum master and a full-stack contributor. Most movie apps are either static catalogs or thin review tools, so we built something in between: real search and filtering, detailed movie pages, and a review system with moderation built in from the start.',
    imageSrc: '/CineScope_Landing.png',
    imageAlt: 'CineScope landing page',
    galleryImages: [
      { src: '/CineScope_Landing.png', alt: 'CineScope landing page' },
      { src: '/CineScope_Details.png', alt: 'CineScope movie details page' },
      { src: '/CineScope_Filter.png', alt: 'CineScope filtering interface' },
      { src: '/CineScope_review.png', alt: 'CineScope review workflow' },
    ],
    githubUrl: 'https://github.com/omniV1/CineScope',
    keyFacts: [
      { label: 'Role', value: 'Scrum master + full-stack' },
      { label: 'Stack', value: 'Blazor WebAssembly + ASP.NET Core' },
      { label: 'Data', value: 'MongoDB' },
    ],
    techStack: ['ASP.NET Core', 'Blazor WebAssembly', 'MongoDB', 'C#', 'HTML/CSS'],
    story: [
      {
        heading: 'A team project, not a solo one',
        body:
          "I ran this as scrum master while also writing code — planning sprints, tracking Jira-linked user stories, and keeping the team's delivery cadence honest, alongside building the search, discovery, and review features myself.",
      },
      {
        heading: 'Why Blazor',
        body:
          'We split the solution into Client, Server, and Shared .NET projects so the whole team could work in C# end to end, sharing models between the Blazor WebAssembly frontend and the ASP.NET Core backend instead of maintaining two parallel type systems.',
      },
      {
        heading: 'The moderation problem',
        body:
          'Letting users leave reviews meant we also had to think about who could moderate them. I built role-aware endpoints so admin actions stayed scoped to authorized users, without bolting on a second application to manage the first.',
      },
    ],
    pullQuote: 'Running this as scrum master taught me as much about sequencing work as building it did about Blazor.',
  },
  {
    slug: 'blodged',
    title: 'Blodged',
    tagline: 'A production-style social platform for developers.',
    summary:
      "Blodged is a Vue + Spring Boot blogging platform I built specifically to go past CRUD. Most student projects stop at basic create/read/update/delete — I wanted one that actually modeled auth, layered architecture, and a relational social graph the way a production app would.",
    imageSrc: '/Blodged_Home.png',
    imageAlt: 'Blodged home feed',
    galleryImages: [{ src: '/Blodged_Home.png', alt: 'Blodged home feed' }],
    githubUrl: 'https://github.com/Cademic/blodged',
    keyFacts: [
      { label: 'Frontend', value: 'Vue 3 + TypeScript' },
      { label: 'Backend', value: 'Spring Boot 3, layered' },
      { label: 'Data', value: 'PostgreSQL' },
    ],
    techStack: ['Vue 3', 'TypeScript', 'Spring Boot 3', 'PostgreSQL', 'Docker Compose'],
    story: [
      {
        heading: 'Layering on purpose',
        body:
          "The backend follows a strict Controller → Service → Data separation, which is more scaffolding than most Spring tutorials bother with — but it's what let me change the persistence layer without touching the API contract, and vice versa.",
      },
      {
        heading: 'A real social graph',
        body:
          "Posts, replies, likes, and follows are modeled relationally in PostgreSQL rather than flattened into a document store, which meant thinking carefully about how entities reference each other so serialization doesn't recurse into itself.",
      },
      {
        heading: 'Making it runnable',
        body:
          'Everything spins up through Docker Compose, and the API is documented through OpenAPI/Swagger with seeded data — so anyone, including me six months from now, can clone it and see a working feed in under a minute.',
      },
    ],
    pullQuote:
      'I built the unglamorous parts — auth, layering, seeded data — on purpose, because those are what separate a demo from something you could deploy.',
  },
  {
    slug: 'minesweeper',
    title: 'MineSweeper',
    tagline: 'Classic puzzle gameplay powered by algorithmic logic.',
    summary:
      "This is a from-scratch Minesweeper built in ASP.NET Core MVC — grid generation, mine placement, recursive reveal, the works. It's a small game, but getting it actually correct, not just playable, turned out to be a solid exercise in recursion and edge-case handling.",
    imageSrc: '/MineSweep-Landing.png',
    imageAlt: 'MineSweeper game landing',
    galleryImages: [
      { src: '/MineSweep-Landing.png', alt: 'MineSweeper game landing' },
      { src: '/MineSweep_Start.png', alt: 'MineSweeper start screen' },
      { src: '/MineSweep_Game.png', alt: 'MineSweeper game board in progress' },
      { src: '/MineSweep_login.png', alt: 'MineSweeper login screen' },
      { src: '/MineSweep_succesfulLogin.png', alt: 'MineSweeper successful login state' },
      { src: '/MineSweep_SavedGames.png', alt: 'MineSweeper saved games list' },
    ],
    githubUrl: 'https://github.com/NoahStarkenburg/MineSweeper',
    keyFacts: [
      { label: 'Stack', value: 'ASP.NET Core MVC + Razor' },
      { label: 'Core logic', value: 'Recursive flood-fill reveal' },
      { label: 'Data', value: 'SQL for saved games' },
    ],
    techStack: ['ASP.NET Core MVC', 'C#', 'Razor', 'SQL'],
    story: [
      {
        heading: 'The part that looks easy',
        body:
          "Revealing an empty cell has to cascade outward to every connected empty cell, stopping cleanly at numbered or mined tiles. That's a straightforward flood-fill in theory — in practice it meant tracking visited state carefully so a large open region doesn't re-traverse itself.",
      },
      {
        heading: 'Getting the edges right',
        body:
          'Corner and border tiles need explicit bounds-checking on every neighbor lookup, since a naive eight-direction scan will happily reach past the edge of the grid. Most of the actual debugging time went into these boundary cases, not the happy path.',
      },
      {
        heading: 'State, not just rules',
        body:
          "Win and loss aren't just a check at the end — the board has to lock consistently once a terminal state hits, or a fast click right after a loss can mutate a grid that should already be frozen.",
      },
    ],
    pullQuote: "Minesweeper is a good reminder that 'simple game' and 'simple code' aren't the same thing.",
  },
  {
    slug: 'lunara',
    title: 'Lunara',
    tagline: 'A full-stack postpartum support platform.',
    summary:
      'LUNARA is a healthcare-oriented platform connecting postpartum families with doulas, split across two repositories — AQC for the backend and lunaracare for the frontend. I worked across both, from auth flow design to the provider- and client-facing user journeys, on a system meant to fix how fragmented postpartum support usually is.',
    imageSrc: '/LunaraCare.png',
    imageAlt: 'Lunara application home screen',
    galleryImages: [
      { src: '/LunaraCare.png', alt: 'Lunara application home screen' },
      { src: '/LunaraCare_Calendar.png', alt: 'Lunara calendar view' },
      { src: '/LunaraCare_Message.png', alt: 'Lunara messaging experience' },
      { src: '/LunaraCare_librarypng.png', alt: 'Lunara resource library screen' },
    ],
    githubUrl: 'https://github.com/omniV1/lunaraCare',
    liveUrl: 'https://www.lunaracare.org',
    keyFacts: [
      { label: 'Architecture', value: 'Two-repo: AQC backend + lunaracare frontend' },
      { label: 'Stack', value: 'React + Spring Boot + PostgreSQL' },
      { label: 'Status', value: 'Live at lunaracare.org' },
    ],
    techStack: ['React', 'Vite', 'TypeScript', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Flyway', 'Docker'],
    story: [
      {
        heading: 'Two repos, on purpose',
        body:
          'AQC owns the API, auth, and domain logic; lunaracare owns everything client-facing. Splitting them meant the backend and frontend could evolve and deploy on their own schedules — closer to how an actual product team would structure the work than a single monorepo would be.',
      },
      {
        heading: 'Why the layers matter here',
        body:
          'Because this handles real personal information for postpartum families, the backend follows a strict Controller → Service → Repository → Database chain, and schema changes go through Flyway migrations instead of manual edits. Nothing about the data layer is improvised.',
      },
      {
        heading: 'The hard part was the seams',
        body:
          'Most of the real complexity lived at the boundary between the two repos — keeping token handling and session boundaries correct across a frontend and backend that ship independently, and making sure an API change on one side never silently broke the other.',
      },
    ],
    pullQuote:
      'This is the closest thing in my portfolio to how a real engineering team is organized — two services, two cadences, one product.',
  },
]
