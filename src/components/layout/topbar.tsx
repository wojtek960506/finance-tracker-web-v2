import clsx from "clsx";
import type { ReactNode } from "react";


export const Topbar = ({ children }: { children: ReactNode }) => {
  return (
    <header className={clsx(
      "sticky top-0 z-50 h-[var(--topbar-h)] px-4 border-b border-foreground",
      "flex justify-between items-center text-foreground bg-background"
    )}>
      {children}
    </header>
  )
}
