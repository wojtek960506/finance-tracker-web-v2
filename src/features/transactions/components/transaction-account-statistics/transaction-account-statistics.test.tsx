import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { TransactionAccountStatistics } from './transaction-account-statistics';

const getAccountStatistics = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string) => ({
    t: (key: string) =>
      namespace === 'namedResources' && key === 'cash' ? 'Cash' : key,
  }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@transactions/api', () => ({
  getAccountStatistics: (...args: unknown[]) => getAccountStatistics(...args),
}));

vi.mock('@transactions/utils', () => ({
  formatCurrencyAmount: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  getTransactionNamedResourceLabel: (
    resource: { name: string; type: 'system' | 'user' },
    tNamedResources: (key: string) => string,
  ) => (resource.type === 'system' ? tNamedResources(resource.name) : resource.name),
}));

vi.mock('@ui', () => ({
  Card: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  LoadingState: ({ title }: { title: string }) => <div>{title}</div>,
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
      currencies: [
        {
          currency: 'PLN',
          totalAmount: 73.45,
          totalItems: 6,
          accounts: [
            {
              accountId: 'account-1',
              accountName: 'Main',
              accountType: 'user',
              totalAmount: 123.45,
              totalItems: 4,
            },
            {
              accountId: 'account-2',
              accountName: 'cash',
              accountType: 'system',
              totalAmount: -50,
              totalItems: 2,
            },
          ],
        },
      ],
    });

    const { container } = renderPage();

    expect(await screen.findByText('accountStatistics')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('h-full', 'overflow-y-auto');
    expect(screen.getByText('PLN')).toBeInTheDocument();
    expect(screen.getByText('2 accounts')).toBeInTheDocument();
    expect(screen.getByText('73.45 PLN')).toBeInTheDocument();
    expect(screen.getByText('totalItems: 6')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(screen.getByText('+123.45 PLN').parentElement).toHaveClass('text-bt-primary');
    expect(screen.getByText('-50.00 PLN').parentElement).toHaveClass('text-destructive');
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('transactionsCount')).toHaveLength(2);
  });
});
