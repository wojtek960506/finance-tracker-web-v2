import { Moon, Sun } from "lucide-react";
import { Button } from "@ui";
import { ICON_CLASS_NAME } from "@shared/consts";
import { useTheme } from "@context/theme-context";


export const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === "dark"
        ? <Sun className={ICON_CLASS_NAME} />
        : <Moon className={ICON_CLASS_NAME} />}
    </Button>
  )
}
