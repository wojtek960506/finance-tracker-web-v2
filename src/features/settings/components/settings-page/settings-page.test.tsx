import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_BASE_CURRENCY, useSettingsStore } from '@store/settings-store';
import { renderWithProviders } from '@test-utils';

import { SettingsPage } from './settings-page';

vi.mock('@transactions/components/shared', () => ({
  CurrencySelectField: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) => (
    <div data-testid="currency-select-field">
      <span>Selected: {value}</span>
      <button type="button" onClick={() => onChange('EUR')}>
        Change to EUR
      </button>
    </div>
  ),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    useSettingsStore.setState({ baseCurrency: DEFAULT_BASE_CURRENCY });
  });

  it('renders settings title, descriptions and base currency option', () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('General Preferences')).toBeInTheDocument();
    expect(screen.getByText('Base Currency')).toBeInTheDocument();
    expect(screen.getByText('Selected: PLN')).toBeInTheDocument();
  });

  it('updates base currency in settings store when a new currency is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    const changeBtn = screen.getByRole('button', { name: 'Change to EUR' });
    await user.click(changeBtn);

    expect(useSettingsStore.getState().baseCurrency).toBe('EUR');
  });
});
