import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  InvestmentInstrumentSummary,
  InvestmentOperation,
} from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InstrumentDetailsPage } from './instrument-details-page';

const mocks = {
  getInstrument: vi.fn(),
  getOperations: vi.fn(),
};

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'inst-1' }),
  };
});

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual<typeof import('@features/investments/api')>(
    '@features/investments/api',
  );
  return {
    ...actual,
    getInstrument: (...args: unknown[]) => mocks.getInstrument(...args),
    getOperations: (...args: unknown[]) => mocks.getOperations(...args),
  };
});

const mockInstrument: InvestmentInstrumentSummary = {
  id: 'inst-1',
  name: 'Apple Inc.',
  kind: 'share',
  currency: 'USD',
  notes: 'Tech giant',
  currentValue: 1200,
  netInvested: 1000,
  totalBought: 1000,
  totalSold: 0,
  totalInterest: 0,
  totalFees: 0,
  pnl: 200,
  roiPercentage: 20,
  lastSnapshotDate: '2026-02-01T00:00:00.000Z',
  operationsCount: 2,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockOperations: InvestmentOperation[] = [
  {
    id: 'op-1',
    kind: 'buy',
    transactionId: 'tx-100',
    instrumentId: 'inst-1',
    amount: 1000,
    currency: 'USD',
    date: '2026-01-15',
    note: 'Initial buy',
    ownerId: 'user-1',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'op-2',
    kind: 'snapshot',
    instrumentId: 'inst-1',
    amount: 1200,
    currency: 'USD',
    date: '2026-02-01',
    note: 'End of month valuation',
    ownerId: 'user-1',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

describe('InstrumentDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders instrument details, metrics, and operations history', async () => {
    mocks.getInstrument.mockResolvedValue(mockInstrument);
    mocks.getOperations.mockResolvedValue(mockOperations);

    renderWithProviders(<InstrumentDetailsPage />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Apple Inc.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Tech giant')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('Back to Instruments')).toBeInTheDocument();

    // Check metrics
    expect(screen.getByText('Current Valuation')).toBeInTheDocument();
    expect(screen.getByText('Net Invested')).toBeInTheDocument();
    expect(screen.getByText('Total Return / Profit')).toBeInTheDocument();
    expect(screen.getByText('Total Operations')).toBeInTheDocument();

    // Check operations ledger
    expect(screen.getByText('Operations History')).toBeInTheDocument();
    expect(screen.getByText('Initial buy')).toBeInTheDocument();
    expect(screen.getByText('End of month valuation')).toBeInTheDocument();
  });

  it('renders not found card when instrument query fails', async () => {
    mocks.getInstrument.mockRejectedValue(new Error('Not found'));
    mocks.getOperations.mockResolvedValue([]);

    renderWithProviders(<InstrumentDetailsPage />);

    expect(await screen.findByText('Instrument not found')).toBeInTheDocument();
  });

  it('opens create snapshot modal when record snapshot is clicked', async () => {
    mocks.getInstrument.mockResolvedValue(mockInstrument);
    mocks.getOperations.mockResolvedValue([]);

    renderWithProviders(<InstrumentDetailsPage />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Apple Inc.' }),
    ).toBeInTheDocument();

    const recordBtns = screen.getAllByRole('button', { name: /record/i });
    fireEvent.click(recordBtns[0]);

    expect(screen.getByText('Record Balance Snapshot')).toBeInTheDocument();
  });
});
