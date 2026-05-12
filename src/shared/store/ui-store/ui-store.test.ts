import { beforeEach, describe, expect, it } from 'vitest';

import { UI_STORE_KEY, useUIStore } from './ui-store';

describe('useUIStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useUIStore.setState({
      isNavOpen: false,
      expandedNavigationItems: [],
      isTransactionsTotalsOpen: false,
      isTransactionsFiltersOpen: false,
      expandedTransactionTotalCurrencies: null,
    });
  });

  it('defaults to nav closed', () => {
    expect(useUIStore.getState().isNavOpen).toBe(false);
  });

  it('updates nav state via setIsNavOpen', () => {
    useUIStore.getState().setIsNavOpen(true);

    expect(useUIStore.getState().isNavOpen).toBe(true);
  });

  it('tracks expanded navigation items', () => {
    useUIStore.getState().setNavigationItemExpanded('transactions', true);

    expect(useUIStore.getState().expandedNavigationItems).toEqual(['transactions']);

    useUIStore.getState().setNavigationItemExpanded('transactions', false);

    expect(useUIStore.getState().expandedNavigationItems).toEqual([]);
  });

  it('tracks expanded transaction total currencies', () => {
    useUIStore.getState().setTransactionTotalCurrencyExpanded('USD', true);

    expect(useUIStore.getState().expandedTransactionTotalCurrencies).toEqual(['USD']);

    useUIStore.getState().setTransactionTotalCurrencyExpanded('USD', false);

    expect(useUIStore.getState().expandedTransactionTotalCurrencies).toEqual([]);
  });

  it('persists configured UI state', () => {
    useUIStore.getState().setIsNavOpen(true);
    useUIStore.getState().setNavigationItemExpanded('transactions', true);
    useUIStore.getState().setIsTransactionsTotalsOpen(true);
    useUIStore.getState().setIsTransactionsFiltersOpen(true);
    useUIStore.getState().setTransactionTotalCurrencyExpanded('EUR', true);

    const storedState = JSON.parse(window.localStorage.getItem(UI_STORE_KEY) ?? '{}');

    expect(storedState.state).toMatchObject({
      isNavOpen: true,
      expandedNavigationItems: ['transactions'],
      isTransactionsTotalsOpen: true,
      isTransactionsFiltersOpen: true,
      expandedTransactionTotalCurrencies: ['EUR'],
    });
  });

  it('resets persisted UI state to defaults', () => {
    useUIStore.getState().setIsNavOpen(true);
    useUIStore.getState().setNavigationItemExpanded('transactions', true);
    useUIStore.getState().setIsTransactionsTotalsOpen(true);
    useUIStore.getState().setIsTransactionsFiltersOpen(true);
    useUIStore.getState().setTransactionTotalCurrencyExpanded('EUR', true);

    useUIStore.getState().resetPersistedUIState();

    expect(useUIStore.getState()).toMatchObject({
      isNavOpen: false,
      expandedNavigationItems: [],
      isTransactionsTotalsOpen: false,
      isTransactionsFiltersOpen: false,
      expandedTransactionTotalCurrencies: null,
    });
  });
});
