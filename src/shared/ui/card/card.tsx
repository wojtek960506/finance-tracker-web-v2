import clsx from 'clsx';
import type { ReactNode } from 'react';

type CardProps = {
  className?: string;
  children: ReactNode;
};

export const Card = ({ className = '', children }: CardProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col border border-fg bg-modal-bg',
        'rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-4 gap-1 sm:gap-2 ',
        'shadow-[0_12px_30px_-20px_rgba(0,0,0,0.35)]',
        'dark:shadow-[0_12px_30px_-20px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {children}
    </div>
  );
};
