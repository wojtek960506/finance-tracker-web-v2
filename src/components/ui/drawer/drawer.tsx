import clsx from "clsx";
import { X } from "lucide-react";
import type { ReactNode } from "react";


type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Drawer = ({ isOpen, onClose, children }: DrawerProps) => (
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
        "z-100 fixed top-0 left-0 h-full w-64 bg-bg shadow-lg transform duration-300",
        `transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
      )}
    >
      <div className="flex p-2 justify-end h-[var(--topbar-h)] border-b border-foreground">
        <button onClick={onClose} className="p-2 cursor-pointer">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="px-4 py-2">
        {children}
      </nav>
    </div>
  </>
)
