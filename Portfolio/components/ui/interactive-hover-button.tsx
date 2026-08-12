import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

type InteractiveHoverButtonProps = {
  children: React.ReactNode
  className?: string
} & (
  | ({ href: string } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "className" | "children" | "href"
    >)
  | ({ href?: undefined } & Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "className" | "children"
    >)
)

export function InteractiveHoverButton({
  children,
  className,
  href,
  ...props
}: InteractiveHoverButtonProps) {
  const sharedClassName = cn(
    "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
    className
  )

  const content = (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-600 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRightIcon />
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={sharedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      className={sharedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
