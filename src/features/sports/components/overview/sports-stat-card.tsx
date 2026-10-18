import clsx from 'clsx';

import { Card } from '@shared/ui';

import type { SportsStatCardProps } from './types';

export const SportsStatCard = ({
  title,
  value,
  subtext,
  Icon,
  iconClassName,
  badge,
  'data-testid': dataTestId,
}: SportsStatCardProps) => {
  return (
    <Card
      className="relative flex flex-col justify-between overflow-hidden p-3.5 sm:p-4"
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-muted sm:text-sm">{title}</span>
        <div
          className={clsx(
            'flex size-7 items-center justify-center rounded-lg sm:size-8',
            'bg-card-border/30',
            !iconClassName && 'text-fg',
          )}
        >
          <Icon className={clsx('size-3.5 sm:size-4', iconClassName)} />
        </div>
      </div>

      <div className="mt-1.5 flex flex-col gap-0.5">
        <span className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
          {value}
        </span>
        {subtext && <span className="text-xs text-text-muted truncate">{subtext}</span>}
      </div>

      {badge && <div className="mt-2">{badge}</div>}
    </Card>
  );
};
