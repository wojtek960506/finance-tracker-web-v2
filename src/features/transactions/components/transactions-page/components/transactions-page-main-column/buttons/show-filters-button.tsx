import clsx from 'clsx';
import { Funnel } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

export const ShowFiltersButton = () => {
  const { t } = useTranslation('transactions');
  const {
    isFiltersOpen,
    activeFiltersCount,
    filtersButtonRef,
    handleToggleFilters,
  } = useTransactionsPageContext();

  return (
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
          'inline-flex size-6 items-center justify-center rounded-full',
          'border border-1 text-xs font-semibold',
          activeFiltersCount > 0
            ? 'bg-bt-primary text-white'
            : 'bg-bg text-text-muted',
        )}
      >
        {activeFiltersCount}
      </span>
    </Button>
  );
};
