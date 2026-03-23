import clsx from 'clsx';

import { LanguageSwitcher } from './language-switcher';
import { NavButton } from './nav-button';
import { ThemeButton } from './theme-button';
import { Title } from './title';

export const Topbar = () => {
  return (
    <header
      className={clsx(
        'sticky top-0 z-50 border-b border-foreground px-3',
        'grid grid-cols-[1fr_auto_1fr] items-center text-foreground bg-background',
        'min-h-[var(--topbar-h)] md:min-h-[var(--topbar-h-md)]',
      )}
    >
      <div className="flex justify-self-start">
        <NavButton />
      </div>
      <Title />
      <div className="flex justify-self-end">
        <LanguageSwitcher />
        <ThemeButton />
      </div>
    </header>
  );
};
