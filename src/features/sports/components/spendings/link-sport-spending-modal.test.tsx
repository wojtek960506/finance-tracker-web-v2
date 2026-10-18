import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import type { Transaction, TransactionsResponse } from '@transactions/api';
import * as transactionsApi from '@transactions/api';

import * as sportsApi from '../../api/sport-spendings-api';
import type { SportSpendingTarget } from '../../api/types';

import { LinkSportSpendingModal } from './link-sport-spending-modal';

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

describe('LinkSportSpendingModal', () => {
  let queryClient = createTestQueryClient();

  const mockTarget: SportSpendingTarget = {
    id: 'entry-1',
    costPln: 150,
    date: '2026-10-15T00:00:00.000Z',
    itemName: 'Tennis Racket',
    categoryName: 'Tennis',
  };

  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      kind: 'standard',
      date: '2026-10-15T12:00:00.000Z',
      amount: 150,
      currency: 'PLN',
      description: 'Tennis Shop',
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
      amount: 40,
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
    targets?: SportSpendingTarget[];
    onClose?: () => void;
    onSuccess?: () => void;
  }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LinkSportSpendingModal
          isOpen={props.isOpen ?? true}
          targets={props.targets !== undefined ? props.targets : [mockTarget]}
          onClose={props.onClose ?? vi.fn()}
          onSuccess={props.onSuccess ?? vi.fn()}
        />
      </QueryClientProvider>,
    );
  };

  it('does not render when targets array is empty', () => {
    renderModal({ targets: [] });
    expect(screen.queryByTestId('link-sport-spending-modal')).not.toBeInTheDocument();
  });

  it('renders target activity details and filter chips', () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    renderModal({});

    expect(screen.getByTestId('link-sport-spending-modal')).toBeInTheDocument();
    expect(screen.getByText('Tennis Racket')).toBeInTheDocument();
    expect(screen.getByText(/• Tennis/)).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-exact')).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-window')).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-all-dates')).toBeInTheDocument();
    expect(screen.getByTestId('filter-chip-sport-category')).toBeInTheDocument();
  });

  it('renders multiple activities count when batch linking', () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    const secondTarget: SportSpendingTarget = {
      id: 'entry-2',
      costPln: 50,
      date: '2026-10-15T00:00:00.000Z',
      itemName: 'Tennis Balls',
      categoryName: 'Tennis',
    };

    renderModal({ targets: [mockTarget, secondTarget] });

    expect(screen.getByText(/2 aktywności|2 activities/i)).toBeInTheDocument();
  });

  it('toggles filter chips correctly', () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    renderModal({});

    const windowChip = screen.getByTestId('filter-chip-window');
    fireEvent.click(windowChip);
    expect(windowChip).toHaveClass('font-semibold');

    const sportChip = screen.getByTestId('filter-chip-sport-category');
    fireEvent.click(sportChip);
    expect(screen.getByText(/wszystkie kategorie|all categories/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('cancel-link-sport-spending-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('links spending to selected transaction successfully', async () => {
    vi.spyOn(transactionsApi, 'getTransactions').mockResolvedValue(
      mockTransactionsResponse,
    );
    const linkSpy = vi
      .spyOn(sportsApi, 'linkSportSpendings')
      .mockResolvedValueOnce({ acknowledged: true, modifiedCount: 1 });
    const onSuccess = vi.fn();
    const onClose = vi.fn();

    renderModal({ onSuccess, onClose });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-item-tx-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('transaction-item-tx-1'));

    const confirmBtn = screen.getByTestId('confirm-link-sport-spending-button');
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalledWith({
        transactionId: 'tx-1',
        entryIds: ['entry-1'],
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
