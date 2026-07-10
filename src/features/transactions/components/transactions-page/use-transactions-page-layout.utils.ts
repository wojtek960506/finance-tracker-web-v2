import type {
  GetLayoutModeArgs,
  GetLayoutStateArgs,
  GetNextPanelStateArgs,
  GetOpenPanelsArgs,
  TransactionsPageLayoutMode,
  TransactionsPageLayoutState,
  TransactionsPageNextPanelState,
  TransactionsPagePanelsState,
  TransactionsPageVisiblePanel,
} from './use-transactions-page-layout.types';

export const getLayoutMode = ({
  isLgScreen,
  isXlScreen,
}: GetLayoutModeArgs): TransactionsPageLayoutMode => {
  if (isXlScreen) return 'three-column';
  if (isLgScreen) return 'two-column';

  return 'single-column';
};

export const getOpenPanels = ({
  layoutMode,
  isTransactionsFiltersOpen,
  isTransactionsTotalsOpen,
}: GetOpenPanelsArgs): TransactionsPagePanelsState => {
  const visiblePanel: TransactionsPageVisiblePanel = isTransactionsFiltersOpen
    ? 'filters'
    : isTransactionsTotalsOpen
      ? 'totals'
      : null;

  if (layoutMode === 'three-column') {
    return {
      visiblePanel,
      isFiltersOpen: isTransactionsFiltersOpen,
      isTotalsOpen: isTransactionsTotalsOpen,
    };
  }

  return {
    visiblePanel,
    isFiltersOpen: visiblePanel === 'filters',
    isTotalsOpen: visiblePanel === 'totals',
  };
};

export const getLayoutState = ({
  layoutMode,
  isFiltersOpen,
  isTotalsOpen,
}: GetLayoutStateArgs): TransactionsPageLayoutState => ({
  isDrawerPanels: layoutMode === 'single-column',
  isSharedSidebarVisible:
    layoutMode === 'two-column' && (isFiltersOpen || isTotalsOpen),
  isLargeSidebarLayout:
    layoutMode === 'three-column' && (isFiltersOpen || isTotalsOpen),
});

export const getNextPanelState = ({
  layoutMode,
  panel,
  visiblePanel,
  isTransactionsFiltersOpen,
  isTransactionsTotalsOpen,
}: GetNextPanelStateArgs): TransactionsPageNextPanelState => {
  if (layoutMode === 'three-column') {
    if (panel === 'filters') {
      return {
        isTransactionsFiltersOpen: !isTransactionsFiltersOpen,
        isTransactionsTotalsOpen,
      };
    }

    return {
      isTransactionsFiltersOpen,
      isTransactionsTotalsOpen: !isTransactionsTotalsOpen,
    };
  }

  const isPanelVisible = visiblePanel === panel;

  return {
    isTransactionsFiltersOpen: !isPanelVisible && panel === 'filters',
    isTransactionsTotalsOpen: !isPanelVisible && panel === 'totals',
  };
};
