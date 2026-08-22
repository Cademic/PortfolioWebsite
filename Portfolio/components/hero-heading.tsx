"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export function HeroHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <h1>
      <DiaTextReveal text={text} className={className} />
    </h1>
  );
}
