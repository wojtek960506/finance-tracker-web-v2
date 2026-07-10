import { IS_LG_MEDIA_QUERY, IS_XL_MEDIA_QUERY } from '@shared/consts';
import { useMediaQuery } from '@shared/hooks';
import { useUIStore } from '@store/ui-store';

import type { TransactionsPageVisiblePanel } from './use-transactions-page-layout.types';
import {
  getLayoutMode,
  getLayoutState,
  getNextPanelState,
  getOpenPanels,
} from './use-transactions-page-layout.utils';

export const useTransactionsPageLayout = () => {
  const isLgScreen = useMediaQuery(IS_LG_MEDIA_QUERY);
  const isXlScreen = useMediaQuery(IS_XL_MEDIA_QUERY);
  const {
    isTransactionsFiltersOpen,
    isTransactionsTotalsOpen,
    setIsTransactionsFiltersOpen,
    setIsTransactionsTotalsOpen,
  } = useUIStore();

  const layoutMode = getLayoutMode({ isLgScreen, isXlScreen });
  const panels = getOpenPanels({
    layoutMode,
    isTransactionsFiltersOpen,
    isTransactionsTotalsOpen,
  });
  const layout = getLayoutState({
    layoutMode,
    isFiltersOpen: panels.isFiltersOpen,
    isTotalsOpen: panels.isTotalsOpen,
  });

  const setClosedPanels = () => {
    setIsTransactionsFiltersOpen(false);
    setIsTransactionsTotalsOpen(false);
  };

  const togglePanel = (panel: Exclude<TransactionsPageVisiblePanel, null>) => {
    const nextState = getNextPanelState({
      layoutMode,
      panel,
      visiblePanel: panels.visiblePanel,
      isTransactionsFiltersOpen,
      isTransactionsTotalsOpen,
    });

    setIsTransactionsFiltersOpen(nextState.isTransactionsFiltersOpen);
    setIsTransactionsTotalsOpen(nextState.isTransactionsTotalsOpen);
  };

  const handleToggleFilters = () => togglePanel('filters');
  const handleToggleTotals = () => togglePanel('totals');

  const handleFiltersApplied = () => {
    if (layoutMode === 'three-column') {
      setIsTransactionsFiltersOpen(false);
      return;
    }

    setClosedPanels();
  };

  return {
    layoutMode,
    panels,
    layout,
    actions: {
      handleToggleFilters,
      handleToggleTotals,
      handleFiltersApplied,
      closePanels: setClosedPanels,
    },
  };
};
