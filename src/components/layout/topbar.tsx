import clsx from "clsx";
import type { ReactNode } from "react";


export const Topbar = ({ children }: { children: ReactNode }) => {
  return (
    <header className={clsx(
      "sticky top-0 z-50 min-h-[var(--topbar-h)] border-b border-foreground px-3",
      "flex justify-between items-center text-foreground bg-background"
    )}>
      {children}
    </header>
  )
}
