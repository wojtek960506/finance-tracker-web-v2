import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UIState = {
  isNavOpen: boolean;
  setIsNavOpen: (val: boolean) => void;
  expandedNavigationItems: string[];
  setNavigationItemExpanded: (itemId: string, isExpanded: boolean) => void;
  isTransactionsTotalsOpen: boolean;
  setIsTransactionsTotalsOpen: (val: boolean) => void;
  isTransactionsFiltersOpen: boolean;
  setIsTransactionsFiltersOpen: (val: boolean) => void;
  expandedTransactionTotalCurrencies: string[] | null;
  setTransactionTotalCurrencyExpanded: (currency: string, isExpanded: boolean) => void;
  resetPersistedUIState: () => void;
};

export const UI_STORE_KEY = 'ui-store';
const getDefaultPersistedUIState = () => ({
  isNavOpen: false,
  expandedNavigationItems: [],
  isTransactionsTotalsOpen: false,
  isTransactionsFiltersOpen: false,
  expandedTransactionTotalCurrencies: null,
});

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...getDefaultPersistedUIState(),
      setIsNavOpen: (isNavOpen: boolean) => set({ isNavOpen }),
      expandedNavigationItems: [],
      setNavigationItemExpanded: (itemId: string, isExpanded: boolean) =>
        set((state) => ({
          expandedNavigationItems: isExpanded
            ? [...new Set([...state.expandedNavigationItems, itemId])]
            : state.expandedNavigationItems.filter(
                (currentItemId) => currentItemId !== itemId,
              ),
        })),
      isTransactionsTotalsOpen: false,
      setIsTransactionsTotalsOpen: (isTransactionsTotalsOpen: boolean) =>
        set({ isTransactionsTotalsOpen }),
      isTransactionsFiltersOpen: false,
      setIsTransactionsFiltersOpen: (isTransactionsFiltersOpen: boolean) =>
        set({ isTransactionsFiltersOpen }),
      expandedTransactionTotalCurrencies: null,
      setTransactionTotalCurrencyExpanded: (currency: string, isExpanded: boolean) =>
        set((state) => {
          const expandedCurrencies = state.expandedTransactionTotalCurrencies ?? [];

          return {
            expandedTransactionTotalCurrencies: isExpanded
              ? [...new Set([...expandedCurrencies, currency])]
              : expandedCurrencies.filter(
                  (currentCurrency) => currentCurrency !== currency,
                ),
          };
        }),
      resetPersistedUIState: () => set(getDefaultPersistedUIState()),
    }),
    {
      name: UI_STORE_KEY,
      partialize: (state) => ({
        isNavOpen: state.isNavOpen,
        expandedNavigationItems: state.expandedNavigationItems,
        isTransactionsTotalsOpen: state.isTransactionsTotalsOpen,
        isTransactionsFiltersOpen: state.isTransactionsFiltersOpen,
        expandedTransactionTotalCurrencies: state.expandedTransactionTotalCurrencies,
      }),
    },
  ),
);
