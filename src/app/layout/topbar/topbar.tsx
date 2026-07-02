import clsx from 'clsx';
import type { RefObject } from 'react';

import { useAuthToken } from '@shared/hooks';

import { BrandLink } from './brand-link';
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
        'sticky top-0 z-200 border-b px-3',
        isAuthenticated
          ? 'border-fg'
          : [
              'border-[#d9e5b8]/70 bg-white/55 backdrop-blur-xl shadow-[0_8px_30px_-18px_rgba(111,146,40,0.45)]',
              'dark:border-[#243118]/70 dark:bg-[#0d1306]/55 dark:shadow-[0_8px_30px_-18px_rgba(0,0,0,0.65)]',
            ].join(' '),
        'grid grid-cols-[1fr_auto_1fr] items-center',
        'min-h-[var(--topbar-h)] sm:min-h-[var(--topbar-h-sm)]',
      )}
    >
      <div className="flex items-center justify-self-start">
        <NavButton ref={navButtonRef} />
        <div className={clsx(isAuthenticated ? 'hidden md:flex' : 'flex')}>
          <BrandLink logoClassName="h-7 sm:h-8" />
        </div>
      </div>
      <Title />
      <div
        className={clsx('justify-self-end', isAuthenticated ? 'hidden md:flex' : 'flex')}
      >
        <LanguageSwitcher />
        <ThemeButton />
      </div>
    </header>
  );
};
