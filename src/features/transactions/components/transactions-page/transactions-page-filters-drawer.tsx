import { useTranslation } from 'react-i18next';

import { Drawer } from '@shared/ui';
import { TransactionsFiltersPanel } from '@transactions/components/transactions-filters';

import {
  TRANSACTIONS_PAGE_DRAWER_CONTENT_CLASS_NAME,
  TRANSACTIONS_PAGE_DRAWER_PANEL_CLASS_NAME,
} from './transactions-page-drawer.consts';
import { useTransactionsPageContext } from './use-transactions-page-context';

export const TransactionsPageFiltersDrawer = () => {
  const { t } = useTranslation('transactions');
  const {
    hasNoTransactions,
    isDrawerPanels,
    isFiltersOpen,
    closePanels,
    filtersButtonRef,
    filters,
    handleApplyFilters,
  } = useTransactionsPageContext();

  if (hasNoTransactions || !isDrawerPanels || !isFiltersOpen) return null;

  return (
    <Drawer
      isOpen={isFiltersOpen}
      fromLeft={false}
      onClose={closePanels}
      restoreFocusRef={filtersButtonRef}
      ariaLabel={t('filters')}
      showOverlay={false}
      panelClassName={TRANSACTIONS_PAGE_DRAWER_PANEL_CLASS_NAME}
      contentClassName={TRANSACTIONS_PAGE_DRAWER_CONTENT_CLASS_NAME}
    >
      <div id="transactions-filters-panel" className="pb-6">
        <TransactionsFiltersPanel appliedFilters={filters} onApply={handleApplyFilters} />
      </div>
    </Drawer>
  );
};
