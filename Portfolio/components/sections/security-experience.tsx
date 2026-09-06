"use client";

import type { Icon } from "@phosphor-icons/react/lib";
import {
  BugIcon,
  TerminalWindowIcon,
  ShieldWarningIcon,
  CheckCircle,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react/dist/ssr";
import { type Badge, TechBadge } from "@/components/ui/tech-badge";
import { DepthStackCarousel } from "@/components/ui/depth-stack-carousel";

const BURP_SUITE: Badge = { label: "Burp Suite", color: "FF6633", logo: "burpsuite" };
const OWASP_ZAP: Badge = { label: "OWASP ZAP", color: "000000", logo: "owasp" };
const KALI_LINUX: Badge = { label: "Kali Linux", color: "557C94", logo: "kalilinux" };
const NMAP: Badge = { label: "Nmap", color: "1B1B1B" };
const WINDOWS_EVENT_VIEWER: Badge = { label: "Windows Event Viewer", color: "737373" };
const COMMAND_LINE: Badge = { label: "Command Line", color: "4D4D4D" };
const WINDOWS_SERVER: Badge = { label: "Windows Server", color: "0078D6" };
const GREENBONE_OPENVAS: Badge = { label: "Greenbone/OpenVAS", color: "66B92E" };
const METASPLOIT: Badge = { label: "Metasploit", color: "2596CD", logo: "metasploit" };
const MSFVENOM: Badge = { label: "MSFVenom", color: "2596CD" };
const THE_HARVESTER: Badge = { label: "theHarvester", color: "1B1B1B" };

interface SecurityEngagement {
  title: string;
  icon: Icon;
  tools: Badge[];
  bullets: string[];
  disclaimer?: string;
  reportHref: string;
}

const engagements: SecurityEngagement[] = [
  {
    title: "OWASP Juice Shop Penetration Assessment",
    icon: BugIcon,
    tools: [BURP_SUITE, OWASP_ZAP, KALI_LINUX, NMAP],
    bullets: [
      "Performed a web application penetration test on OWASP Juice Shop.",
      "Found and tested vulnerabilities including SQL Injection, XSS, IDOR, broken access controls, and CAPTCHA bypasses.",
      "Used Burp Suite, OWASP ZAP, Kali Linux, and Nmap to scan the application, analyze traffic, and test security weaknesses.",
      "Created a penetration testing report with findings, risk levels, and recommended fixes.",
    ],
    reportHref: "/reports/owasp-juice-shop-report.pdf",
  },
  {
    title: "TryHackMe – Investigating Windows",
    icon: TerminalWindowIcon,
    tools: [WINDOWS_EVENT_VIEWER, COMMAND_LINE, WINDOWS_SERVER],
    bullets: [
      "Investigated a compromised Windows system by reviewing logs, processes, scheduled tasks, and files.",
      "Analyzed security events to find suspicious activity and possible signs of compromise.",
      "Used Windows administration and basic digital forensics techniques in a virtual lab.",
      "Practiced incident response by investigating simulated cyberattacks and identifying what happened.",
    ],
    reportHref: "/reports/tryhackme-investigating-windows.pdf",
  },
  {
    title: "AutoLiv Penetration Test (Academic Case Study)",
    icon: ShieldWarningIcon,
    tools: [KALI_LINUX, NMAP, GREENBONE_OPENVAS, METASPLOIT, MSFVENOM, THE_HARVESTER],
    bullets: [
      "Course project for GCU's Cybersecurity and Ethical Hacking class, using AutoLiv as a fictional case-study target.",
      "Started with OSINT recon, then pulled employee and infrastructure data with theHarvester, SpiderFoot, and dnsenum.",
      "Scanned the lab network with Nmap, found vulnerabilities with Greenbone/OpenVAS, and broke into legacy Windows and Metasploitable boxes with Metasploit.",
      "Built a custom backdoor with MSFVenom and wrote it all up in a 90-page report with fixes for each finding.",
    ],
    disclaimer:
      "All activities were conducted strictly within the academic sandbox environment. No real AutoLiv systems were targeted.",
    reportHref: "/reports/AutoLiv-Pen-Testing-Report.pdf",
  },
];

function EngagementCard({ engagement }: { engagement: SecurityEngagement }) {
  const EngagementIcon = engagement.icon;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-lg">
      <div className="flex shrink-0 items-center gap-2 border-b border-panel-strong/60 bg-panel px-4 py-0.5 sm:py-1">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-1.5 truncate font-mono text-xs text-ink-muted">{engagement.title}</span>
      </div>

      {/* flex-1 (without overflow-auto) lets `mt-auto` below pin the badges
          and button to the bottom of the card. This is safe from the old
          "scrolling flex item collapses to 0" flexbox quirk because nothing
          here sets `overflow` to non-visible, and it can never actually need
          to scroll anyway: the carousel sizes every card to the height of
          the tallest one (see DepthStackCarousel), so a shorter card's own
          content always fits with room to spare above this footer. */}
      <div className="flex flex-1 flex-col p-2 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <EngagementIcon size={20} className="mt-0.5 shrink-0 text-accent sm:hidden" />
          <EngagementIcon size={24} className="mt-0.5 hidden shrink-0 text-accent sm:block" />
          <h3 className="font-mono text-base font-bold text-ink sm:text-lg">{engagement.title}</h3>
        </div>
        <ul className="mt-1 space-y-1 text-sm text-ink-muted sm:mt-2 sm:text-body-md">
          {engagement.bullets.map((point) => (
            <li key={point} className="flex items-start gap-1.5 sm:gap-2">
              <CheckCircle size={15} className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400 sm:hidden" />
              <CheckCircle size={18} className="mt-0.5 hidden shrink-0 text-sky-600 dark:text-sky-400 sm:block" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {engagement.disclaimer && (
          <p className="mt-1 border-l-2 border-panel-strong pl-3 text-xs italic text-ink-muted sm:mt-2 sm:text-label-sm">
            {engagement.disclaimer}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1 sm:pt-2">
          {engagement.tools.map((badge) => (
            <TechBadge key={badge.label} badge={badge} size={20} />
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-center sm:mt-3">
          <a
            href={engagement.reportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 items-center gap-2.5 rounded-lg border border-panel-strong px-3 font-mono text-[11px] uppercase tracking-wide text-ink transition-[color,background-color,transform,border-color] duration-300 ease-out hover:scale-105 hover:border-ink hover:bg-ink hover:text-card sm:h-9 sm:gap-3 sm:px-4 sm:text-xs"
          >
            <ArrowSquareOutIcon size={13} />
            View Report
          </a>
        </div>
      </div>
    </div>
  );
}

export function SecurityExperience() {
  return (
    <div className="mx-auto max-w-[600px] px-3 sm:px-8">
      <DepthStackCarousel
        items={engagements}
        getKey={(engagement) => engagement.title}
        ariaLabel="Cybersecurity engagements"
        renderCard={(engagement) => <EngagementCard engagement={engagement} />}
      />
    </div>
  );
}
