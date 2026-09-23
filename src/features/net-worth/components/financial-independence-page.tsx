import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { INDEPENDENCE_PERIOD_OPTIONS } from '../consts';
import { useNetWorthIndependence } from '../hooks';

import { NetWorthEmptyState } from './net-worth-empty-state';
import { NetWorthIndependenceBreakdown } from './net-worth-independence-breakdown';
import { NetWorthIndependenceCards } from './net-worth-independence-cards';

export const FinancialIndependencePage = () => {
  const { t } = useTranslation('net-worth');
  const {
    baseCurrency,
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
  } = useNetWorthIndependence();

  return (
    <div
      className="flex flex-col gap-5 px-0 xs:px-2 sm:px-3"
      data-testid="financial-independence-page"
    >
      {/* Loading state */}
      {isLoading && (
        <LoadingCard
          title={t('loadingTitle')}
          description={t('loadingDescription')}
          widthClassName="max-w-[35rem]"
        />
      )}

      {/* Error state */}
      {error && <p className="p-4 text-sm text-destructive">{error.message}</p>}

      {/* Empty state */}
      {!isLoading && !error && !hasData && <NetWorthEmptyState />}

      {/* Main Data Content */}
      {!isLoading &&
        !error &&
        hasData &&
        netWorth &&
        monthlyAverages &&
        independence &&
        zeroIncomeBaseline && (
          <>
            {/* Header & Controls */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="self-start">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {t('independenceSectionTitle')}
                </h1>
                <p className="text-xs text-text-muted sm:text-sm">
                  {t('independenceSectionDescription')}
                </p>
              </div>

              {/* Period Selector Toggle */}
              <div className="flex items-center gap-1.5 self-end rounded-lg border border-border/60 bg-muted/30 p-1  shrink-0">
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

            <div className="flex flex-col gap-3">
              {/* Primary Metric Cards */}
              <NetWorthIndependenceCards
                independence={independence}
                zeroIncomeBaseline={zeroIncomeBaseline}
                monthlyAverages={monthlyAverages}
                baseCurrency={baseCurrency}
              />

              {/* Detailed Cashflow & Capital Breakdown */}
              <NetWorthIndependenceBreakdown
                monthlyAverages={monthlyAverages}
                netWorth={netWorth}
                excludedCategories={excludedCategories}
                baseCurrency={baseCurrency}
              />
            </div>
          </>
        )}
    </div>
  );
};
