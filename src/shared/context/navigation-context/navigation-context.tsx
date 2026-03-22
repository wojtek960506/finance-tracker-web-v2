import { createContext } from "react";


export const NavigationContext = createContext<{ fromLeft: boolean }>({ fromLeft: true });
