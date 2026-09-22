import clsx from 'clsx';
import { Landmark, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { NetWorthCurrencyBreakdownDTO } from '../api';
import { formatCurrencyAmount } from '../utils';

export type NetWorthCurrencyCardProps = {
  item: NetWorthCurrencyBreakdownDTO;
  baseCurrency: string;
  language: string;
};

export const NetWorthCurrencyCard = ({
  item,
  baseCurrency,
  language,
}: NetWorthCurrencyCardProps) => {
  const { t } = useTranslation('net-worth');
  const showNormalized =
    item.normalizedTotal !== undefined && item.currency !== baseCurrency;

  return (
    <div
      className={clsx(
        'flex flex-col justify-between gap-2.5 rounded-xl border border-fg/10',
        'bg-surface/40 p-3 transition-all hover:bg-surface/70',
        item.currency === baseCurrency && 'border-primary/30',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          {formatCurrencyAmount(item.total, item.currency, language)}
        </span>
        {showNormalized && item.normalizedTotal !== undefined && (
          <span className="text-xs sm:text-sm font-medium text-text-muted ">
            ≈ {formatCurrencyAmount(item.normalizedTotal, baseCurrency, language)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-sm sm:text-base">
        <div className="flex items-center justify-between text-text-muted gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Landmark className="size-3.5 text-emerald-500" />
            <span className="truncate">{t('liquidCash')}</span>
          </div>
          <span className="font-medium text-foreground shrink-0">
            {formatCurrencyAmount(item.cash, item.currency, language)}
          </span>
        </div>

        <div className="flex items-center justify-between text-text-muted gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendingUp className="size-3.5 text-sky-500" />
            <span>{t('investments')}</span>
          </div>
          <span className="font-medium text-foreground shrink-0">
            {formatCurrencyAmount(item.investments, item.currency, language)}
          </span>
        </div>
      </div>
    </div>
  );
};
