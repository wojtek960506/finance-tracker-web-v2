import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { useNetWorth } from '../hooks';

import { NetWorthAllocationBreakdown } from './net-worth-allocation-breakdown';
import { NetWorthCurrencyBreakdown } from './net-worth-currency-breakdown';
import { NetWorthCurrencySelector } from './net-worth-currency-selector';
import { NetWorthEmptyState } from './net-worth-empty-state';
import { NetWorthSummaryCards } from './net-worth-summary-cards';

export const NetWorthPage = () => {
  const { t } = useTranslation('net-worth');
  const {
    baseCurrency,
    setBaseCurrency,
    totals,
    currencies,
    byCurrencyList,
    allocationList,
    hasData,
    isLoading,
    error,
  } = useNetWorth();

  return (
    <div
      className="flex flex-col gap-5 px-0 xs:px-2 sm:px-3"
      data-testid="net-worth-page"
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
      {!isLoading && !error && hasData && totals && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t('title')}
              </h1>
              <p className="text-xs text-text-muted sm:text-sm">{t('description')}</p>
            </div>

            <NetWorthCurrencySelector
              activeCurrency={baseCurrency}
              onSelectCurrency={setBaseCurrency}
              availableCurrencies={currencies}
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Summary Cards */}
            <NetWorthSummaryCards totals={totals} baseCurrency={baseCurrency} />

            {/* Allocation Breakdown */}
            <NetWorthAllocationBreakdown
              allocation={allocationList}
              baseCurrency={baseCurrency}
            />

            {/* By Currency Breakdown */}
            <NetWorthCurrencyBreakdown
              currencies={byCurrencyList}
              baseCurrency={baseCurrency}
            />
          </div>
        </>
      )}
    </div>
  );
};
