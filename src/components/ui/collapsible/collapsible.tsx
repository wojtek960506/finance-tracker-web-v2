import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";


type CollapsibleProps = {
  header: ReactNode,
  content: ReactNode[],
}

export const Collapsible = ({ header, content }: CollapsibleProps) => {
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
              "h-4 w-4 transition-transform cursor-pointer",
              isOpen && "rotate-90",
            )}
          />
        </button>
        {header}
      </div>
      <ul className={clsx("pl-9 space-y-1", !isOpen && "hidden")}>
        {content.map((node, index) => (<li key={index}>{node}</li>))}
      </ul>
    </div>
  )
}
