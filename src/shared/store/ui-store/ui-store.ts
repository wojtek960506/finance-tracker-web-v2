import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UIState = {
  isNavOpen: boolean;
  setIsNavOpen: (val: boolean) => void;
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
  isTransactionsTotalsOpen: false,
  isTransactionsFiltersOpen: false,
  expandedTransactionTotalCurrencies: null,
});

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isNavOpen: false,
      setIsNavOpen: (isNavOpen: boolean) => set({ isNavOpen }),
      ...getDefaultPersistedUIState(),
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
      resetPersistedUIState: () =>
        set({
          isNavOpen: false,
          ...getDefaultPersistedUIState(),
        }),
    }),
    {
      name: UI_STORE_KEY,
      partialize: (state) => ({
        isTransactionsTotalsOpen: state.isTransactionsTotalsOpen,
        isTransactionsFiltersOpen: state.isTransactionsFiltersOpen,
        expandedTransactionTotalCurrencies: state.expandedTransactionTotalCurrencies,
      }),
    },
  ),
);
