import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Card, LoadingCard } from '@shared/ui';

import { INDEPENDENCE_PERIOD_OPTIONS } from '../consts';
import { useNetWorthIndependence } from '../hooks';

import { NetWorthIndependenceBreakdown } from './net-worth-independence-breakdown';
import { NetWorthIndependenceCards } from './net-worth-independence-cards';

type NetWorthIndependenceSectionProps = {
  baseCurrency?: string;
};

export const NetWorthIndependenceSection = ({
  baseCurrency,
}: NetWorthIndependenceSectionProps) => {
  const { t } = useTranslation('net-worth');
  const {
    periodMonths,
    setPeriodMonths,
    netWorth,
    monthlyAverages,
    independence,
    zeroIncomeBaseline,
    excludedCategories,
    hasData,
    isLoading,
    error,
  } = useNetWorthIndependence({ baseCurrency });

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingTitle')}
        description={t('loadingDescription')}
        widthClassName="w-full"
      />
    );
  }

  if (error) {
    return <p className="p-4 text-sm text-destructive">{error.message}</p>;
  }

  if (!hasData || !netWorth || !monthlyAverages || !independence || !zeroIncomeBaseline) {
    return null;
  }

  return (
    <Card
      className="flex flex-col gap-5 p-4 sm:p-6"
      data-testid="net-worth-independence-section"
    >
      {/* Section Header & Period Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {t('independenceSectionTitle')}
          </h2>
          <p className="text-xs text-text-muted sm:text-sm">
            {t('independenceSectionDescription')}
          </p>
        </div>

        {/* Period Selector Toggle */}
        <div className="flex items-center gap-1.5 self-start rounded-lg border border-border/60 bg-muted/30 p-1 sm:self-auto">
          <span className="px-2 text-xs font-medium text-text-muted">
            {t('periodSelectorLabel')}:
          </span>
          {INDEPENDENCE_PERIOD_OPTIONS.map((period) => {
            const isSelected = periodMonths === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setPeriodMonths(period)}
                className={clsx(
                  'rounded-md px-2.5 py-1 text-xs font-semibold transition-all',
                  isSelected
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-text-muted hover:text-foreground',
                )}
                aria-pressed={isSelected}
              >
                {t('periodMonths', { count: period })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Metric Cards */}
      <NetWorthIndependenceCards
        independence={independence}
        zeroIncomeBaseline={zeroIncomeBaseline}
        monthlyAverages={monthlyAverages}
        baseCurrency={baseCurrency}
      />

      {/* Cashflow & Capital Breakdown */}
      <NetWorthIndependenceBreakdown
        monthlyAverages={monthlyAverages}
        netWorth={netWorth}
        excludedCategories={excludedCategories}
        baseCurrency={baseCurrency}
      />
    </Card>
  );
};
