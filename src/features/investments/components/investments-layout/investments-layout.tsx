import clsx from 'clsx';
import type { ReactNode } from 'react';

import { InvestmentsTabs } from './investments-tabs';

type InvestmentsLayoutProps = {
  children: ReactNode;
};

export const InvestmentsLayout = ({ children }: InvestmentsLayoutProps) => {
  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full max-w-6xl',
        'flex-col gap-4 overflow-hidden',
      )}
    >
      <div className="px-1 pt-1">
        <InvestmentsTabs />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-1">{children}</div>
    </div>
  );
};
