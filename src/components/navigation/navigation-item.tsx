import clsx from "clsx";
import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { useUIStore } from "@/store/ui-store";


type NavigationItemProps = {
  to: string,
  title: string,
  Icon?: ComponentType<{ className?: string }>,
  additionalAction?: () => void;
}

export const NavigationItem = ({
  to,
  title,
  additionalAction,
  Icon,
}: NavigationItemProps) => {

  const { setIsNavOpen } = useUIStore();

  const commonClassName = "w-full p-1 rounded-md flex justify-between"

  // nav link takes background of parent when not hovered
  // for hovering prepare some constant values in `index.css` to work well with dark/side mode
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive
        ? clsx("text-blue-500 font-bold hover:bg-fg/50  hover:text-blue-200", commonClassName)
        : clsx("hover:bg-fg/50", commonClassName)}
      onClick={() => {
        setIsNavOpen(false);
        additionalAction?.();
      }}
    >
      {title}
      {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6" />}
    </NavLink>
  )
}
