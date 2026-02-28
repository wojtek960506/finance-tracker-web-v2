import { ThemeContext } from "./theme-context";
import { useEffect, type ReactNode } from "react";
import { THEME_STORE_KEY, useThemeStore } from "@store/theme-store";


export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleThemeStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORE_KEY) useThemeStore.persist.rehydrate();
    }

    window.addEventListener("storage", handleThemeStorageChange);
    return () => { window.removeEventListener("storage", handleThemeStorageChange) }
  }, []);

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
