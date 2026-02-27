import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Theme, type ThemeContextType } from "@context/theme-context";


type ThemeState = Pick<ThemeContextType, "theme" | "toggleTheme">;

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: "light" as Theme,
      toggleTheme: () => set(
        state => ({ theme: state.theme === "light" ? "dark" : "light"  })
      ),
    }),
    { name: "theme-store" }
  )
);
