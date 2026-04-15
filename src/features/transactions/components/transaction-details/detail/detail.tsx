import clsx from 'clsx';
import type { ReactNode } from 'react';

export const Detail = ({
  title,
  children,
  titleClassName,
  valueClassName,
}: {
  title: string;
  children: ReactNode;
  titleClassName?: string;
  valueClassName?: string;
}) => {
  return (
    <div className="flex flex-col gap-0">
      <span className={clsx('text-text-muted text-left text-sm', titleClassName)}>
        {title}
      </span>
      <span className={clsx('text-base sm:text-lg', valueClassName)}>{children}</span>
    </div>
  );
};
