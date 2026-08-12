const links = [
  { href: "https://github.com/cademic", label: "GITHUB" },
  { href: "https://www.linkedin.com/in/carterdanw/", label: "LINKEDIN" },
];

export function Footer() {
  return (
    <footer className="bg-card text-ink border-t border-panel-strong">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 sm:px-8 py-12 max-w-[1200px] mx-auto gap-gutter">
        <div className="text-body-md text-ink-muted text-center md:text-left">
          © 2026 CARTER WRIGHT. Full-Stack Software Developer.
        </div>
        <div className="flex space-x-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-label-sm text-ink-muted transition-[color,transform] duration-300 ease-out hover:text-sky-600 dark:hover:text-sky-400 hover:underline hover:scale-110 decoration-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
