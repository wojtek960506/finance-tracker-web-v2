import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as vehiclesApi from '@vehicles/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import type { Transaction, TransactionsResponse } from '@transactions/api';
import * as transactionsApi from '@transactions/api';

import { LinkSpendingModal } from './link-spending-modal';
import type { SpendingTarget } from './types';

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

describe('LinkSpendingModal', () => {
  let queryClient = createTestQueryClient();

  const mockTarget: SpendingTarget = {
    id: 'fuel-101',
    type: 'fuel',
    costPln: 250,
    date: '2026-10-15T00:00:00.000Z',
    title: 'Orlen Pb95',
    vehicleName: 'Toyota Corolla',
  };

  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      kind: 'standard',
      date: '2026-10-15T12:00:00.000Z',
      amount: 250,
      currency: 'PLN',
      description: 'Orlen Gas Station',
      transactionType: 'expense',
      category: { id: 'c-1', name: 'Transport', type: 'system' },
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
      amount: 45,
      currency: 'PLN',
      description: 'Supermarket',
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

  const mockTransactionsResponse: TransactionsResponse = {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    items: mockTransactions,
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const renderModal = (props: {
    isOpen?: boolean;
    target?: SpendingTarget | null;
    onClose?: () => void;
    onSuccess?: () => void;
  }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LinkSpendingModal
          isOpen={props.isOpen ?? true}
          target={props.target !== undefined ? props.target : mockTarget}
          onClose={props.onClose ?? vi.fn()}
          onSuccess={props.onSuccess ?? vi.fn()}
        />
      </QueryClientProvider>,
    );
  };

  it('does not render when target is null', () => {
    renderModal({ target: null });
    expect(screen.queryByTestId('link-spending-modal')).not.toBeInTheDocument();
  });

  it('renders target spending details and filter chips', () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    renderModal({});

    expect(screen.getByTestId('link-spending-modal')).toBeInTheDocument();
    expect(screen.getByText('Orlen Pb95')).toBeInTheDocument();
    expect(screen.getByText(/Toyota Corolla/)).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-exact')).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-window')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-chip-all-dates')).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-transport-category')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-chip-all-categories')).not.toBeInTheDocument();
  });

  it('switches filter chips and updates active state', () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    renderModal({});

    const windowChip = screen.getByTestId('filter-chip-window');
    fireEvent.click(windowChip);
    expect(windowChip).toHaveClass('font-semibold');

    const exactChip = screen.getByTestId('filter-chip-exact');
    fireEvent.click(exactChip);
    expect(exactChip).toHaveClass('font-semibold');
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    const cancelButton = screen.getByTestId('cancel-link-spending-button');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('links spending to selected transaction successfully', async () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    const linkSpy = vi.spyOn(vehiclesApi, 'linkSpendings').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
    });
    const onSuccess = vi.fn();
    const onClose = vi.fn();

    renderModal({ onSuccess, onClose });

    // Open combobox input
    const input = screen.getByTestId('transaction-combobox-input');
    fireEvent.focus(input);
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument();
    });

    // Select the first transaction
    fireEvent.click(screen.getByTestId('transaction-item-tx-1'));

    const confirmButton = screen.getByTestId('confirm-link-spending-button');
    expect(confirmButton).not.toBeDisabled();
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalledWith({
        transactionId: 'tx-1',
        spendings: [{ spendingType: 'fuel', spendingId: 'fuel-101' }],
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
