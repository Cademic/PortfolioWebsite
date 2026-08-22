import React from "react"

import { cn } from "@/lib/utils"

type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"

type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text: string
  as?: As
}

export function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}: KineticTextProps) {
  const mergedStyle = {
    "--hover-padding": "calc(1em / 9)",
    "--text-stroke-width": "calc(1em * 75 / 6000)",
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties

  const letterClassName =
    "[will-change:font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.4s,_-webkit-text-stroke-color_0.4s,_padding_0.4s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-color:currentcolor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] has-[+span+span:hover]:font-[600] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[600] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[600] [:hover+span+&]:font-[600]"

  return (
    <Tag
      {...rest}
      className={cn("flex flex-wrap font-[300]", className)}
      style={mergedStyle}
    >
      {text.split(/(\s+)/).map((chunk, chunkIndex) => {
        const letters = chunk.split("").map((letter, letterIndex) => (
          <span
            key={letterIndex}
            aria-hidden="true"
            className={letterClassName}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))

        if (/^\s+$/.test(chunk)) {
          return <React.Fragment key={chunkIndex}>{letters}</React.Fragment>
        }

        return (
          <span key={chunkIndex} className="inline-flex">
            {letters}
          </span>
        )
      })}
      <span className="sr-only">{text}</span>
    </Tag>
  )
}
