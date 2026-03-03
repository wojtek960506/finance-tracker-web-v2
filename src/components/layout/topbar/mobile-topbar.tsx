import { Title } from "./title";
import { Topbar } from "./topbar";
import { NavButton } from "./nav-button";
import { ThemeButton } from "./theme-button";
import { LanguageSwitcher } from "./language-switcher";


export const MobileTopbar = () => (
  <Topbar>
    <Title />
    <div className="flex">        
      <LanguageSwitcher />
      <ThemeButton />
      <NavButton />
    </div>
  </Topbar>
)
