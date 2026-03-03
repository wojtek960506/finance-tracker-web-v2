import { Title } from "./title";
import { Topbar } from "./topbar";
import { NavButton } from "./nav-button";
import { ThemeButton } from "./theme-button";
import { LanguageSwitcher } from "./language-switcher";


export const DesktopTopbar = () => (
  <Topbar>
    <div className="flex justify-between items-center w-full">
      <div className="flex">
        <NavButton />
        <div className="invisible"></div>
      </div>
      <Title />
      <div className="flex">
        <LanguageSwitcher />
        <ThemeButton />
      </div>
    </div>
  </Topbar>
);
