import clsx from 'clsx';
import type { MouseEvent, ReactNode } from 'react';

import { Card } from '@shared/ui';

type InvestmentCardProps = {
  isSnapshot?: boolean;
  className?: string;
  testId?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

export const InvestmentCard = ({
  isSnapshot = false,
  className,
  testId,
  onClick,
  children,
}: InvestmentCardProps) => {
  return (
    <Card
      className={clsx(
        'flex w-full flex-col justify-between sm:gap-1 p-4 sm:p-5',
        'transition-all hover:shadow-sm',
        isSnapshot
          ? clsx(
              'border-sky-500/25 bg-sky-500/[0.03] hover:border-sky-500/50',
              'dark:border-sky-500/30 dark:bg-sky-950/20 dark:hover:border-sky-500/60',
            )
          : 'border-fg/15 hover:border-fg/40',
        className,
      )}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </Card>
  );
};
