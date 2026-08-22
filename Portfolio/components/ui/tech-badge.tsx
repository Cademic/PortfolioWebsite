"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export type Badge = { label: string; color: string; logo?: string; logoColor?: string };

// shields.io's static badge path uses "-" as a field separator, so a literal
// hyphen in the label (e.g. "Hyper-V") must be escaped as "--" or it gets
// parsed as an extra label/message/color segment.
function escapeBadgeSegment(segment: string): string {
  return segment.replace(/-/g, "--");
}

export function badgeUrl({ label, color, logo, logoColor = "white" }: Badge): string {
  const params = new URLSearchParams({ style: "for-the-badge", logoColor });
  if (logo) params.set("logo", logo);
  return `https://img.shields.io/badge/${encodeURIComponent(escapeBadgeSegment(label))}-${color}?${params.toString()}`;
}

export function TechBadge({ badge, size = 28 }: { badge: Badge; size?: number }) {
  const [loaded, setLoaded] = useState(false);

  // Cached images can finish loading before React attaches the onLoad
  // listener, so the event never fires. This ref callback catches that
  // case by checking `complete` as soon as the node mounts.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center", !loaded && "overflow-hidden")}
      style={{ height: size, width: loaded ? undefined : size * 2.86 }}
    >
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-skeleton rounded bg-panel-strong"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={badgeUrl(badge)}
        alt={badge.label}
        height={size}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ height: size }}
        className={cn(
          "w-auto rounded transition-opacity duration-300 ease-out hover:scale-110",
          loaded ? "opacity-100" : "absolute inset-0 opacity-0"
        )}
      />
    </span>
  );
}
