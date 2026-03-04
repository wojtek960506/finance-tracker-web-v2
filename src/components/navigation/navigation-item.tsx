import clsx from "clsx";
import { Button } from "@components/ui";
import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { ICON_CLASS_NAME } from "@/consts";
import { useUIStore } from "@/store/ui-store";
import { useNavigation } from "@/context/navigation-context";


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
  const { fromLeft } = useNavigation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? clsx("text-active-nav w-full") : clsx("w-full")}
      onClick={() => {
        setIsNavOpen(false);
        additionalAction?.();
      }}
    >
      <Button
        className={clsx(
          "w-full justify-between gap-3 md:gap-4", fromLeft ? "" : "flex-row-reverse"
        )}
        variant="ghost"
      >
        {title}
        {Icon ? <Icon className={ICON_CLASS_NAME} /> : <div className={ICON_CLASS_NAME} />}
      </Button>
    </NavLink>
  )
}
