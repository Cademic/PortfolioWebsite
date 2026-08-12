"use client";

import { useEffect, useState } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { KineticText } from "@/components/ui/kinetic-text";

const REVEAL_DURATION_MS = 1700;

export function HeroHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1>
      {revealed ? (
        <KineticText
          text={text}
          as="span"
          className={className}
        />
      ) : (
        <DiaTextReveal text={text} className={className} />
      )}
    </h1>
  );
}
