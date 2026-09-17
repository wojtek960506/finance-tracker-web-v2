import clsx from 'clsx';
import type { ReactNode } from 'react';

import { Card } from '@shared/ui';

type InvestmentCardProps = {
  isSnapshot?: boolean;
  className?: string;
  testId?: string;
  children: ReactNode;
};

export const InvestmentCard = ({
  isSnapshot = false,
  className,
  testId,
  children,
}: InvestmentCardProps) => {
  return (
    <Card
      className={clsx(
        'flex flex-col justify-between gap-3 p-4 sm:p-5',
        'transition-all hover:shadow-sm',
        isSnapshot
          ? clsx(
              'border-sky-500/25 bg-sky-500/[0.03] hover:border-sky-500/50',
              'dark:border-sky-500/30 dark:bg-sky-950/20 dark:hover:border-sky-500/60',
            )
          : 'border-fg/15 hover:border-fg/40',
        className,
      )}
      data-testid={testId}
    >
      {children}
    </Card>
  );
};
