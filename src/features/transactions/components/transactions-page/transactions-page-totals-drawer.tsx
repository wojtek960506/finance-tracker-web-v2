import { useTranslation } from 'react-i18next';

import { Drawer } from '@shared/ui';

import { useTransactionsPageContext } from './transactions-page-context';

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
      panelClassName="w-full overflow-x-auto w-[min(340px,100vh)"
      contentClassName="min-w-[340px]"
    >
      <div id="transactions-totals-panel" className="pb-6">
        {totalsPanel}
      </div>
    </Drawer>
  );
};
