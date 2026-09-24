import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_BASE_CURRENCY, useSettingsStore } from './settings-store';

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      baseCurrency: DEFAULT_BASE_CURRENCY,
    });
  });

  it('initializes with default base currency PLN', () => {
    expect(useSettingsStore.getState().baseCurrency).toBe('PLN');
  });

  it('updates base currency when setBaseCurrency is called', () => {
    useSettingsStore.getState().setBaseCurrency('EUR');
    expect(useSettingsStore.getState().baseCurrency).toBe('EUR');
  });
});
