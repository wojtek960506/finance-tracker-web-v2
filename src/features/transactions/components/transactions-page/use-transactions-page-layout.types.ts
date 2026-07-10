export type TransactionsPageLayoutMode =
  | 'single-column'
  | 'two-column'
  | 'three-column';

export type TransactionsPageVisiblePanel = 'filters' | 'totals' | null;

export type TransactionsPagePanelsState = {
  isFiltersOpen: boolean;
  isTotalsOpen: boolean;
  visiblePanel: TransactionsPageVisiblePanel;
};

export type TransactionsPageLayoutState = {
  isDrawerPanels: boolean;
  isSharedSidebarVisible: boolean;
  isLargeSidebarLayout: boolean;
};

export type TransactionsPageNextPanelState = {
  isTransactionsFiltersOpen: boolean;
  isTransactionsTotalsOpen: boolean;
};

export type GetLayoutModeArgs = {
  isLgScreen: boolean;
  isXlScreen: boolean;
};

export type GetOpenPanelsArgs = {
  layoutMode: TransactionsPageLayoutMode;
  isTransactionsFiltersOpen: boolean;
  isTransactionsTotalsOpen: boolean;
};

export type GetLayoutStateArgs = {
  layoutMode: TransactionsPageLayoutMode;
  isFiltersOpen: boolean;
  isTotalsOpen: boolean;
};

export type GetNextPanelStateArgs = {
  layoutMode: TransactionsPageLayoutMode;
  panel: Exclude<TransactionsPageVisiblePanel, null>;
  visiblePanel: TransactionsPageVisiblePanel;
  isTransactionsFiltersOpen: boolean;
  isTransactionsTotalsOpen: boolean;
};
