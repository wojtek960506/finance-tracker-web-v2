import clsx from "clsx";
import { Topbar } from "./topbar";
import { useAuthToken } from "@/hooks";
import { Drawer } from "@components/ui";
import { Menu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { useTheme } from "@context/theme-context";
import { useQueryClient } from "@tanstack/react-query";


export const MobileLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  
  const navigate = useNavigate();
  const { authToken, removeAuthToken } = useAuthToken();
  const queryClient = useQueryClient();
  const isAuthenticated = !!authToken;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar>
        <button
          onClick={() => setIsOpen(true)}
          className={clsx("p-4 cursor-pointer", `${isAuthenticated ? "visible" : "visible"}`)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text">Finance Tracker</h1>
        <button onClick={toggleTheme} className="p-4 cursor-pointer">
          {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </Topbar>

      <main className="p-[calc(1.25rem-0.25rem)] h-full"> {/* p-1 == p-[0.25rem] == p-[4px] */}
        {children}
      </main>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ul className="space-y-2">
          {isAuthenticated
            ? <>
              <li>Transactions</li>
              <li>Vehicles</li>
              <li>Sports</li>
              <li>Settings</li>
              <li>
                <button
                  className={clsx(
                    "border border-fg py-2 px-4 rounded-xl mt-1 bg-bg hover:bg-fg/20",
                    "cursor-pointer"
                  )}
                  onClick={() => {
                    removeAuthToken();
                    queryClient.clear();
                    setIsOpen(false);
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
            : <>
              <li>Language</li>
            </>
          }
        </ul>
      </Drawer>
    </div>
  );
}
