<!--
  App.vue
  
  The main application component that serves as the entry point for the portfolio website.
  
  This component:
  1. Imports and orchestrates all child components
  2. Contains project data
  3. Implements the contact form functionality
  4. Defines the overall page structure and sections
  5. Contains the global styling for the application
-->

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import ProjectShowcase from './components/ProjectShowcase.vue'
import ProjectCard from './components/ProjectCard.vue'

interface ProjectDetails {
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  problem: string
  role: string
  imageSrc: string
  imageAlt: string
  galleryImages: Array<{ src: string; alt: string }>
  githubUrl: string
  liveUrl?: string
  highlights: string[]
  techStack: string[]
  architecture: string[]
  readmeResources: string[]
  qualityNotes: string[]
  keyFacts: Array<{ label: string; value: string }>
  caseStudySections?: Array<{
    title: string
    points: string[]
  }>
  keyTakeaways?: string[]
}

const projects: ProjectDetails[] = [
  {
    slug: 'asidenote',
    title: 'ASideNote',
    tagline: 'Visual thinking meets structured writing.',
    description:
      'A freeform note-taking workspace where users place, edit, and connect ideas on a flexible infinite canvas.',
    longDescription:
      'ASideNote is a modern visual note-taking system built for non-linear thinking. Instead of forcing users into rigid document trees, it provides an interactive board where notes can be placed spatially, edited with rich text, and grouped by intent. The product combines whiteboard-style freedom with document-style structure, making it useful for brainstorming, planning, and long-form organization.',
    problem:
      'Most productivity tools are either strong at writing or strong at visual layout, but rarely both. ASideNote solves that gap by combining rich text editing with drag-based spatial organization on an infinite workspace.',
    role:
      'Led product direction and full-stack implementation across interaction design, editor experience, architecture, security, and deployment.',
    imageSrc: '/ASideNote_Noteboard.png',
    imageAlt: 'ASideNote cork board with notes',
    galleryImages: [
      { src: '/ASideNote_Noteboard.png', alt: 'ASideNote cork board with notes' },
      { src: '/ASideNote_Dashboard.png', alt: 'ASideNote dashboard view' },
      { src: '/ASideNote_Projects.png', alt: 'ASideNote projects board view' },
    ],
    githubUrl: 'https://github.com/Cademic/ASideNote',
    liveUrl: 'https://asidenote.net',
    highlights: [
      'Infinite-style canvas experience with draggable sticky notes and index cards.',
      'Rich text editing powered by TipTap for structured, extensible content authoring.',
      'Visual clustering and freeform arrangement for brainstorming and planning workflows.',
      'Advanced note capabilities including tables, checklists, formatting controls, and resizing.',
      'Authentication/security foundation with JWT, OAuth, verification, and role controls.',
    ],
    techStack: ['ASP.NET Core 8', 'React 18', 'TypeScript', 'PostgreSQL', 'Render', 'GitHub Actions'],
    architecture: [
      'Frontend built with React + TypeScript (Vite) and Tailwind for modular UI delivery.',
      'Editor layer uses TipTap/ProseMirror to balance rich-text capability with extensibility.',
      'Clean backend architecture separates API, Application, Core, and Infrastructure concerns.',
      'State model tracks note content plus spatial coordinates to support visual composition.',
      'Security model includes JWT refresh rotation, Argon2id hashing, OAuth, and guarded routes.',
    ],
    readmeResources: [
      'Covers core design intent: blending visual organization with structured note editing.',
      'Implementation notes document board interactions, index-card tools, and rich-editor behavior.',
      'Architecture and deployment docs outline scaling, security policy, and operational runbooks.',
    ],
    qualityNotes: [
      'Addresses difficult UX engineering tradeoffs: drag interactions + editor focus/event handling.',
      'Built with growth in mind: persistence strategy, collaboration potential, and export roadmap.',
      'CI/CD and security practices include automated checks, dependency hygiene, and protected auth flows.',
    ],
    keyFacts: [
      { label: 'Product Focus', value: 'Infinite-canvas style note experience for visual thinkers' },
      { label: 'Core Engine', value: 'TipTap rich text + drag-based spatial interaction model' },
      { label: 'Positioning', value: 'Bridges whiteboard flexibility and document-level structure' },
    ],
    caseStudySections: [
      {
        title: 'How It Works',
        points: [
          'Users create notes directly on the canvas and place them spatially based on context.',
          'Each note opens with rich-text editing so formatting and structure stay expressive.',
          'Drag interactions let users cluster ideas without rigid folder-first hierarchy.',
          'The interaction model supports brainstorming first, then refinement into structured content.',
        ],
      },
      {
        title: 'Key Design Decisions',
        points: [
          'Infinite-canvas style layout was chosen to encourage non-linear thought patterns.',
          'Modular note units make reorganization fast without restructuring entire documents.',
          'TipTap was selected for extensible rich-text capabilities and long-term editor flexibility.',
          'Tradeoff: strict page-like formatting was intentionally deprioritized in favor of creative flow.',
        ],
      },
      {
        title: 'Technical Complexity',
        points: [
          'Balancing drag-and-drop interactions with active editor focus requires careful event handling.',
          'Canvas-scale rendering must stay responsive as note count and interaction density grows.',
          'Spatial state management combines position data with editor content and interaction states.',
          'Persistence strategy must handle local-first UX now while preparing for synced collaboration later.',
        ],
      },
      {
        title: 'Future Roadmap',
        points: [
          'Expanded save/load reliability and richer export workflows (PDF and structured outputs).',
          'Search, tagging, and navigation controls for larger knowledge boards.',
          'Real-time collaboration and shared board editing over WebSockets.',
          'Cross-device syncing and stronger mobile ergonomics for capture on the go.',
        ],
      },
    ],
    keyTakeaways: [
      'ASideNote demonstrates product thinking beyond CRUD by solving a real UX gap.',
      'The project blends advanced UI interaction design with practical full-stack architecture.',
      'It highlights readiness for larger systems involving collaboration, scale, and reliability.',
    ],
  },
  {
    slug: 'cinescope',
    title: 'CineScope',
    tagline: 'A movie discovery platform built for exploration.',
    description:
      'A web application that helps users discover films, browse details, and engage through review-driven interaction.',
    longDescription:
      'CineScope is a discovery-focused movie platform designed for both casual browsing and deeper film exploration. It combines searchable movie experiences with review and moderation workflows, giving users a centralized place to find content and engage with it. The architecture is structured as a multi-project .NET solution that separates client, server, and shared logic for maintainable full-stack delivery.',
    problem:
      'Many movie apps are either static catalogs or shallow review tools. CineScope addresses the gap by blending discoverability, user interaction, and operational moderation into a single cohesive experience.',
    role:
      'Served as scrum master and full-stack contributor, shaping delivery cadence while implementing search/discovery flows, review features, and platform architecture.',
    imageSrc: '/CineScope_Landing.png',
    imageAlt: 'CineScope landing page',
    galleryImages: [
      { src: '/CineScope_Landing.png', alt: 'CineScope landing page' },
      { src: '/CineScope_Details.png', alt: 'CineScope movie details page' },
      { src: '/CineScope_Filter.png', alt: 'CineScope filtering interface' },
      { src: '/CineScope_review.png', alt: 'CineScope review workflow' },
    ],
    githubUrl: 'https://github.com/omniV1/CineScope',
    highlights: [
      'Search and browse experiences centered on discovery, filtering, and movie exploration.',
      'Detailed movie views with contextual information and user-generated review workflows.',
      'Role-aware moderation paths for managing user content and platform quality.',
      'Responsive web delivery through a client/server/shared .NET application structure.',
    ],
    techStack: ['ASP.NET Core', 'Blazor WebAssembly', 'MongoDB', 'C#', 'HTML/CSS'],
    architecture: [
      'Multi-project .NET architecture split across Client, Server, and Shared layers.',
      'Blazor WebAssembly frontend handles interactive UI state and responsive rendering.',
      'ASP.NET Core backend coordinates API behavior, auth boundaries, and app workflows.',
      'MongoDB persistence layer supports scalable content and review data handling.',
    ],
    readmeResources: [
      'Project docs include technical design, requirements, and traceable user-story coverage.',
      'Training and support modules document both end-user and administrative workflows.',
      'Agile artifacts (including Jira-linked workflow) reinforce production-style delivery discipline.',
    ],
    qualityNotes: [
      'Architecture and requirements are documented to support maintainability and onboarding.',
      'Development process emphasizes iterative sprint delivery and role-defined ownership.',
      'System design balances feature richness with clear separation of concerns.',
    ],
    keyFacts: [
      { label: 'Core Value', value: 'Discovery-first movie experience with interaction workflows' },
      { label: 'Architecture', value: 'Blazor Client / Server / Shared full-stack solution' },
      { label: 'Portfolio Value', value: 'Shows product thinking, API design, and team delivery' },
    ],
    caseStudySections: [
      {
        title: 'How It Works',
        points: [
          'Users authenticate, then explore movie content through browse and search flows.',
          'Client pages fetch and display discovery data while supporting review interactions.',
          'Detailed movie views surface content context and user-contributed feedback.',
          'Admin-capable workflows allow moderation and operations support for platform health.',
        ],
      },
      {
        title: 'Key Design Decisions',
        points: [
          'Discovery-first UX chosen to prioritize findability over static content presentation.',
          'Blazor + ASP.NET Core selected for cohesive C# full-stack development and shared models.',
          'Client/Server/Shared separation adopted for maintainability and cleaner collaboration.',
          'Tradeoff: increased architectural complexity in return for long-term extensibility.',
        ],
      },
      {
        title: 'Challenges & Complexity',
        points: [
          'Coordinating async discovery/search interactions while maintaining responsive UI state.',
          'Balancing user engagement features with moderation and platform governance requirements.',
          'Designing API contracts that support both discovery experiences and review lifecycles.',
          'Maintaining consistent behavior across multiple project layers in a shared solution.',
        ],
      },
      {
        title: 'Future Roadmap',
        points: [
          'Enhance personalization with smarter recommendations and preference-aware browsing.',
          'Expand filtering depth (genre, rating, release window, and relevance scoring).',
          'Add richer social interactions such as expanded review signals and profile activity.',
          'Continue UI polish for accessibility and mobile-first usability improvements.',
        ],
      },
    ],
    keyTakeaways: [
      'CineScope demonstrates API-integrated product development focused on discovery UX.',
      'The project reflects full-stack architectural maturity through layered solution design.',
      'It highlights strong team-oriented delivery habits in addition to technical execution.',
    ],
  },
  {
    slug: 'blodged',
    title: 'Blodged',
    tagline: 'A production-style social platform for developers.',
    description:
      'A full-stack blogging and social interaction platform with secure auth, layered backend design, and relational data modeling.',
    longDescription:
      'Blodged was built to go beyond basic CRUD and reflect a real-world backend architecture. It combines a Vue frontend with a Spring Boot API where users can create posts, reply in threads, follow profiles, and engage through likes. The system emphasizes maintainable layering, secure authentication patterns, and practical database-backed social features.',
    problem:
      'Many student projects stop at simple CRUD and do not demonstrate production-grade backend architecture, security practices, or scalable data relationships. Blodged was designed to close that gap.',
    role:
      'Built full-stack features across the Vue SPA and Spring Boot API, with focus on API design, auth flows, and clean Controller -> Service -> Data separation.',
    imageSrc: '/Blodged_Home.png',
    imageAlt: 'Blodged home feed',
    galleryImages: [
      { src: '/Blodged_Home.png', alt: 'Blodged home feed' },
    ],
    githubUrl: 'https://github.com/Cademic/blodged',
    highlights: [
      'Secure account system with login, registration, and role-aware access boundaries.',
      'Core social features including posts, replies, likes, profiles, and follow/unfollow.',
      'REST-style API design supporting frontend integration and future external consumers.',
      'Documentation-ready development workflow with OpenAPI/Swagger and seeded local data.',
    ],
    techStack: ['Vue 3', 'TypeScript', 'Spring Boot 3', 'PostgreSQL', 'Docker Compose'],
    architecture: [
      'Frontend uses Vue 3 + TypeScript (Vite, Router, Pinia) for modular route-driven UX.',
      'Backend uses Spring Boot with layered architecture: Controller -> Service -> Data access.',
      'Relational model structures users, posts, likes, and replies for scalable social interactions.',
      'Dockerized local stack enables reproducible backend + database startup for development.',
    ],
    readmeResources: [
      'README documents Docker and local dev workflows for backend and SPA integration.',
      'OpenAPI docs are exposed for REST endpoints to improve testability and onboarding.',
      'Project requirements and technical docs provide traceability beyond source code alone.',
    ],
    qualityNotes: [
      'Seeded data allows fast verification of real user flows across feed, profile, and replies.',
      'CORS, datasource config, and environment overrides support safer local/prod separation.',
      'Architecture choices prioritize maintainability and long-term extensibility over shortcuts.',
    ],
    keyFacts: [
      { label: 'Architecture', value: 'Layered Spring backend with clear service boundaries' },
      { label: 'Security', value: 'Auth-first design with role-aware access patterns' },
      { label: 'Portfolio Value', value: 'Demonstrates backend depth beyond basic CRUD' },
    ],
    caseStudySections: [
      {
        title: 'How It Works',
        points: [
          'Users register or sign in, then publish posts and interact through replies and likes.',
          'Feed and profile views consume REST endpoints exposed by the Spring Boot backend.',
          'Relational persistence keeps post/comment/user relationships consistent and queryable.',
          'Role-aware flows keep sensitive operations scoped to authorized users.',
        ],
      },
      {
        title: 'Key Design Decisions',
        points: [
          'Spring Boot chosen for production-ready conventions and strong ecosystem support.',
          'Layered backend design improves maintainability, testing, and separation of concerns.',
          'Relational modeling selected to preserve clear social graph and content relationships.',
          'Tradeoff: greater architectural complexity in exchange for real-world readiness.',
        ],
      },
      {
        title: 'Challenges & Complexity',
        points: [
          'Security configuration requires careful handling of auth/authorization boundaries.',
          'Entity mapping for users, posts, and replies must avoid recursion and serialization issues.',
          'Endpoint design must keep behavior predictable while supporting evolving frontend needs.',
          'Database schema and query patterns must stay efficient as interaction volume grows.',
        ],
      },
      {
        title: 'Future Roadmap',
        points: [
          'Add richer interaction features such as reactions, notifications, and enhanced profiles.',
          'Expand pagination and feed performance for larger datasets.',
          'Introduce stronger deployment/infra scaling options and caching strategies.',
          'Continue polishing content authoring with richer editor and media workflows.',
        ],
      },
    ],
    keyTakeaways: [
      'Blodged showcases enterprise-style backend thinking, not just CRUD feature delivery.',
      'The project highlights strong Spring ecosystem fluency and practical API architecture.',
      'It demonstrates secure, scalable foundations for building larger social platforms.',
    ],
  },
  {
    slug: 'minesweeper',
    title: 'MineSweeper',
    tagline: 'Classic puzzle gameplay powered by algorithmic logic.',
    description:
      'A grid-based Minesweeper implementation focused on recursive reveal behavior, state management, and responsive game interactions.',
    longDescription:
      'MineSweeper recreates the classic game loop in a modern web implementation where players reveal safe cells, flag suspected mines, and use adjacency clues to solve the board. The project emphasizes strong game-state modeling, grid algorithms, and event-driven interaction handling. It demonstrates how seemingly simple game rules require careful logic for recursion, edge-case control, and win/loss consistency.',
    problem:
      'Minesweeper appears simple, but implementing it correctly requires robust handling of 2D grid state, recursive cell expansion, boundary checks, and accurate win/loss transitions under real user input.',
    role:
      'Built and refined core gameplay systems including board generation, mine distribution, recursive flood-fill behavior, and gameplay state transitions.',
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
    highlights: [
      'Randomized board generation with dynamic mine placement.',
      'Recursive reveal logic to auto-expand empty regions.',
      'Flagging and adjacency clue mechanics aligned with classic Minesweeper behavior.',
      'Win/loss detection driven by consistent board state and interaction rules.',
      'Interactive grid UI with responsive click-driven gameplay loop.',
    ],
    techStack: ['ASP.NET Core MVC', 'C#', 'Razor', 'SQL'],
    architecture: [
      'ASP.NET Core MVC + Razor pages for server-driven rendering and game interactions.',
      'C# game engine models each cell with mine, reveal, flag, and adjacency state.',
      '2D board data structure supports fast neighbor checks and rule evaluation.',
      'Game state tracks progression, terminal states, and player interaction effects.',
    ],
    readmeResources: [
      'README and repo context highlight board creation, mine randomization, and flood-fill features.',
      'Contributor workflow captures collaborative development and branch discipline.',
      'Project framing focuses on translating classic puzzle mechanics into web architecture.',
    ],
    qualityNotes: [
      'Recursive reveal flow requires careful visited-state and boundary handling to avoid logic bugs.',
      'Game quality depends on edge-case control (corners, borders, rapid clicks, and terminal states).',
      'Architecture keeps logic readable and maintainable while preserving responsive interactions.',
    ],
    keyFacts: [
      { label: 'Core Logic', value: 'Grid algorithms + recursive flood-fill reveal' },
      { label: 'Interaction Model', value: 'Click/flag gameplay with real-time board updates' },
      { label: 'Portfolio Value', value: 'Demonstrates algorithmic thinking in an interactive app' },
    ],
    caseStudySections: [
      {
        title: 'How It Works',
        points: [
          'The game initializes a 2D grid, randomly places mines, and computes adjacent mine counts.',
          'Players reveal tiles to uncover safe cells and use right-click style interactions to flag risk areas.',
          'When a revealed tile has zero adjacent mines, flood-fill logic expands nearby safe regions.',
          'The engine continuously evaluates win/loss states based on revealed safe cells and mine interactions.',
        ],
      },
      {
        title: 'Algorithms & Logic',
        points: [
          'Neighbor scanning evaluates each cell against up to eight surrounding positions.',
          'Recursive expansion handles zero-value cells while preventing repeat traversal.',
          'Random placement logic ensures unique mine coordinates and replay variety.',
          'State transitions synchronize board data and UI feedback after each user action.',
        ],
      },
      {
        title: 'Challenges & Complexity',
        points: [
          'Recursive reveal can cause incorrect propagation without strict boundary and visited checks.',
          'Game-state transitions must correctly lock interactions after terminal win/loss events.',
          'Edge/corner tiles require explicit neighbor-lookup safeguards.',
          'Random generation must remain fair while preserving predictable game rules.',
        ],
      },
      {
        title: 'Future Roadmap',
        points: [
          'Add difficulty presets, timer/scoring, and richer session statistics.',
          'Improve visuals with animations and clearer interaction feedback.',
          'Introduce optional hints or solver assistance for advanced gameplay.',
          'Expand persistence and leaderboard features for replayability.',
        ],
      },
    ],
    keyTakeaways: [
      'MineSweeper highlights strong command of recursion, state, and grid data structures.',
      'The project demonstrates practical event-driven engineering in a user-facing interactive system.',
      'It turns foundational CS concepts into polished, playable application behavior.',
    ],
  },
  {
    slug: 'lunara',
    title: 'Lunara',
    tagline: 'A full-stack postpartum support platform.',
    description:
      'A production-style care platform connecting postpartum families with doulas through structured workflows, support tools, and secure full-stack architecture.',
    longDescription:
      'LUNARA combines two repositories into one cohesive system: `AQC` for backend API/business logic and `lunaracare` for the frontend product experience. Together they deliver a scalable healthcare-oriented workflow for postpartum families and providers, with secure access, structured data flow, and maintainable separation of concerns.',
    problem:
      'Postpartum support is often fragmented across disconnected tools, making it difficult for families to access care and for providers to coordinate services in one place.',
    role:
      'Full-stack contributor across frontend-backend integration, architecture decisions, auth flow design, and delivery of provider/client user journeys.',
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
    highlights: [
      'Role-based support workflows for postpartum users, doulas, and admins.',
      'Secure authentication and API-backed data flow between UI and backend services.',
      'Service-oriented care experience for connecting users with providers and resources.',
      'Real-world multi-repo architecture enabling independent frontend/backend delivery.',
    ],
    techStack: ['React', 'Vite', 'TypeScript', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'Flyway', 'Docker'],
    architecture: [
      'Two-repo system: `AQC` backend handles API/domain logic while `lunaracare` focuses on UX and client workflows.',
      'Backend follows layered pattern: Controller -> Service -> Repository -> Database.',
      'Frontend communicates with REST endpoints for auth, care operations, and user-specific data views.',
      'PostgreSQL + Flyway provides relational consistency and migration-driven schema evolution.',
    ],
    readmeResources: [
      'System design reflects realistic separation of concerns found in modern SaaS teams.',
      'Multi-repo setup supports clearer collaboration boundaries and independent deployment paths.',
      'Architecture choices center on maintainability, security, and healthcare workflow extensibility.',
    ],
    qualityNotes: [
      'Frontend-backend auth integration requires careful token handling and session boundary control.',
      'Docker and environment management improve parity between local development and deployment.',
      'Domain modeling prioritizes long-term scalability for appointments, services, and provider relationships.',
    ],
    keyFacts: [
      { label: 'Repo Strategy', value: 'Multi-repo architecture (AQC backend + lunaracare frontend)' },
      { label: 'Data Flow', value: 'React UI -> REST API -> Spring Boot -> PostgreSQL' },
      { label: 'Portfolio Value', value: 'Capstone-level full-stack system design and integration' },
    ],
    caseStudySections: [
      {
        title: 'System Structure',
        points: [
          'AQC repository contains backend APIs, auth logic, persistence, and domain services.',
          'lunaracare repository contains the product-facing UI, client flows, and API integration.',
          'This split enables independent scaling and release cadence for frontend and backend teams.',
          'The pattern mirrors real-world SaaS architecture where services evolve at different speeds.',
        ],
      },
      {
        title: 'How It Works',
        points: [
          'Users authenticate through the frontend, while backend security controls access policies.',
          'Client actions trigger API requests that execute business logic and persist relational data.',
          'Structured workflows support provider connection, service access, and care coordination.',
          'Data and UI remain synchronized through consistent endpoint contracts.',
        ],
      },
      {
        title: 'Key Design Decisions',
        points: [
          'Multi-repo chosen to enforce clean responsibility boundaries and deployment flexibility.',
          'Spring Boot and Spring Security selected for enterprise-grade backend patterns.',
          'React + TypeScript selected for modular UI architecture and maintainable client logic.',
          'PostgreSQL + Flyway selected for reliable schema evolution and controlled migrations.',
        ],
      },
      {
        title: 'Challenges & Complexity',
        points: [
          'Frontend/backend authentication integration is complex and security-critical.',
          'Endpoint coordination must remain stable as both repos evolve independently.',
          'Healthcare-domain modeling requires thoughtful relationship and workflow design.',
          'Operational consistency depends on environment management and containerized setup.',
        ],
      },
      {
        title: 'Future Roadmap',
        points: [
          'Expanded messaging and scheduling workflows for providers and families.',
          'Notification pipelines and improved mobile-first interaction polish.',
          'Intelligent recommendations and deeper personalization pathways.',
          'Continued security hardening toward stronger healthcare compliance requirements.',
        ],
      },
    ],
    keyTakeaways: [
      'LUNARA demonstrates true full-stack architecture, not just isolated feature work.',
      'The two-repo model reflects real engineering organization and scalable deployment patterns.',
      'It showcases product thinking applied to a meaningful healthcare support problem.',
    ],
  },
]

const carouselProjects = computed(() =>
  projects.map((project) => ({
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    imageSrc: project.imageSrc,
    imageAlt: project.imageAlt,
    detailUrl: `/projects/${project.slug}`,
  })),
)

const selectedProjectSlug = ref<string | null>(null)

const selectedProject = computed(() =>
  projects.find((project) => project.slug === selectedProjectSlug.value) ?? null,
)

const selectedProjectCarouselProjects = computed(() => {
  const project = selectedProject.value
  if (!project) return []

  const repeatCount = 3
  const gallery: Array<{
    title: string
    tagline: string
    description: string
    imageSrc: string
    imageAlt: string
    detailUrl: string
  }> = []

  for (let cycle = 0; cycle < repeatCount; cycle += 1) {
    for (let index = 0; index < project.galleryImages.length; index += 1) {
      const image = project.galleryImages[index]!
      gallery.push({
        title: project.title,
        tagline: project.tagline,
        description: image.alt,
        imageSrc: image.src,
        imageAlt: image.alt,
        detailUrl: `/projects/${project.slug}#gallery-${cycle + 1}-${index + 1}`,
      })
    }
  }

  return gallery
})

const shouldUseDetailCarousel = computed(() => {
  const project = selectedProject.value
  if (!project) return false
  return project.galleryImages.length > 1
})

let projectRevealObserver: IntersectionObserver | null = null

function cleanupProjectRevealObserver() {
  projectRevealObserver?.disconnect()
  projectRevealObserver = null
}

function initProjectDetailReveal() {
  cleanupProjectRevealObserver()

  nextTick(() => {
    const targetSelector = selectedProject.value
      ? '.project-detail [data-scroll-reveal]'
      : '[data-scroll-reveal="landing"]'
    const targets = Array.from(document.querySelectorAll<HTMLElement>(targetSelector))

    if (!targets.length) return

    const defaultDelayStepMs = selectedProject.value ? 45 : 90
    const defaultDelayMaxMs = selectedProject.value ? 220 : 520

    targets.forEach((el, index) => {
      el.classList.remove('is-revealed')
      const existingDelay = el.style.getPropertyValue('--reveal-delay').trim()
      if (!existingDelay) {
        el.style.setProperty(
          '--reveal-delay',
          `${Math.min(index * defaultDelayStepMs, defaultDelayMaxMs)}ms`,
        )
      }
    })

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    projectRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          projectRevealObserver?.unobserve(entry.target)
        })
      },
      {
        root: null,
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    targets.forEach((el) => projectRevealObserver?.observe(el))
  })
}

function projectSlugFromLocation() {
  const normalizedHash = window.location.hash.replace(/^#/, '')
  const hashMatch = normalizedHash.match(/^\/projects\/([a-z0-9-]+)$/i)
  if (hashMatch?.[1]) return hashMatch[1].toLowerCase()

  const pathMatch = window.location.pathname.match(/^\/projects\/([a-z0-9-]+)$/i)
  return pathMatch?.[1]?.toLowerCase() ?? null
}

function syncSelectedProjectFromLocation() {
  selectedProjectSlug.value = projectSlugFromLocation()
}

function openProject(projectSlug: string) {
  window.history.pushState({}, '', `/projects/${projectSlug}`)
  syncSelectedProjectFromLocation()
}

onMounted(() => {
  syncSelectedProjectFromLocation()
  window.addEventListener('hashchange', syncSelectedProjectFromLocation)
  window.addEventListener('popstate', syncSelectedProjectFromLocation)
  initProjectDetailReveal()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncSelectedProjectFromLocation)
  window.removeEventListener('popstate', syncSelectedProjectFromLocation)
  cleanupProjectRevealObserver()
})

watch(selectedProject, () => {
  initProjectDetailReveal()
})

/**
 * Contact form state variables
 * @property {boolean} formSubmitting - Tracks when the form is being submitted
 * @property {boolean} formSubmitted - Tracks if the form was successfully submitted
 * @property {string} formError - Stores any error messages during form submission
 */
const formSubmitting = ref(false)
const formSubmitted = ref(false)
const formError = ref('')

/**
 * Handles the contact form submission using Formspree
 * Sends data asynchronously and manages submission state
 * 
 * @param {Event} event - The form submission event
 */
const handleSubmit = async (event: Event) => {
  event.preventDefault()
  formSubmitting.value = true
  formError.value = ''
  
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  
  try {
    // Submit form data to Formspree endpoint
    const response = await fetch('https://formspree.io/f/mpwdbery', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      // Handle successful submission
      formSubmitted.value = true
      form.reset()
    } else {
      // Handle error response from Formspree
      const data = await response.json()
      formError.value = data.error || 'Something went wrong. Please try again.'
    }
  } catch (error) {
    // Handle network errors
    formError.value = 'Network error. Please try again.'
    console.error('Form submission error:', error)
  } finally {
    formSubmitting.value = false
  }
}
</script>

<template>
  <div class="app">
    <!-- Site header with navigation -->
    <TheHeader />
    
    <main class="main">
      <section
        v-if="selectedProject"
        class="section project-detail"
        :aria-labelledby="`${selectedProject.slug}-title`"
      >
        <div class="container project-detail__container">
          <article class="project-detail__hero" data-scroll-reveal>
            <div
              v-if="shouldUseDetailCarousel"
              class="project-detail__hero-carousel"
              aria-label="Project image carousel"
            >
              <ProjectShowcase
                :projects="selectedProjectCarouselProjects"
                :show-logos="false"
                :show-descriptions="false"
                :show-media-hint="false"
              />
            </div>
            <div
              v-else
              class="project-detail__single-image-card"
            >
              <ProjectCard
                :title="selectedProject.title"
                :description="selectedProject.description"
                :image-src="selectedProject.galleryImages[0]?.src || selectedProject.imageSrc"
                :image-alt="selectedProject.galleryImages[0]?.alt || selectedProject.imageAlt"
                :detail-url="`/projects/${selectedProject.slug}`"
                variant="carousel"
                :omit-title="true"
                :is-main-display="true"
                :show-media-hint="false"
              />
            </div>
            <div class="project-detail__hero-content">
              <p class="section__eyebrow">Case Study</p>
              <h1 :id="`${selectedProject.slug}-title`" class="project-detail__title">
                {{ selectedProject.title }}
              </h1>
              <p class="project-detail__tagline">{{ selectedProject.tagline }}</p>
              <p class="project-detail__summary">{{ selectedProject.longDescription }}</p>
              <div class="project-detail__actions">
                <a :href="selectedProject.githubUrl" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
                  View GitHub
                </a>
                <a
                  v-if="selectedProject.liveUrl"
                  :href="selectedProject.liveUrl"
                  class="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live App
                </a>
              </div>
            </div>
          </article>
          <div class="project-detail__facts">
            <article
              v-for="(fact, index) in selectedProject.keyFacts"
              :key="fact.label"
              class="project-detail__fact-card"
              data-scroll-reveal
              :style="{ '--reveal-delay': `${Math.min(index * 80, 240)}ms` }"
            >
              <p class="project-detail__fact-label">{{ fact.label }}</p>
              <p class="project-detail__fact-value">{{ fact.value }}</p>
            </article>
          </div>
          <div class="project-detail__overview-grid">
            <article class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 0ms">
              <h2 class="project-detail__panel-title">Challenge</h2>
              <p class="project-detail__copy">{{ selectedProject.problem }}</p>
            </article>
            <article class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 110ms">
              <h2 class="project-detail__panel-title">Contribution</h2>
              <p class="project-detail__copy">{{ selectedProject.role }}</p>
            </article>
          </div>
          <div class="project-detail__grid">
            <div class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 0ms">
              <h2 class="project-detail__panel-title">Key Features</h2>
              <ul class="project-detail__list">
                <li v-for="item in selectedProject.highlights" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 80ms">
              <h2 class="project-detail__panel-title">Tech Stack</h2>
              <ul class="project-detail__list project-detail__list--stack">
                <li v-for="item in selectedProject.techStack" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 160ms">
              <h2 class="project-detail__panel-title">Architecture</h2>
              <ul class="project-detail__list">
                <li v-for="item in selectedProject.architecture" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 240ms">
              <h2 class="project-detail__panel-title">README Highlights</h2>
              <ul class="project-detail__list">
                <li v-for="item in selectedProject.readmeResources" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="project-detail__panel" data-scroll-reveal style="--reveal-delay: 320ms">
              <h2 class="project-detail__panel-title">Quality & Delivery</h2>
              <ul class="project-detail__list">
                <li v-for="item in selectedProject.qualityNotes" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
          <section
            v-if="selectedProject.caseStudySections?.length"
            class="project-detail__case-study"
            aria-label="Case study highlights"
          >
            <article
              v-for="(section, index) in selectedProject.caseStudySections"
              :key="section.title"
              class="project-detail__panel"
              data-scroll-reveal
              :style="{ '--reveal-delay': `${Math.min(index * 90, 360)}ms` }"
            >
              <h2 class="project-detail__panel-title">{{ section.title }}</h2>
              <ul class="project-detail__list">
                <li v-for="point in section.points" :key="point">{{ point }}</li>
              </ul>
            </article>
          </section>
          <section
            v-if="selectedProject.keyTakeaways?.length"
            class="project-detail__takeaways"
            aria-label="Key takeaways"
            data-scroll-reveal
          >
            <h2 class="project-detail__panel-title">Key Takeaways</h2>
            <ul class="project-detail__list">
              <li v-for="item in selectedProject.keyTakeaways" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>
      </section>

      <template v-else>
      <!-- Hero/Home Section -->
      <section id="home" class="hero" data-scroll-reveal="landing">
        <div class="hero__glow" aria-hidden="true" />
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__title">Hi, I'm <span class="highlight">Carter Wright</span></h1>
            <p class="hero__tagline">Full-stack software developer</p>
            <div class="hero__cta">
              <a href="#projects" class="btn btn--primary" v-smooth-scroll>View projects</a>
              <a href="#contact" class="btn btn--secondary" v-smooth-scroll>Contact</a>
              <a href="/resume.pdf" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">Resume</a>
            </div>
            <div class="social-links">
                  <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects — full-viewport carousel (edge-to-edge, no panel) -->
      <section
        id="projects"
        class="section section--projects section--projects-fullbleed"
        aria-labelledby="projects-heading"
        data-scroll-reveal="landing"
      >
        
        <div class="section--projects__carousel">
          <ProjectShowcase :projects="carouselProjects" />
        </div>
      </section>
      
      <!-- About Section -->
      <section id="about" class="section" data-scroll-reveal="landing">
        <div class="container">
          <div class="section__heading">
            <p class="section__eyebrow">Background</p>
            <h2 class="section__title">About me</h2>
          </div>
          <div class="about__content">
            <div class="about__intro">
              <p>Hello! My name is Carter Wright. I am an upcoming software developer looking to enhance my skills while doing what I love.</p>
              <br>
              <p>I am originally from Michigan, but currently living in <b>Phoenix, AZ</b> as I am studying for my <b>Bachelor's in Software Development at Grand Canyon University</b>. I am set to graduate in April 2026 and searching for the right role to get my foot in the door in this career.</p>
              <br>
              <p>My recent work has focused on full-stack web development using <b>C# ASP.NET</b>, <b>Enterprise Java</b>, and <b>Node.js</b>. I also have experience in cybersecurity and integrating industry-standard frameworks such as <b>NIST</b>, <b>CIS</b>, <b>MITRE</b>, and <b>OWASP</b> into my applications.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Skills Section -->
      <section id="skills" class="section" data-scroll-reveal="landing">
        <div class="container">
          <div class="section__heading">
            <p class="section__eyebrow">Toolkit</p>
            <h2 class="section__title">Skills</h2>
          </div>
          <div class="skills__grid">
            <div class="skill skills-container">
              <h3 class="skill__title">Languages & Technologies</h3>
              <div class="skill-subtitle"><span class="code-keyword">const</span> <span class="code-var">mySkills</span> = {</div>
              <div class="skill__list">

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">ASP.NET/C#</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 85%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Java</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">JavaScript/TypeScript</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 65%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">Python</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 70%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">HTML/CSS</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 80%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">C/C++</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 60%"></div>
                  </div>
                </div>

                <div class="skill-item">
                  <div class="skill-info">
                    <span class="skill-name">SQL</span>
                  </div>
                  <div class="skill-bar">
                    <div class="skill-progress" style="width: 85%"></div>
                  </div>
                </div>

              </div>
              <div class="skill-closing">}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Contact Section -->
      <section id="contact" class="section" data-scroll-reveal="landing">
        <div class="container">
          <div class="section__heading">
            <p class="section__eyebrow">Let’s talk</p>
            <h2 class="section__title">Contact</h2>
          </div>
          <div class="contact-wrapper">
            <div class="contact">
              <div class="contact__info">
                <h3 class="contact-subtitle">Get In Touch</h3>
                <p class="contact-text">Feel free to reach out through any of these channels:</p>
                <ul class="contact__list">
                  <li class="contact-item">
                    <span class="contact-icon">📧</span>
                    <span class="contact-label">Email:</span>
                    <span class="contact-value">carterwright221@gmail.com</span>
                  </li>
                  <li class="contact-item">
                    <span class="contact-icon">📱</span>
                    <span class="contact-label">Phone:</span>
                    <span class="contact-value">(810)-569-3888</span>
                  </li>
                  <li class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span class="contact-label">Location:</span>
                    <span class="contact-value">Phoenix, AZ</span>
                  </li>
                </ul>
                <div class="social-links">
                  <a href="https://linkedin.com/in/carterdanw/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/cademic" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
              
              <div class="contact__form-container">
                <h3 class="contact-subtitle">Send a Message</h3>
                
                <!-- Show success message when form is submitted -->
                <div v-if="formSubmitted" class="form-status form-status--success">
                  Thank you for your message! I'll get back to you soon.
                </div>
                
                <!-- Show error message if there was an error -->
                <div v-if="formError" class="form-status">
                  {{ formError }}
                </div>
                
                <!-- Contact form using Formspree for submission -->
                <form 
                  class="contact__form" 
                  @submit="handleSubmit"
                  action="https://formspree.io/f/mpwdbery" 
                  method="POST"
                >
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      placeholder="Your Name"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="your.email@example.com"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows="8" 
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn--primary"
                    :disabled="formSubmitting"
                  >
                    {{ formSubmitting ? 'Sending...' : 'Send Message' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      </template>
  </main>
    
    <!-- Site footer -->
    <TheFooter />
  </div>
</template>

<style>
/* Fonts loaded in index.html (Inter + JetBrains Mono) */

/**
 * Global CSS Variables
 * Defines color palette, spacing, and fonts used throughout the application
 */
:root {
  /* Color Palette - Based on a dark coding theme */
  --color-primary: #00e0ff;         /* Primary accent color - bright cyan */
  --color-primary-dark: #00b8cc;    /* Darker version of primary for hover states */
  --color-secondary: #ff5f56;       /* Secondary accent - soft red */
  --color-accent-1: #ffbd2e;        /* Yellow accent for highlights */
  --color-accent-2: #27c93f;        /* Green accent for success states */
  --color-accent-3: #bd93f9;        /* Purple accent for additional highlights */
  
  /* Text Colors */
  --color-text: #f8f8f2;            /* Primary text color - off-white */
  --color-text-light: #8f93a2;      /* Secondary text color - light gray */
  
  /* Background Colors */
  --color-background: #282a36;      /* Main background - dark blue-gray */
  --color-background-alt: #1e1f29;  /* Alternate background - slightly darker */
  --color-background-code: #21222c; /* Code blocks background - even darker */
  
  /* Border Colors */
  --color-border: #44475a;          /* Border color - medium gray */
  
  /* Layout Variables */
  --container-width: 1200px;        /* Maximum content width */
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 2.5rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --radius-lg: 16px;
  --shadow-soft: 0 24px 60px rgba(0, 0, 0, 0.35);
}

/* Global Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Enable smooth scrolling for the entire site */
html {
  scroll-behavior: smooth;
}

/* Base Body Styles */
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  line-height: 1.5;
  background-color: var(--color-background);
}

/* Typography Defaults */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  font-family: var(--font-mono);
}

/* Main Content Area */
.main {
  padding-top: 80px; /* Height of the fixed header */
}

/* Container for Content Sections */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Standard Section Styling */
.section {
  padding: var(--spacing-lg) 0;
  position: relative;
  scroll-margin-top: 80px; /* Accounts for fixed header height when scrolling to anchors */
}

/* Section headings — minimal, reference-style hierarchy */
.section__heading {
  text-align: center;
  max-width: 42rem;
  margin: 0 auto var(--spacing-xl);
}

.section__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-light);
  margin: 0 0 0.5rem;
}

.section__title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  margin: 0;
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.section__title--hero {
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  color: var(--color-text);
}

.section__lede {
  margin: 1rem 0 0;
  color: var(--color-text-light);
  font-size: 1.05rem;
  line-height: 1.6;
}

.section--spotlight {
  padding-top: clamp(2.5rem, 6vw, 4rem);
  padding-bottom: clamp(2.5rem, 6vw, 4rem);
}

.section--projects {
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.section--projects-fullbleed {
  min-height: 0;
  display: block;
  padding-top: clamp(1.5rem, 4vw, 2.5rem);
  padding-bottom: clamp(3.5rem, 7vw, 6rem);
  scroll-margin-top: 80px;
}

.section--projects__intro {
  margin-bottom: clamp(0.75rem, 2vw, 1.25rem);
}

.section--projects__carousel {
  display: block;
  width: 100%;
}

.project-detail {
  min-height: calc(100vh - 80px);
  background: var(--color-background-alt);
}

[data-scroll-reveal] {
  opacity: 0;
  transform: translate3d(0, var(--reveal-shift, 16px), 0) scale(var(--reveal-scale, 0.99));
  filter: blur(var(--reveal-blur, 5px));
  transition:
    opacity var(--reveal-duration, 360ms) cubic-bezier(0.22, 1, 0.36, 1),
    transform var(--reveal-duration, 360ms) cubic-bezier(0.22, 1, 0.36, 1),
    filter var(--reveal-duration, 360ms) cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform, filter;
}

[data-scroll-reveal].is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  filter: none;
}

[data-scroll-reveal='landing'] {
  --reveal-duration: 700ms;
  --reveal-shift: 22px;
  --reveal-blur: 7px;
  --reveal-scale: 0.985;
}

[data-scroll-reveal='landing'].is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  filter: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-scroll-reveal] {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}

.project-detail__container {
  max-width: 1120px;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.project-detail__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  letter-spacing: -0.03em;
}

.project-detail__hero {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  align-items: stretch;
}

.project-detail__hero-carousel {
  width: 100%;
}

.project-detail__hero-carousel .showcase {
  padding-inline: 0;
}

.project-detail__hero-carousel .showcase__viewport {
  min-height: min(48vh, 620px);
  padding: clamp(1.75rem, 3.2vw, 2.4rem) 0 clamp(0.35rem, 1vw, 0.7rem);
  overflow: visible;
}

.project-detail__single-image-card {
  width: 100%;
}

.project-detail__single-image-card :deep(.project-card__media--carousel-hit) {
  cursor: default;
  pointer-events: none;
}

.project-detail__single-image-card :deep(.project-card__carousel-frame) {
  min-height: min(48vh, 620px);
}

.project-detail__hero-content {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.project-detail__tagline {
  color: var(--color-primary);
  font-size: 1rem;
}

.project-detail__summary {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-light);
}

.project-detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-detail__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(68, 71, 90, 0.45);
}

.project-detail__fact-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.project-detail__fact-label {
  margin: 0 0 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.project-detail__fact-value {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.45;
}

.project-detail__overview-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.project-detail__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-detail__case-study {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-detail__panel {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.project-detail__panel-title {
  margin-bottom: 0.7rem;
  color: var(--color-text);
  font-size: clamp(1.3rem, 2.4vw, 1.7rem);
  letter-spacing: 0;
  line-height: 1.2;
  font-family: var(--font-sans);
  font-weight: 700;
  text-rendering: optimizeLegibility;
}

.project-detail__list {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--color-text-light);
}

.project-detail__list--stack {
  list-style: square;
}

.project-detail__copy {
  margin: 0;
  line-height: 1.72;
  color: var(--color-text-light);
  max-width: 70ch;
}

.project-detail__takeaways {
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(0, 224, 255, 0.45);
}

/* 
 * Hero Section Styling 
 * First section of the page with the main headline and CTA buttons
 */
.hero {
  padding: clamp(3rem, 10vw, 5.5rem) 0 clamp(4rem, 12vw, 6rem);
  background-color: var(--color-background-alt);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  scroll-margin-top: 80px;
}

.hero__glow {
  position: absolute;
  inset: -40% -20% auto;
  height: min(70vh, 520px);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 224, 255, 0.14) 0%,
    rgba(189, 147, 249, 0.06) 45%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

/* Background grid pattern for hero section */
.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(to right, rgba(68, 71, 90, 0.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(68, 71, 90, 0.35) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.12;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

/* Hero content container */
.hero__content {
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-light);
  margin: 0 0 1rem;
}

/* Main headline styling */
.hero__title {
  font-size: clamp(2.75rem, 8vw, 4rem);
  margin: 0 0 1.25rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--color-text);
  position: relative;
  display: inline-block;
}

.hero__title::before {
  content: 'System.out.println("';
  font-size: clamp(0.7rem, 2vw, 1rem);
  position: absolute;
  top: -1.35rem;
  left: 0;
  color: var(--color-accent-1);
  font-family: var(--font-mono);
  opacity: 0.85;
  white-space: nowrap;
}

.hero__title::after {
  content: '");';
  font-size: clamp(0.7rem, 2vw, 1rem);
  position: absolute;
  bottom: -1.35rem;
  right: 0;
  color: var(--color-accent-1);
  font-family: var(--font-mono);
  opacity: 0.85;
  white-space: nowrap;
}

.highlight {
  color: var(--color-primary);
  position: relative;
}

.highlight::after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: var(--color-primary);
  animation: blink 1s step-end infinite;
  opacity: 0.5;
  vertical-align: text-bottom;
  margin-left: 5px;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
}

.hero__tagline {
  font-size: clamp(1.05rem, 2.4vw, 1.2rem);
  color: var(--color-text-light);
  margin: 0 0 2rem;
  line-height: 1.65;
}

.hero__accent {
  color: var(--color-primary);
  font-weight: 500;
}

/* Call to action button container */
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
}

/* 
 * Button Styles 
 * Used for CTA buttons and form submission
 */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-mono);
  position: relative;
  border: none;
}

/* Terminal-like prompt before buttons */
.btn::before {
  content: '>';
  margin-right: 0.5rem;
  font-weight: bold;
}

/* Primary button - solid background */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-background);
}

/* Primary button hover effect */
.btn--primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 224, 255, 0.3);
}

/* Secondary button - outlined style */
.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* Secondary button hover effect */
.btn--secondary:hover {
  background-color: rgba(0, 224, 255, 0.1);
  transform: translateY(-2px);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn--ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* Skills Section */
.skills__grid {
  display: flex;
  justify-content: center;
}

.skills-container {
  max-width: 800px;
  width: 100%;
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  position: relative;
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
}

.skill-name {
  color: var(--color-text);
}

.skill-percentage {
  color: var(--color-accent-1);
}

.skill-bar {
  height: 8px;
  background-color: var(--color-background-alt);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--color-border);
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-2), var(--color-primary));
  border-radius: 4px;
  position: relative;
  transition: width 1.5s ease;
  animation: progress 1.5s ease;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
              rgba(255, 255, 255, 0.15) 25%, 
              transparent 25%, 
              transparent 50%, 
              rgba(255, 255, 255, 0.15) 50%, 
              rgba(255, 255, 255, 0.15) 75%, 
              transparent 75%, 
              transparent);
  background-size: 20px 20px;
  animation: move 1s linear infinite;
  opacity: 0.3;
}

@keyframes progress {
  0% {
    width: 0;
  }
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

.skill-subtitle {
  font-family: var(--font-mono);
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.skill-closing {
  font-family: var(--font-mono);
  color: var(--color-text-light);
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Contact Section */
.contact-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.contact {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-lg);
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.contact-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-weight: 600;
}

.contact-text {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

.contact__list {
  list-style: none;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.contact-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.contact-label {
  color: var(--color-accent-1);
  margin-right: 0.5rem;
  font-weight: 500;
}

.contact-value {
  color: var(--color-text);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.social-link {
  color: var(--color-primary);
  transition: color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
}

.social-link:hover {
  color: var(--color-accent-2);
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

.contact__form-container {
  position: relative;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-accent-1);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input {
  height: 50px;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 224, 255, 0.1);
}

.form-status {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: rgba(255, 95, 86, 0.1);
  color: var(--color-secondary);
  border-left: 3px solid var(--color-secondary);
}

.form-status--success {
  background-color: rgba(39, 201, 63, 0.1);
  color: var(--color-accent-2);
  border-left: 3px solid var(--color-accent-2);
}

@media (max-width: 768px) {
  .contact {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .contact__info {
    margin-bottom: 2rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-alt);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Responsive styles */
@media (max-width: 768px) {
  .project-detail__hero {
    grid-template-columns: 1fr;
  }

  .project-detail__facts {
    grid-template-columns: 1fr;
  }

  .contact {
    grid-template-columns: 1fr;
  }
}

/* About Section */
.about__content {
  max-width: 52rem;
  margin: 0 auto;
}

.about__intro {
  background-color: var(--color-background-code);
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.about__intro::before {
  content: '/**';
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--color-accent-3);
  font-family: var(--font-mono);
  opacity: 0.6;
}

.about__intro::after {
  content: '*/';
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--color-accent-3);
  font-family: var(--font-mono);
  opacity: 0.6;
}

.code-keyword {
  color: var(--color-secondary);
}

.code-var {
  color: var(--color-accent-2);
}

.code-comment {
  color: var(--color-accent-3);
  font-size: 0.85rem;
}

</style>
