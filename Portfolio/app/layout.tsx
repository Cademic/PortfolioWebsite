import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-hanken-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Carter Wright | Portfolio",
  description: "Full-stack software developer & Cybersecurity analyst",
  // og:image / twitter:image are supplied automatically by app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: "Carter Wright | Portfolio",
    title: "Carter Wright | Portfolio",
    description: "Full-stack software developer & Cybersecurity analyst",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carter Wright | Portfolio",
    description: "Full-stack software developer & Cybersecurity analyst",
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "scroll-smooth", hankenGrotesk.variable, jetbrainsMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
