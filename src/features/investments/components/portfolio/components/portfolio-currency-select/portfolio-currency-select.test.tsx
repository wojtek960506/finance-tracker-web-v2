import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { PortfolioCurrencySelect } from './portfolio-currency-select';

vi.mock('@features/currencies/api', () => ({
  getCurrencies: vi.fn().mockResolvedValue([
    { code: 'PLN', name: 'Złoty polski' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
  ]),
}));

describe('PortfolioCurrencySelect', () => {
  it('returns null when there is only 1 or 0 currencies', () => {
    const { container } = renderWithProviders(
      <PortfolioCurrencySelect
        currencies={['PLN']}
        activeCurrency="PLN"
        onSelectCurrency={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders select dropdown when there are multiple currencies and triggers change', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    renderWithProviders(
      <PortfolioCurrencySelect
        currencies={['PLN', 'USD', 'EUR']}
        activeCurrency="PLN"
        onSelectCurrency={handleSelect}
      />,
    );

    const selectTrigger = screen.getByTestId('portfolio-currency-select');
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toHaveTextContent('PLN');

    await user.click(selectTrigger);

    const usdOption = screen.getByRole('option', { name: /USD/i });
    await user.click(usdOption);

    expect(handleSelect).toHaveBeenCalledWith('USD');
  });
});
