import clsx from 'clsx';
import type { RefObject } from 'react';

import { useAuthToken } from '@shared/hooks';

import { LanguageSwitcher } from './language-switcher';
import { NavButton } from './nav-button';
import { ThemeButton } from './theme-button';
import { Title } from './title';

export const Topbar = ({
  navButtonRef,
}: {
  navButtonRef?: RefObject<HTMLButtonElement | null>;
}) => {
  const { isAuthenticated } = useAuthToken();

  return (
    <header
      className={clsx(
        'sticky top-0 z-200 border-b border-fg px-3',
        'grid grid-cols-[1fr_auto_1fr] items-center',
        'min-h-[var(--topbar-h)] sm:min-h-[var(--topbar-h-sm)]',
      )}
    >
      <div className="flex justify-self-start">
        <NavButton ref={navButtonRef} />
      </div>
      <Title />
      <div
        className={clsx(
          'justify-self-end',
          isAuthenticated ? 'hidden md:flex' : 'flex',
        )}
      >
        <LanguageSwitcher />
        <ThemeButton />
      </div>
    </header>
  );
};
