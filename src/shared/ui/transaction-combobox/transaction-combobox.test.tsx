import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import type { Transaction, TransactionsResponse } from '@transactions/api';
import * as transactionsApi from '@transactions/api';

import { TransactionCombobox } from './transaction-combobox';

vi.mock('@/components/ui/combobox', () => ({
  Combobox: ({
    items,
    value,
    onValueChange,
    children,
  }: {
    items: Transaction[];
    value: Transaction | null;
    onValueChange: (tx: Transaction | null) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="combobox-root">
      <span data-testid="combobox-current-value">{value?.id ?? 'none'}</span>
      {children}
      <div data-testid="mock-combobox-items">
        {items.map((tx) => (
          <button
            key={tx.id}
            type="button"
            data-testid={`transaction-item-${tx.id}`}
            onClick={() => onValueChange(tx)}
          >
            {tx.description}
          </button>
        ))}
      </div>
    </div>
  ),
  ComboboxInput: ({ placeholder }: { placeholder?: string }) => (
    <input data-testid="transaction-combobox-input" placeholder={placeholder} readOnly />
  ),
  ComboboxContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComboboxEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComboboxList: ({
    children,
  }: {
    children: ((item: Transaction) => React.ReactNode) | React.ReactNode;
  }) => <div>{typeof children === 'function' ? null : children}</div>,
  ComboboxItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TransactionCombobox', () => {
  let queryClient = createTestQueryClient();

  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      kind: 'standard',
      date: '2026-10-15T12:00:00.000Z',
      amount: 150,
      currency: 'PLN',
      description: 'Sport Shoes Store',
      transactionType: 'expense',
      category: { id: 'c-1', name: 'Sport', type: 'system' },
      paymentMethod: { id: 'pm-1', name: 'Card', type: 'user' },
      account: { id: 'a-1', name: 'Main', type: 'user' },
      createdAt: '2026-10-15T12:00:00.000Z',
      updatedAt: '2026-10-15T12:00:00.000Z',
      ownerId: 'u-1',
      sourceIndex: 1,
    },
    {
      id: 'tx-2',
      kind: 'standard',
      date: '2026-10-15T08:00:00.000Z',
      amount: 50,
      currency: 'PLN',
      description: 'Grocery Shop',
      transactionType: 'expense',
      category: { id: 'c-2', name: 'Groceries', type: 'user' },
      paymentMethod: { id: 'pm-1', name: 'Card', type: 'user' },
      account: { id: 'a-1', name: 'Main', type: 'user' },
      createdAt: '2026-10-15T08:00:00.000Z',
      updatedAt: '2026-10-15T08:00:00.000Z',
      ownerId: 'u-1',
      sourceIndex: 2,
    },
  ];

  const mockResponse: TransactionsResponse = {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    items: mockTransactions,
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(mockResponse);
  });

  const renderComponent = (
    props: Partial<Parameters<typeof TransactionCombobox>[0]> = {},
  ) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TransactionCombobox
          value={null}
          onChange={vi.fn()}
          targetDate="2026-10-15T00:00:00.000Z"
          targetAmount={150}
          dateFilter="exact"
          {...props}
        />
      </QueryClientProvider>,
    );
  };

  it('renders input with placeholder', async () => {
    renderComponent({ searchPlaceholder: 'Find transaction...' });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-combobox-input')).toHaveAttribute(
        'placeholder',
        'Find transaction...',
      );
    });
  });

  it('filters transactions using categoryPredicate when provided', async () => {
    renderComponent({
      categoryPredicate: (cat) => cat === 'Sport',
    });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument();
      expect(screen.queryByTestId('transaction-item-tx-2')).not.toBeInTheDocument();
    });
  });

  it('renders all transactions when no categoryPredicate is provided', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-item-tx-2')).toBeInTheDocument();
    });
  });

  it('selects transaction when clicked', async () => {
    const onChange = vi.fn();
    renderComponent({ onChange });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('transaction-item-tx-1'));
    expect(onChange).toHaveBeenCalledWith(mockTransactions[0]);
  });
});
