import clsx from 'clsx';
import type { ReactNode } from 'react';

type FilterFieldLabelProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
};

export const FilterFieldLabel = ({
  title,
  children,
  className,
  titleClassName = 'font-semibold',
}: FilterFieldLabelProps) => {
  return (
    <div
      className={clsx(
        'flex min-w-0 max-w-full flex-col gap-1 text-sm sm:text-base',
        className,
      )}
    >
      <span className={titleClassName}>{title}</span>
      {children}
    </div>
  );
};
