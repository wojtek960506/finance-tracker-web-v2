import clsx from "clsx";
import type { ReactNode } from "react";


export const Topbar = ({ children }: { children: ReactNode }) => {
  return (
    <header className={clsx(
      "sticky top-0 z-50 border-b border-foreground px-3",
      "flex justify-between items-center text-foreground bg-background",
      "min-h-[var(--topbar-h)] md:min-h-[var(--topbar-h-md)]",
    )}>
      {children}
    </header>
  )
}
