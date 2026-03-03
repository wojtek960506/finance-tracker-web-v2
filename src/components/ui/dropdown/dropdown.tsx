import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

export const Dropdown = ({ trigger, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <div 
        onClick={() => { setIsOpen((prev) => !prev) }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            "absolute right-0 top-full mt-2 bg-bg text-fg shadow-lg rounded-md z-150",
            "border border-fg"
          )}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                "px-4 py-2 hover:bg-fg/10 cursor-pointer rounded",
                "flex gap-4 justify-start items-center",
              )}
              onClick={() => {
                item.onSelect();
                setIsOpen(false);
              }}
            >
              
              {item.icon}
              {item.label}
            </div>
          ))}

        </div>
      )}
    </div>
  )
}
