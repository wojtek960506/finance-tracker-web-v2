import { ThemeContext } from "./theme-context";
import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@store/theme-store";


export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
