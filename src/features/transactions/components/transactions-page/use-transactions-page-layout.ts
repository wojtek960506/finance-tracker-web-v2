import { IS_LG_MEDIA_QUERY, IS_XL_MEDIA_QUERY } from '@shared/consts';
import { useMediaQuery } from '@shared/hooks';
import { useUIStore } from '@store/ui-store';

type TransactionsPageLayoutMode = 'single-column' | 'two-column' | 'three-column';
type TransactionsPageVisiblePanel = 'filters' | 'totals' | null;

const getLayoutMode = ({
  isLgScreen,
  isXlScreen,
}: {
  isLgScreen: boolean;
  isXlScreen: boolean;
}): TransactionsPageLayoutMode => {
  if (isXlScreen) return 'three-column';
  if (isLgScreen) return 'two-column';

  return 'single-column';
};

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
  const visiblePanel: TransactionsPageVisiblePanel = isTransactionsFiltersOpen
    ? 'filters'
    : isTransactionsTotalsOpen
      ? 'totals'
      : null;

  const isFiltersOpen =
    layoutMode === 'three-column'
      ? isTransactionsFiltersOpen
      : visiblePanel === 'filters';
  const isTotalsOpen =
    layoutMode === 'three-column' ? isTransactionsTotalsOpen : visiblePanel === 'totals';

  const isDrawerPanels = layoutMode === 'single-column';
  const isSharedSidebarVisible =
    layoutMode === 'two-column' && (isFiltersOpen || isTotalsOpen);
  const isLargeSidebarLayout =
    layoutMode === 'three-column' && (isFiltersOpen || isTotalsOpen);

  const setClosedPanels = () => {
    setIsTransactionsFiltersOpen(false);
    setIsTransactionsTotalsOpen(false);
  };

  const togglePanel = (panel: Exclude<TransactionsPageVisiblePanel, null>) => {
    if (layoutMode === 'three-column') {
      if (panel === 'filters') {
        setIsTransactionsFiltersOpen(!isTransactionsFiltersOpen);
        return;
      }

      setIsTransactionsTotalsOpen(!isTransactionsTotalsOpen);
      return;
    }

    const isPanelVisible = visiblePanel === panel;
    setIsTransactionsFiltersOpen(!isPanelVisible && panel === 'filters');
    setIsTransactionsTotalsOpen(!isPanelVisible && panel === 'totals');
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
    visiblePanel,
    isFiltersOpen,
    isTotalsOpen,
    isDrawerPanels,
    isSharedSidebarVisible,
    isLargeSidebarLayout,
    handleToggleFilters,
    handleToggleTotals,
    handleFiltersApplied,
    closePanels: setClosedPanels,
  };
};
