import clsx from "clsx";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavigationItemProps = {
  to: string,
  handleIsDrawerOpen: (val: boolean) => void,
  children: ReactNode,
}

export const NavigationItem = ({
  to,
  handleIsDrawerOpen,
  children,
}: NavigationItemProps) => {

  const commonClassName = "w-full p-1 rounded-md flex justify-between"

  // nav link takes background of parent when not hovered
  // for hovering prepare some constant values in `index.css` to work well with dark/side mode
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive
        ? clsx("text-blue-500 font-bold hover:bg-fg/50  hover:text-blue-200", commonClassName)
        : clsx("hover:bg-fg/50", commonClassName)}
      onClick={() => { handleIsDrawerOpen(false)}}
    >
      {children}
    </NavLink>
  )
}
