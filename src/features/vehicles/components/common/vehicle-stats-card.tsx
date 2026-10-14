import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

import { Card } from '@shared/ui';

export type VehicleStatsCardProps = {
  title: string;
  value: string;
  subtext?: string;
  Icon: LucideIcon;
  iconClassName?: string;
  'data-testid'?: string;
};

export const VehicleStatsCard = ({
  title,
  value,
  subtext,
  Icon,
  iconClassName,
  'data-testid': dataTestId,
}: VehicleStatsCardProps) => {
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
            'bg-card-border/30 text-fg',
            iconClassName,
          )}
        >
          <Icon className="size-3.5 sm:size-4" />
        </div>
      </div>

      <div className="mt-1.5 flex flex-col gap-0.5">
        <span className="text-lg font-bold tracking-tight text-fg sm:text-2xl">
          {value}
        </span>
        {subtext && <span className="text-xs text-text-muted">{subtext}</span>}
      </div>
    </Card>
  );
};
