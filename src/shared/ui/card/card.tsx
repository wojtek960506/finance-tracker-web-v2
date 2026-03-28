import { forwardRef, type ReactNode } from 'react';

import { cn } from '@shared/utils';

type CardProps = {
  className?: string;
  children: ReactNode;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col border border-fg bg-modal-bg',
          'rounded-2xl sm:rounded-3xl p-3 sm:p-4 gap-1 sm:gap-2 ',
          'shadow-[0_12px_30px_-20px_rgba(0,0,0,0.35)]',
          'dark:shadow-[0_12px_30px_-20px_rgba(0,0,0,0.7)]',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);
