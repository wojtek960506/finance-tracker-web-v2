import clsx from "clsx";
import { Button } from "@ui";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


type CollapsibleProps = {
  header: ReactNode,
  indicatorPosition: "left" | "right",
  children: ReactNode,
  isInitiallyOpen?: boolean, 
}

export const Collapsible = ({
  header,
  indicatorPosition,
  children,
  isInitiallyOpen,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen ?? false);

  const isIndicatorLeft = indicatorPosition === "left";
  const Comp = isIndicatorLeft ? ChevronRight : ChevronLeft;

  return (
    <div>
      <div className={clsx(
        "flex items-center w-full", isIndicatorLeft ? "" : "flex-row-reverse")
      }>
        <Button
          variant="ghost"
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          aria-expanded={isOpen}
          aria-controls="collapsible-submenu"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <Comp
            className={clsx(
              "h-4 w-4 cursor-pointer transition-transform duration-300 ease-out",
              isOpen && (isIndicatorLeft ? "rotate-90" : "-rotate-90"),
            )}
          />
        </Button>
        {header}
      </div>
      <div
        className={clsx(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          isIndicatorLeft ? "pl-10 " : "pr-10"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
