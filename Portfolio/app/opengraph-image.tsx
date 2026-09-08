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
const ACCENT = "#46949e";

const fontDir = join(process.cwd(), "assets", "fonts");
const [monoBold, sansRegular] = await Promise.all([
  readFile(join(fontDir, "JetBrainsMono-Bold.ttf")),
  readFile(join(fontDir, "HankenGrotesk-Regular.ttf")),
]);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          background: PAPER,
          color: INK,
          fontFamily: "Hanken Grotesk",
          padding: "0 96px",
        }}
      >
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
        <div style={{ width: 220, height: 8, background: ACCENT, margin: "32px 0 30px" }} />
        <div style={{ fontSize: 40, color: INK_MUTED }}>
          Full-stack software developer &middot; Cybersecurity analyst
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
        { name: "Hanken Grotesk", data: sansRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
