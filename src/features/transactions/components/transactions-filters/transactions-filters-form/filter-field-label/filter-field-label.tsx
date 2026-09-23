import clsx from 'clsx';
import type { ReactNode } from 'react';

import { ActiveFilterIndicator } from '../active-filter-indicator';

type FilterFieldLabelProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  isActive?: boolean;
};

export const FilterFieldLabel = ({
  title,
  children,
  className,
  titleClassName = 'font-semibold',
  isActive = false,
}: FilterFieldLabelProps) => {
  return (
    <div
      className={clsx(
        'flex min-w-0 max-w-full flex-col gap-1 text-sm sm:text-base',
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className={clsx(titleClassName, isActive && 'text-foreground font-bold')}>
          {title}
        </span>
        {isActive && <ActiveFilterIndicator />}
      </div>
      {children}
    </div>
  );
};
