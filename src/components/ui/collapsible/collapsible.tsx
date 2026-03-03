import clsx from "clsx";
import { Button } from "@components/ui";
import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";


type CollapsibleProps = {
  header: ReactNode,
  children: ReactNode,
}

export const Collapsible = ({ header, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <div className="flex items-center w-full">
        <Button
          variant="ghost"
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
        </Button>
        {header}
      </div>
      <div
        className={clsx(
          "pl-9 grid transition-[grid-template-rows,opacity] duration-300 ease-out",
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
