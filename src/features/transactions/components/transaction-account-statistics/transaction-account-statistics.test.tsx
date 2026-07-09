import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { TransactionAccountStatistics } from './transaction-account-statistics';

const getAccountStatistics = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string) => ({
    t: (key: string, options?: { count?: number }) => {
      if (namespace === 'namedResources' && key === 'cash') return 'Cash';
      if (namespace === 'transactions' && key === 'accounts') {
        return `${options?.count ?? 0} accounts`;
      }
      if (namespace === 'transactions' && key === 'transactionsCount') {
        return 'Liczba transakcji';
      }
      if (namespace === 'transactions' && key === 'transactionsCountSummary') {
        return options?.count === 1
          ? '1 transakcja'
          : `${options?.count ?? 0} transakcji`;
      }

      return key;
    },
  }),
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [
    new URLSearchParams(
      'startDate=2024-01-01&endDate=2024-01-31&transactionType=income&currency=pln',
    ),
    vi.fn(),
  ],
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@features/currencies/api', () => ({
  getCurrencies: vi.fn().mockResolvedValue([
    { code: 'PLN', name: 'Polish złoty' },
    { code: 'USD', name: 'US dollar' },
  ]),
}));

vi.mock('@/components/ui/combobox', () => ({
  Combobox: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ComboboxInput: ({ showClear }: { showClear?: boolean }) => (
    <span>showClear:{String(showClear)}</span>
  ),
  ComboboxContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ComboboxEmpty: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ComboboxList: ({
    children,
  }: {
    children:
      | ((item: { code: string; name: string }) => ReactNode)
      | ReactNode;
  }) =>
    typeof children === 'function' ? (
      <div>{children({ code: 'PLN', name: 'Polish złoty' })}</div>
    ) : (
      <div>{children}</div>
    ),
  ComboboxItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@transactions/api', () => ({
  getAccountStatistics: (...args: unknown[]) => getAccountStatistics(...args),
}));

vi.mock('@transactions/utils', () => ({
  formatCurrencyAmount: (amount: number, currency: string) =>
    `${amount.toFixed(2)} ${currency}`,
  getTransactionNamedResourceLabel: (
    resource: { name: string; type: 'system' | 'user' },
    tNamedResources: (key: string) => string,
  ) => (resource.type === 'system' ? tNamedResources(resource.name) : resource.name),
}));

vi.mock('@ui', () => ({
  Card: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Collapsible: ({ header, children }: { header: ReactNode; children: ReactNode }) => (
    <div>
      <div>{header}</div>
      <div>{children}</div>
    </div>
  ),
  LoadingCard: ({ title }: { title: string }) => <div>{title}</div>,
}));

const renderPage = () => {
  const client = createTestQueryClient();

  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <TransactionAccountStatistics />
      </QueryClientProvider>,
    ),
  };
};

describe('TransactionAccountStatistics', () => {
  it('renders grouped account balances', async () => {
    getAccountStatistics.mockResolvedValueOnce({
      normalizedTotalAmount: 73.45,
      currencies: [
        {
          currency: 'PLN',
          totalAmount: 73.45,
          totalItems: 6,
          normalizedTotalAmount: 73.45,
          accounts: [
            {
              accountId: 'account-1',
              accountName: 'Main',
              accountType: 'user',
              totalAmount: 123.45,
              totalItems: 4,
              normalizedTotalAmount: 123.45,
            },
            {
              accountId: 'account-2',
              accountName: 'cash',
              accountType: 'system',
              totalAmount: -50,
              totalItems: 2,
              normalizedTotalAmount: -50,
            },
          ],
        },
      ],
    });

    const { container } = renderPage();

    expect(await screen.findByText('accountStatistics')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('overflow-y-auto');
    expect(getAccountStatistics).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      transactionType: 'income',
      currency: 'PLN',
      baseCurrency: 'PLN',
    });
    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('PLN');
    expect(screen.getByText('2 accounts')).toBeInTheDocument();
    expect(screen.getByText('showClear:false')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) => element?.textContent === 'Liczba transakcji: 4',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('6 transakcji')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(
      screen.getAllByText((_, element) => element?.textContent === '+123.45 PLN').length,
    ).toBeGreaterThan(1);
    expect(
      screen.getAllByText((_, element) => element?.textContent === '+73.45 PLN').length,
    ).toBeGreaterThan(1);
    expect(
      screen
        .getAllByText((_, element) => element?.textContent === '+123.45 PLN')
        .find((element) => element.parentElement?.classList.contains('text-bt-primary'))
        ?.parentElement,
    ).toHaveClass('text-bt-primary');
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
