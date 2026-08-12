import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Registers this project's custom `--text-*` / `--spacing-*` theme keys (see
// app/globals.css) so tailwind-merge doesn't mistake them for arbitrary text
// colors and drop real `text-*` color classes when merging component props.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "code-md",
        "body-md",
        "label-sm",
        "headline-lg-mobile",
        "headline-lg",
        "display-lg",
      ],
      spacing: ["margin-mobile", "gutter", "section-gap"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
