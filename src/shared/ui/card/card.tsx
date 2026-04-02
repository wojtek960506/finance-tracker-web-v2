import { type ComponentProps, forwardRef } from 'react';

import { cn } from '@shared/utils';

type CardProps = ComponentProps<'div'>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        {...props}
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
