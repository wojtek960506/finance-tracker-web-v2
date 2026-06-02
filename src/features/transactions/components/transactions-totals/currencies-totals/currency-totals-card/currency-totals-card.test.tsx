import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { TransactionTotalsByCurrency } from '@transactions/api';

import { CurrencyTotalsCard } from './currency-totals-card';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@ui', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Collapsible: ({
    header,
    children,
  }: {
    header: ReactNode;
    children: ReactNode;
  }) => (
    <div>
      <div>{header}</div>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock('./currency-totals-metrics', () => ({
  CurrencyTotalsMetrics: () => <div>metrics</div>,
}));

const makeTotals = (
  expenseAmount: number,
  incomeAmount: number,
): TransactionTotalsByCurrency => ({
  totalItems: 12,
  expense: {
    totalItems: 5,
    totalAmount: expenseAmount,
    averageAmount: 10,
    maxAmount: 20,
    minAmount: 5,
  },
  income: {
    totalItems: 7,
    totalAmount: incomeAmount,
    averageAmount: 15,
    maxAmount: 30,
    minAmount: 10,
  },
});

describe('CurrencyTotalsCard', () => {
  it('shows balance in the header and colors it green when positive', () => {
    render(
      <CurrencyTotalsCard
        currency="USD"
        totals={makeTotals(40, 60)}
        isOpen
      />,
    );

    expect(
      screen.getByText((_, element) => element?.textContent === 'totalItems: 12'),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'balance: 20.00 USD'),
    ).toHaveClass('text-bt-primary');
  });

  it('colors balance red when negative', () => {
    render(
      <CurrencyTotalsCard
        currency="USD"
        totals={makeTotals(80, 35)}
        isOpen
      />,
    );

    expect(
      screen.getByText((_, element) => element?.textContent === 'balance: -45.00 USD'),
    ).toHaveClass('text-destructive');
  });
});
