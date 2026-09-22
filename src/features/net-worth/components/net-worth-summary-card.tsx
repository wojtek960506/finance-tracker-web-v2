import clsx from 'clsx';

import { Card } from '@shared/ui';

import { NET_WORTH_SUMMARY_CARD_STYLES, type SummaryCardVariant } from '../consts';
import { formatCurrencyAmount, formatPercentage } from '../utils';

export type NetWorthSummaryCardProps = {
  title: string;
  amount: number;
  baseCurrency: string;
  language: string;
  variant: SummaryCardVariant;
  percentage?: number;
  description?: string;
  className?: string;
};

export const NetWorthSummaryCard = ({
  title,
  amount,
  baseCurrency,
  language,
  variant,
  percentage,
  description,
  className,
}: NetWorthSummaryCardProps) => {
  const style = NET_WORTH_SUMMARY_CARD_STYLES[variant];
  const Icon = style.icon;

  return (
    <Card
      className={clsx(
        'flex flex-col justify-between gap-0 sm:gap-1 p-4',
        style.cardClass,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 text-text-muted">
        <span
          className={clsx(
            'text-sm font-semibold uppercase tracking-wider',
            style.titleClass,
          )}
        >
          {title}
        </span>
        <div className="flex items-center gap-3">
          {percentage !== undefined && (
            <span className={clsx('text-sm font-semibold', style.percentageClass)}>
              {formatPercentage(percentage, language)}%
            </span>
          )}
          <Icon className={clsx('size-5', style.iconClass)} />
        </div>
      </div>

      <div>
        <div
          className={clsx(
            'tracking-tight text-foreground',
            style.valueClass ?? 'text-xl font-bold sm:text-2xl',
          )}
        >
          {formatCurrencyAmount(amount, baseCurrency, language)}
        </div>

        {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      </div>
    </Card>
  );
};
