import clsx from "clsx";
import { Topbar } from "./topbar";
import { useAuthToken } from "@/hooks";
import { type ReactNode } from "react";
import { Drawer } from "@components/ui";
import { useUIStore } from "@/store/ui-store";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@context/theme-context";
import { Navigation } from "@components/navigation";


export const MobileLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const { isNavOpen, setIsNavOpen } = useUIStore();
  
  const { authToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        <button
          onClick={() => setIsNavOpen(true)}
          className={clsx("p-4 cursor-pointer", `${isAuthenticated ? "visible" : "invisible"}`)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text">Finance Tracker</h1>
        <button onClick={toggleTheme} className="p-4 cursor-pointer">
          {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
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
