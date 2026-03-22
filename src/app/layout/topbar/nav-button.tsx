import clsx from "clsx";
import { Menu } from "lucide-react";
import { useAuthToken } from "@shared/hooks";
import { Button } from "@ui";
import { ICON_CLASS_NAME } from "@shared/consts";
import { useUIStore } from "@store/ui-store";


export const NavButton = () => {

  const { setIsNavOpen } = useUIStore();
  const { isAuthenticated } = useAuthToken();

  return (
    <Button
      onClick={() => setIsNavOpen(true)}
      className={clsx(`${isAuthenticated ? "visible" : "hidden md:block md:invisible"}`)}
      variant="ghost"
    >
      <Menu className={ICON_CLASS_NAME} />
    </Button>
  )
}
