import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type {
  InvestmentCashFlowOperation,
  InvestmentInstrument,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationCard } from './operation-card';

const mockInstrument: InvestmentInstrument = {
  id: 'inst-1',
  name: 'Apple Inc',
  kind: 'share',
  currency: 'USD',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ownerId: 'user-1',
};

const mockSnapshot: InvestmentSnapshotOperation = {
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
  it('renders snapshot operation correctly', () => {
    renderWithProviders(
      <OperationCard operation={mockSnapshot} instrument={mockInstrument} />,
    );

    expect(screen.getByTestId('operation-card')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc')).toBeInTheDocument();
    expect(screen.getByText('Monthly valuation')).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
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
