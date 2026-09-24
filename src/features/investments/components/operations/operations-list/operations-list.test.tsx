import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationsList } from './operations-list';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn(),
    getOperations: vi.fn(),
  };
});

const mockInstruments: investmentsApi.InvestmentInstrument[] = [
  {
    id: 'inst-1',
    name: 'Apple Inc.',
    nameNormalized: 'apple inc.',
    kind: 'share',
    currency: 'USD',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ownerId: 'user-1',
  },
];

const mockOperations: investmentsApi.InvestmentOperation[] = [
  {
    id: 'op-1',
    kind: 'snapshot',
    instrumentId: 'inst-1',
    amount: 10000,
    currency: 'USD',
    date: '2026-03-01',
    note: 'Q1 balance',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'op-2',
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
  },
];

describe('OperationsList', () => {
  it('renders loading state initially', () => {
    vi.mocked(investmentsApi.getInstruments).mockReturnValue(new Promise(() => {}));
    vi.mocked(investmentsApi.getOperations).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<OperationsList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders operations and filters by operation kind', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue(mockOperations);

    renderWithProviders(<OperationsList />);

    expect(await screen.findByText('Q1 balance')).toBeInTheDocument();
    expect(screen.getByText('Bought 10 shares')).toBeInTheDocument();

    const snapshotFilterBtn = screen.getByRole('button', { name: /^snapshot$/i });
    fireEvent.click(snapshotFilterBtn);

    expect(screen.getByText('Q1 balance')).toBeInTheDocument();
    expect(screen.queryByText('Bought 10 shares')).not.toBeInTheDocument();
  });

  it('renders empty state when no operations exist in account', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue([]);

    renderWithProviders(<OperationsList />);

    expect(await screen.findByText(/no operations yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('operations-list-header')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /record first snapshot/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /new investment/i })).toBeInTheDocument();
  });

  it('renders no results empty state with clear filters button when filters match nothing', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue(mockOperations);

    renderWithProviders(<OperationsList />);

    expect(await screen.findByText('Q1 balance')).toBeInTheDocument();

    const interestFilterBtn = screen.getByRole('button', { name: /^interest$/i });
    fireEvent.click(interestFilterBtn);

    expect(await screen.findByText(/no matching operations/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try changing your search query or filters/i),
    ).toBeInTheDocument();

    const clearBtns = screen.getAllByRole('button', { name: /clear filters/i });
    fireEvent.click(clearBtns[0]);

    expect(await screen.findByText('Q1 balance')).toBeInTheDocument();
    expect(screen.getByText('Bought 10 shares')).toBeInTheDocument();
  });

  it('opens create snapshot modal when record snapshot button is clicked', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue(mockOperations);

    renderWithProviders(<OperationsList />);

    const recordBtn = await screen.findByRole('button', { name: /record snapshot/i });
    fireEvent.click(recordBtn);

    expect(
      screen.getByRole('dialog', { name: /record balance snapshot/i }),
    ).toBeInTheDocument();
  });

  it('opens delete snapshot modal when trash button is clicked on a snapshot card', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getOperations).mockResolvedValue(mockOperations);

    renderWithProviders(<OperationsList />);

    const deleteBtn = await screen.findByRole('button', { name: /delete snapshot/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole('dialog', { name: /delete snapshot/i })).toBeInTheDocument();
  });
});
