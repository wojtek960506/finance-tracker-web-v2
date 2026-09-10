import clsx from 'clsx';

import { InstrumentsList } from '@features/investments/components';

export const InvestmentsPage = () => {
  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full max-w-6xl',
        'flex-col gap-4 overflow-hidden',
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        <InstrumentsList />
      </div>
    </div>
  );
};
