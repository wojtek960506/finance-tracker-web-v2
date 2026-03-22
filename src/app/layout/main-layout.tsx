import { type ReactNode } from "react";

import { Navigation } from "@app/navigation";
import { NavigationProvider } from "@context/navigation-context";
import { useUIStore } from "@store/ui-store";
import { Drawer } from "@ui";

import { Topbar } from "./topbar";


export const MainLayout = ({ children }: { children: ReactNode }) => {  
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const isDrawerFromLeft = true;
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />

      <main className="p-4 h-full"> {/* p-1 == p-[0.25rem] == p-[4px] */}
        {children}
      </main>

      <Drawer isOpen={isNavOpen} fromLeft={isDrawerFromLeft} onClose={() => setIsNavOpen(false)}>
        <NavigationProvider fromLeft={isDrawerFromLeft}>
          <Navigation />
        </NavigationProvider>
      </Drawer>
    </div>
  );
}
