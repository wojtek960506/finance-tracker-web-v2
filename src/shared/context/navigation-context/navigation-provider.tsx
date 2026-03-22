import type { ReactNode } from "react";
import { NavigationContext } from "./navigation-context";


type NavigationProviderProps = {
  fromLeft: boolean;
  children: ReactNode;
};

export const NavigationProvider = ({ fromLeft, children }: NavigationProviderProps) => {
  return (
  <NavigationContext.Provider value={{ fromLeft }}>
    {children}
  </NavigationContext.Provider>
  )
}
