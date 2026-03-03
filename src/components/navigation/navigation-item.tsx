import clsx from "clsx";
import { Button } from "@components/ui";
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

  // nav link takes background of parent when not hovered
  // for hovering prepare some constant values in `index.css` to work well with dark/side mode
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? clsx("text-blue-500 w-full") : clsx("w-full")}
      onClick={() => {
        setIsNavOpen(false);
        additionalAction?.();
      }}
    >
      <Button className="w-full justify-between gap-2" variant="ghost">
        {title}
        {Icon ? <Icon className="w-8 h-8" /> : <div className="w-8 h-8" />}
      </Button>
    </NavLink>
  )
}
