import clsx from "clsx";
import { Topbar } from "./topbar";
import { useAuthToken } from "@/hooks";
import { type ReactNode } from "react";
import { Drawer } from "@components/ui";
import { useUIStore } from "@/store/ui-store";
import { Menu, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/theme-context";
import { Navigation } from "@components/navigation";
import { LanguageSwitcher } from "./language-switcher";


export const MobileLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const { t } = useTranslation();
  
  const { authToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  const centralizeTitleClass = "min-w-50 items-center"; 

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        
        <div className={clsx(centralizeTitleClass)}>
          <button
            onClick={() => setIsNavOpen(true)}
            className={clsx(
              "p-1 cursor-pointer border border-fg",
              `${isAuthenticated ? "visible" : "invisible"}`
            )}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text">{t('title')}</h1>

        <div className={clsx("flex justify-end gap-3", centralizeTitleClass)}>
          <LanguageSwitcher />
          <button onClick={toggleTheme} className="p-1 cursor-pointer border border-fg">
            {theme === "dark" ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </button>
        </div>
      </Topbar>

      <main className="p-4 h-full"> {/* p-1 == p-[0.25rem] == p-[4px] */}
        {children}
      </main>

      <Drawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)}>
        <Navigation />
      </Drawer>
    </div>
  );
}
