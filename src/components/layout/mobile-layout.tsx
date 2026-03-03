import clsx from "clsx";
import { Topbar } from "./topbar";
import { useAuthToken } from "@/hooks";
import { type ReactNode } from "react";
import { useUIStore } from "@/store/ui-store";
import { Menu, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Drawer } from "@components/ui";
import { useTheme } from "@context/theme-context";
import { Navigation } from "@components/navigation";
import { LanguageSwitcher } from "./language-switcher";


export const MobileLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const { t } = useTranslation();
  
  const { authToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  const centralizeTitleClass = " items-center"; 

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        <h1 className="text-2xl font-bold text">{t('title')}</h1>
        
        <div className={clsx("flex justify-between", centralizeTitleClass)}>
          
          <LanguageSwitcher />
          
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </Button>
  
          <Button
            onClick={() => setIsNavOpen(true)}
            className={clsx(`${isAuthenticated ? "visible" : "hidden"}`)}
            variant="ghost"
          >
            <Menu className="w-8 h-8" />
          </Button>
          
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
