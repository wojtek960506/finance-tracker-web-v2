import { type ReactNode } from "react";
import { Drawer } from "@components/ui";
import { useUIStore } from "@/store/ui-store";
import { Navigation } from "@components/navigation";
import { MobileTopbar, DesktopTopbar } from "./topbar";


export const MainLayout = ({ children }: { children: ReactNode }) => {  
  const { isNavOpen, setIsNavOpen } = useUIStore();
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      
      <div className="block md:hidden"><MobileTopbar /></div>
      <div className="hidden md:block"><DesktopTopbar /></div>

      <main className="p-4 h-full"> {/* p-1 == p-[0.25rem] == p-[4px] */}
        {children}
      </main>

      <Drawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)}>
        <Navigation />
      </Drawer>
    </div>
  );
}
