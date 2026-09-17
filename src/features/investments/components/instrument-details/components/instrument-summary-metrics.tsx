import clsx from 'clsx';
import { Activity, ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import { useInstrumentDetailsContext } from '../context';

export const InstrumentSummaryMetrics = () => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();
  const { metrics, currency } = useInstrumentDetailsContext();

  const formattedValuation =
    metrics.currentValuation !== null
      ? formatCurrencyAmount(metrics.currentValuation, currency, language)
      : '—';

  const formattedNetInvested = formatCurrencyAmount(
    metrics.netInvested,
    currency,
    language,
  );

  const formattedProfit =
    metrics.totalProfit !== null
      ? formatCurrencyAmount(metrics.totalProfit, currency, language)
      : '—';

  const isProfitPositive = (metrics.totalProfit ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Current Valuation */}
      <Card
        className={clsx(
          'flex flex-col justify-between gap-2 p-4',
          'border-sky-500/25 bg-sky-500/[0.03]',
          'dark:border-sky-500/30 dark:bg-sky-950/20',
        )}
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-medium uppercase tracking-wider">
            {t('details.currentValuation')}
          </span>
          <Wallet className="size-4 text-sky-500" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {formattedValuation}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {metrics.lastSnapshotDate ? (
              <>
                {t('details.lastSnapshotOn')}:{' '}
                {new Date(metrics.lastSnapshotDate).toLocaleDateString(language)}
              </>
            ) : (
              t('details.noValuationRecorded')
            )}
          </p>
        </div>
      </Card>

      {/* 2. Net Invested */}
      <Card className="flex flex-col justify-between gap-2 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-medium uppercase tracking-wider">
            {t('details.netInvested')}
          </span>
          <DollarSign className="size-4" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {formattedNetInvested}
          </div>
          <p className="mt-1 text-xs text-text-muted">{t('details.capitalInjected')}</p>
        </div>
      </Card>

      {/* 3. Total Return / Profit */}
      <Card className="flex flex-col justify-between gap-2 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-medium uppercase tracking-wider">
            {t('details.totalProfit')}
          </span>
          {metrics.totalProfit !== null && isProfitPositive ? (
            <ArrowUpRight className="size-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="size-4 text-rose-500" />
          )}
        </div>

        <div>
          <div
            className={clsx(
              'text-xl font-bold tracking-tight sm:text-2xl',
              metrics.totalProfit === null
                ? 'text-foreground'
                : isProfitPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400',
            )}
          >
            {formattedProfit}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {metrics.returnPercentage !== null ? (
              <span
                className={clsx(
                  'font-semibold',
                  isProfitPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400',
                )}
              >
                {metrics.returnPercentage >= 0 ? '+' : ''}
                {metrics.returnPercentage.toFixed(2)}%
              </span>
            ) : (
              '—'
            )}
          </p>
        </div>
      </Card>

      {/* 4. Total Operations */}
      <Card className="flex flex-col justify-between gap-2 p-4">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-medium uppercase tracking-wider">
            {t('details.totalOperations')}
          </span>
          <Activity className="size-4" />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {metrics.totalOperationsCount}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {t('details.operationsCountHint')}
          </p>
        </div>
      </Card>
    </div>
  );
};
