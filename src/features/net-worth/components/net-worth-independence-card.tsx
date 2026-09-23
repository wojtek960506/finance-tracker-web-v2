import clsx from 'clsx';
import type { ReactNode } from 'react';

import { Card } from '@shared/ui';

import {
  type IndependenceCardVariant,
  NET_WORTH_INDEPENDENCE_CARD_STYLES,
} from '../consts';

export type NetWorthIndependenceCardProps = {
  variant: IndependenceCardVariant;
  title: string;
  value: ReactNode;
  unit?: string;
  secondaryValue?: ReactNode;
  description?: string;
  className?: string;
};

export const NetWorthIndependenceCard = ({
  variant,
  title,
  value,
  unit,
  secondaryValue,
  description,
  className,
}: NetWorthIndependenceCardProps) => {
  const style = NET_WORTH_INDEPENDENCE_CARD_STYLES[variant];
  const Icon = style.icon;

  return (
    <Card
      className={clsx(
        'grid grid-rows-subgrid row-span-4 gap-y-2.5 p-4',
        style.cardClass,
        className,
      )}
    >
      {/* Row 1: Header (Title + Icon) */}
      <div className="flex items-center justify-between gap-2 text-text-muted">
        <span
          className={clsx(
            'text-sm font-semibold uppercase tracking-wider',
            style.titleClass,
          )}
        >
          {title}
        </span>
        <Icon className={clsx('size-5 shrink-0', style.iconClass)} />
      </div>

      {/* Row 2: Value + Unit */}
      <div className="flex items-baseline gap-1.5 self-end">
        <span
          className={clsx(
            style.valueClass ??
              'text-2xl font-black tracking-tight text-foreground sm:text-3xl',
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={clsx(
              style.unitClass ?? 'text-sm font-normal text-text-muted sm:text-base',
            )}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Row 3: Secondary Breakdown */}
      <div
        className={clsx(
          style.secondaryValueClass ??
            'text-sm font-medium text-foreground/80 sm:text-base',
        )}
      >
        {secondaryValue}
      </div>

      {/* Row 4: Description */}
      <div>
        {description && (
          <p className="text-xs leading-relaxed text-text-muted">{description}</p>
        )}
      </div>
    </Card>
  );
};
