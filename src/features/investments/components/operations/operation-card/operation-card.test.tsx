import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type {
  InvestmentCashFlowOperation,
  InvestmentInstrument,
  InvestmentOperation,
} from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationCard } from './operation-card';

const mockInstrument: InvestmentInstrument = {
  id: 'inst-1',
  name: 'Apple Inc',
  nameNormalized: 'apple inc',
  kind: 'share',
  currency: 'USD',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ownerId: 'user-1',
};

const mockSnapshot: InvestmentOperation = {
  id: 'op-snap-1',
  kind: 'snapshot',
  instrumentId: 'inst-1',
  amount: 15000,
  currency: 'USD',
  date: '2026-03-01',
  note: 'Monthly valuation',
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
  ownerId: 'user-1',
};

const mockCashFlow: InvestmentCashFlowOperation = {
  id: 'op-cf-1',
  kind: 'buy',
  transactionId: 'tx-123',
  instrumentId: 'inst-1',
  amount: 2500,
  currency: 'USD',
  date: '2026-02-15',
  note: 'Bought 10 shares',
  createdAt: '2026-02-15T00:00:00Z',
  updatedAt: '2026-02-15T00:00:00Z',
  ownerId: 'user-1',
};

describe('OperationCard', () => {
  it('renders snapshot operation correctly with edit and delete callbacks', () => {
    const onEditOperation = vi.fn();
    const onDeleteOperation = vi.fn();

    renderWithProviders(
      <OperationCard
        operation={mockSnapshot}
        instrument={mockInstrument}
        onEditOperation={onEditOperation}
        onDeleteOperation={onDeleteOperation}
      />,
    );

    expect(screen.getByTestId('operation-card')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc')).toBeInTheDocument();
    expect(screen.getByText('Monthly valuation')).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: /edit snapshot/i });
    fireEvent.click(editBtn);
    expect(onEditOperation).toHaveBeenCalledWith(mockSnapshot);

    const deleteBtn = screen.getByRole('button', { name: /delete snapshot/i });
    fireEvent.click(deleteBtn);
    expect(onDeleteOperation).toHaveBeenCalledWith(mockSnapshot);
  });

  it('renders cash flow operation with link to transaction', () => {
    renderWithProviders(
      <OperationCard operation={mockCashFlow} instrument={mockInstrument} />,
    );

    expect(screen.getByTestId('operation-card')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc')).toBeInTheDocument();
    expect(screen.getByText('Bought 10 shares')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/transactions/tx-123');
  });
});
