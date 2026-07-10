import { useTranslation } from 'react-i18next';

import { Drawer } from '@shared/ui';

import {
  TRANSACTIONS_PAGE_DRAWER_CONTENT_CLASS_NAME,
  TRANSACTIONS_PAGE_DRAWER_PANEL_CLASS_NAME,
} from './transactions-page-drawer.consts';
import { useTransactionsPageContext } from './use-transactions-page-context';

export const TransactionsPageTotalsDrawer = () => {
  const { t } = useTranslation('transactions');
  const {
    hasNoTransactions,
    isDrawerPanels,
    isTotalsOpen,
    closePanels,
    totalsButtonRef,
    totalsPanel,
  } = useTransactionsPageContext();

  if (hasNoTransactions || !isDrawerPanels || !isTotalsOpen) return null;

  return (
    <Drawer
      isOpen={isTotalsOpen}
      fromLeft={false}
      onClose={closePanels}
      restoreFocusRef={totalsButtonRef}
      ariaLabel={t('totals')}
      showOverlay={false}
      panelClassName={TRANSACTIONS_PAGE_DRAWER_PANEL_CLASS_NAME}
      contentClassName={TRANSACTIONS_PAGE_DRAWER_CONTENT_CLASS_NAME}
    >
      <div id="transactions-totals-panel" className="pb-6">
        {totalsPanel}
      </div>
    </Drawer>
  );
};
