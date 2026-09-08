import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Route metadata — mirrors the site's own <title>/description.
export const alt = "Carter Wright — Full-stack software developer & Cybersecurity analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Design tokens lifted straight from app/globals.css (:root, the light "paper" theme).
const PAPER = "#f8f9fa";
const INK = "#111827";
const INK_MUTED = "#4b5563";
const INK_FAINT = "#9aa1ab";
const ACCENT = "#46949e";

const fontDir = join(process.cwd(), "assets", "fonts");
const [monoBold, monoMedium, sansExtraBold, sansRegular] = await Promise.all([
  readFile(join(fontDir, "JetBrainsMono-Bold.ttf")),
  readFile(join(fontDir, "JetBrainsMono-Medium.ttf")),
  readFile(join(fontDir, "HankenGrotesk-ExtraBold.ttf")),
  readFile(join(fontDir, "HankenGrotesk-Regular.ttf")),
]);

// 30px dashed grid, matching <GridPattern> behind the Projects section.
const gridSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><path d='M30 0H0V30' fill='none' stroke='${INK}' stroke-opacity='0.09' stroke-width='1' stroke-dasharray='4 2'/></svg>`;
const gridUri = `data:image/svg+xml;base64,${Buffer.from(gridSvg).toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: PAPER,
          color: INK,
          fontFamily: "Hanken Grotesk",
          padding: "72px 80px",
        }}
      >
        {/* dashed grid wash + radial fade toward the edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${gridUri})`,
            backgroundRepeat: "repeat",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1000px circle at 30% 42%, transparent 0%, rgba(248,249,250,0.72) 82%)",
          }}
        />
        {/* accent stripe on the right, echoing the teal CTA */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: "100%",
            background: ACCENT,
          }}
        />

        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, background: ACCENT }} />
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: INK_MUTED,
            }}
          >
            Portfolio
          </div>
        </div>

        {/* name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: 30,
              color: INK_MUTED,
              marginBottom: 12,
            }}
          >
            Hi, I&apos;m
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
              fontSize: 116,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Carter Wright
          </div>
          <div style={{ width: 220, height: 8, background: ACCENT, margin: "28px 0 26px" }} />
          <div style={{ fontSize: 36, color: INK_MUTED }}>
            Full-stack software developer &middot; Cybersecurity analyst
          </div>
        </div>

        {/* footer: CTA pills mirroring the hero buttons + handle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <div
              style={{
                display: "flex",
                background: ACCENT,
                color: "#ffffff",
                fontFamily: "JetBrains Mono",
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "18px 34px",
                borderRadius: 8,
              }}
            >
              View Projects
            </div>
            <div
              style={{
                display: "flex",
                color: INK,
                fontFamily: "JetBrains Mono",
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "18px 34px",
                borderRadius: 8,
                border: `1px solid ${INK}`,
              }}
            >
              Contact
            </div>
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: 20,
              color: INK_FAINT,
            }}
          >
            github.com/cademic
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: monoMedium, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
        { name: "Hanken Grotesk", data: sansRegular, weight: 400, style: "normal" },
        { name: "Hanken Grotesk", data: sansExtraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
