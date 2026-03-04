import { type ReactNode } from "react";
import { Drawer } from "@components/ui";
import { useUIStore } from "@/store/ui-store";
import { IS_DESKTOP_MEDIA_QUERY } from "@/consts";
import { Navigation } from "@components/navigation";
import { MobileTopbar, DesktopTopbar } from "./topbar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { NavigationProvider } from "@/context/navigation-context";


export const MainLayout = ({ children }: { children: ReactNode }) => {  
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const isDesktop = useMediaQuery(IS_DESKTOP_MEDIA_QUERY);
  
  return (
    <div className="flex h-screen flex-col overflow-hidden">

      {isDesktop ? <DesktopTopbar /> : <MobileTopbar />}

      <main className="p-4 h-full"> {/* p-1 == p-[0.25rem] == p-[4px] */}
        {children}
      </main>

      <Drawer isOpen={isNavOpen} fromLeft={isDesktop} onClose={() => setIsNavOpen(false)}>
        <NavigationProvider fromLeft={isDesktop}>
          <Navigation />
        </NavigationProvider>
      </Drawer>
    </div>
  );
}
