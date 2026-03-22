import clsx from "clsx";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@ui";


type DrawerProps = {
  isOpen: boolean;
  fromLeft: boolean; 
  onClose: () => void;
  children: ReactNode;
}

export const Drawer = ({ isOpen, fromLeft, onClose, children }: DrawerProps) => (
  <>
    {/* Overlay */}
    <div
      className={clsx(
        "z-100 fixed inset-0 bg-fg/50 transition-opacity duration-300",
        `${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
      )}
      onClick={onClose}
    />

    {/* Drawer panel */}
    <div
      className={clsx(
        "z-100 fixed top-0 h-full min-w-64 bg-bg shadow-lg transform ",
        'transition-transform duration-300',
        fromLeft ? "left-0" : "right-0",
        `${fromLeft
          ? (isOpen ? "translate-x-0" : "-translate-x-full")
          : (isOpen ? "translate-x-0" : "translate-x-full")}`,
      )}
    >
      <div className={clsx(
        "flex p-2 h-[var(--topbar-h)] border-b border-foreground",
        "min-h-[var(--topbar-h)] md:min-h-[var(--topbar-h-md)]",
        fromLeft ? "justify-end" : "justify-start",
      )}>
        <Button onClick={onClose} variant="ghost" className={fromLeft ? "mx-2" : "mx-1"}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      <nav className="px-4 py-2">
        {children}
      </nav>
    </div>
  </>
)
