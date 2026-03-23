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
        'flex flex-col border border-fg rounded-3xl p-4 gap-2 bg-modal-bg',
        'shadow-[0_12px_30px_-20px_rgba(0,0,0,0.35)]',
        'dark:shadow-[0_12px_30px_-20px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {children}
    </div>
  );
};
