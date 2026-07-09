import clsx from 'clsx';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button } from '@ui';

type DrawerHeaderProps = {
  fromLeft: boolean;
  onClose: () => void;
  headerLeft?: ReactNode;
};

export const DrawerHeader = ({ fromLeft, onClose, headerLeft }: DrawerHeaderProps) => (
  <div
    className={clsx(
      'flex p-2 h-[var(--topbar-h)] sm:h-[var(--topbar-h-sm)] border-b border-foreground',
      'min-h-[var(--topbar-h)] sm:min-h-[var(--topbar-h-sm)]',
      headerLeft
        ? 'items-center justify-between gap-2'
        : fromLeft
          ? 'justify-end'
          : 'justify-start',
    )}
  >
    {headerLeft ? <div className="flex items-center gap-1">{headerLeft}</div> : null}
    <Button
      type="button"
      onClick={onClose}
      variant="ghost"
      aria-label="Close drawer"
      className={fromLeft ? 'mx-2' : 'mx-1'}
    >
      <X className="h-6 w-6" />
    </Button>
  </div>
);
