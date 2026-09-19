import clsx from 'clsx';
import { ArrowDownRight, ArrowUpRight, DollarSign, Layers, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { InvestmentCurrencySummary } from '@features/investments/api';
import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

type PortfolioSummaryMetricsProps = {
  summary: InvestmentCurrencySummary;
};

export const PortfolioSummaryMetrics = ({ summary }: PortfolioSummaryMetricsProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();

  const formattedValuation = formatCurrencyAmount(
    summary.totalCurrentValue,
    summary.currency,
    language,
  );

  const formattedNetInvested = formatCurrencyAmount(
    summary.totalNetInvested,
    summary.currency,
    language,
  );

  const formattedProfit = formatCurrencyAmount(
    summary.totalPnL,
    summary.currency,
    language,
  );

  const isProfitPositive = summary.totalPnL >= 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Valuation */}
        <Card
          className={clsx(
            'flex flex-col justify-between gap-2 p-4',
            'border-sky-500/25 bg-sky-500/[0.03]',
            'dark:border-sky-500/30 dark:bg-sky-950/20',
          )}
        >
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              {t('portfolio.totalValuation')}
            </span>
            <Wallet className="size-4 text-sky-500" />
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {formattedValuation}
            </div>
            <p className="mt-1 text-xs text-text-muted">{summary.currency}</p>
          </div>
        </Card>

        {/* 2. Net Invested */}
        <Card className="flex flex-col justify-between gap-2 p-4">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              {t('portfolio.netInvested')}
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

        {/* 3. Total PnL & ROI */}
        <Card className="flex flex-col justify-between gap-2 p-4">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              {t('portfolio.totalProfit')}
            </span>
            {isProfitPositive ? (
              <ArrowUpRight className="size-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="size-4 text-rose-500" />
            )}
          </div>

          <div>
            <div
              className={clsx(
                'text-xl font-bold tracking-tight sm:text-2xl',
                isProfitPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400',
              )}
            >
              {formattedProfit}
            </div>
            <p className="mt-1 text-xs text-text-muted">
              <span
                className={clsx(
                  'font-semibold',
                  isProfitPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400',
                )}
              >
                {summary.roiPercentage >= 0 ? '+' : ''}
                {summary.roiPercentage.toFixed(2)}% ROI
              </span>
            </p>
          </div>
        </Card>

        {/* 4. Active Instruments */}
        <Card className="flex flex-col justify-between gap-2 p-4">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              {t('portfolio.holdingsCount')}
            </span>
            <Layers className="size-4" />
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {summary.instrumentsCount}
            </div>
            <p className="mt-1 text-xs text-text-muted">{summary.currency}</p>
          </div>
        </Card>
      </div>

      {/* Secondary Cash Flow Breakdown Strip */}
      <div
        className={clsx(
          'grid grid-cols-2 gap-2 rounded-xl border border-fg/10 bg-bg p-3',
          'sm:grid-cols-4 sm:gap-4',
        )}
      >
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">{t('portfolio.totalBought')}</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrencyAmount(summary.totalBought, summary.currency, language)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">{t('portfolio.totalSold')}</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrencyAmount(summary.totalSold, summary.currency, language)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">{t('portfolio.totalInterest')}</span>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyAmount(summary.totalInterest, summary.currency, language)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">{t('portfolio.totalFees')}</span>
          <span className="text-sm font-semibold text-text-muted">
            {formatCurrencyAmount(summary.totalFees, summary.currency, language)}
          </span>
        </div>
      </div>
    </div>
  );
};
