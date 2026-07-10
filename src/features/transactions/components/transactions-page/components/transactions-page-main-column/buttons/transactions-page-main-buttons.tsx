import clsx from 'clsx';
import { ChartColumnBig, Funnel, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { ExportTransactionsButton } from '@transactions/components/export-transactions';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

export const TransactionsPageMainButtons = () => {
  const { t } = useTranslation('transactions');
    const {
      hasNoTransactions,
      filters,
      isTotalsOpen,
      isFiltersOpen,
      activeFiltersCount,
      totalsButtonRef,
      filtersButtonRef,
      handleToggleTotals,
      handleToggleFilters,
      handleNavigateToNewTransaction,
    } = useTransactionsPageContext();
  
  if (hasNoTransactions) return null;
  
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-3">
      <Button
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2 font-semibold sm:font-bold')}
        aria-label={t('newTransaction')}
        onClick={handleNavigateToNewTransaction}
      >
        <Plus className="size-4 sm:size-5" aria-hidden="true" />
        <span aria-hidden="true" className="hidden sm:inline">
          {t('newButtonShort')}
        </span>
      </Button>

      <ExportTransactionsButton filters={filters} />

      <Button
        ref={totalsButtonRef}
        type="button"
        variant={isTotalsOpen ? 'secondary' : 'outline'}
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2')}
        aria-label={isTotalsOpen ? t('hideTotals') : t('showTotals')}
        aria-expanded={isTotalsOpen}
        aria-controls="transactions-totals-panel"
        onClick={handleToggleTotals}
      >
        <ChartColumnBig className="size-4 sm:size-5" aria-hidden="true" />
        <span aria-hidden="true" className="hidden sm:inline">
          {t('totals')}
        </span>
      </Button>

      <Button
        ref={filtersButtonRef}
        type="button"
        variant={isFiltersOpen ? 'secondary' : 'outline'}
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-1 xs:gap-2 sm:gap-3')}
        aria-label={isFiltersOpen ? t('hideFilters') : t('showFilters')}
        aria-expanded={isFiltersOpen}
        aria-controls="transactions-filters-panel"
        onClick={handleToggleFilters}
      >
        <Funnel className="size-4 sm:size-5" aria-hidden="true" />
        <span aria-hidden="true" className="hidden sm:inline">
          {t('filters')}
        </span>
        <span
          aria-hidden="true"
          className={clsx(
            'inline-flex size-6 items-center justify-center rounded-full border border-1 text-xs font-semibold',
            activeFiltersCount > 0
              ? 'bg-bt-primary text-white'
              : 'bg-bg text-text-muted',
          )}
        >
          {activeFiltersCount}
        </span>
      </Button>
    </div>
  )
}
