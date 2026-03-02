import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";


type CollapsibleProps = {
  header: ReactNode,
  children: ReactNode,
}

export const Collapsible = ({ header, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="px-1 py-2"
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          aria-expanded={isOpen}
          aria-controls="collapsible-submenu"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <ChevronRight
            className={clsx(
              "h-4 w-4 cursor-pointer transition-transform duration-300 ease-out",
              isOpen && "rotate-90",
            )}
          />
        </button>
        {header}
      </div>
      <div
        className={clsx(
          "pl-9 space-y-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
