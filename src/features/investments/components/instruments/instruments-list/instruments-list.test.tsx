import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InstrumentsList } from './instruments-list';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn(),
    getInvestmentSummary: vi
      .fn()
      .mockResolvedValue({ totalsByCurrency: {}, instruments: [] }),
    createInstrument: vi.fn(),
    updateInstrument: vi.fn(),
    deleteInstrument: vi.fn(),
  };
});

const mockInstruments: investmentsApi.InvestmentInstrument[] = [
  {
    id: 'inst-1',
    name: 'Apple Inc.',
    nameNormalized: 'apple inc.',
    kind: 'share',
    currency: 'USD',
    notes: 'Tech',
    ownerId: 'user-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'inst-2',
    name: 'Vanguard All-World',
    nameNormalized: 'vanguard all-world',
    kind: 'fund',
    currency: 'EUR',
    notes: 'ETF',
    ownerId: 'user-1',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('InstrumentsList', () => {
  it('renders instruments list and allows filtering by search', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);

    renderWithProviders(<InstrumentsList />);

    expect(await screen.findByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Vanguard All-World')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search instruments/i);
    fireEvent.change(searchInput, { target: { value: 'Apple' } });

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.queryByText('Vanguard All-World')).not.toBeInTheDocument();
  });

  it('renders empty state when no instruments exist', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue([]);

    renderWithProviders(<InstrumentsList />);

    expect(await screen.findByText(/no investment instruments/i)).toBeInTheDocument();
    expect(screen.queryByTestId('instruments-list-header')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add first instrument/i }),
    ).toBeInTheDocument();
  });

  it('renders no results empty state with clear filters button when search matches nothing', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);

    renderWithProviders(<InstrumentsList />);

    expect(await screen.findByText('Apple Inc.')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search instruments/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    expect(await screen.findByText(/no matching instruments/i)).toBeInTheDocument();
    expect(
      screen.getByText(/try changing your search query or filters/i),
    ).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearBtn);

    expect(await screen.findByText('Apple Inc.')).toBeInTheDocument();
  });

  it('filters instruments by status (active vs closed)', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.getInvestmentSummary).mockResolvedValue({
      totalsByCurrency: {},
      instruments: [
        {
          id: 'inst-1',
          name: 'Apple Inc.',
          kind: 'share',
          currency: 'USD',
          currentValue: 1200,
          netInvested: 1000,
          totalBought: 1000,
          totalSold: 0,
          totalInterest: 0,
          totalFees: 0,
          pnl: 200,
          roiPercentage: 20,
          lastSnapshotDate: '2026-02-01',
          operationsCount: 2,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'inst-2',
          name: 'Vanguard All-World',
          kind: 'fund',
          currency: 'EUR',
          currentValue: 0,
          netInvested: 0,
          totalBought: 500,
          totalSold: 500,
          totalInterest: 0,
          totalFees: 0,
          pnl: 0,
          roiPercentage: 0,
          lastSnapshotDate: '2026-02-01',
          operationsCount: 2,
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ],
    });

    renderWithProviders(<InstrumentsList />);

    expect(await screen.findByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Vanguard All-World')).toBeInTheDocument();

    // Filter by Active
    const activeBtn = screen.getByRole('button', { name: /^active$/i });
    fireEvent.click(activeBtn);

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.queryByText('Vanguard All-World')).not.toBeInTheDocument();

    // Filter by Closed
    const closedBtn = screen.getByRole('button', { name: /^closed$/i });
    fireEvent.click(closedBtn);

    expect(screen.queryByText('Apple Inc.')).not.toBeInTheDocument();
    expect(screen.getByText('Vanguard All-World')).toBeInTheDocument();
  });

  it('sorts active instruments before closed instruments in the list', async () => {
    // In mockInstruments, inst-2 (closed) was originally second, but let's reverse input order
    const mockUnsorted = [
      {
        id: 'inst-closed-first',
        name: 'Zero Balance Fund',
        nameNormalized: 'zero balance fund',
        kind: 'fund' as const,
        currency: 'EUR' as const,
        ownerId: 'user-1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'inst-active-second',
        name: 'Active Growth ETF',
        nameNormalized: 'active growth etf',
        kind: 'fund' as const,
        currency: 'EUR' as const,
        ownerId: 'user-1',
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      },
    ];

    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockUnsorted);
    vi.mocked(investmentsApi.getInvestmentSummary).mockResolvedValue({
      totalsByCurrency: {},
      instruments: [
        {
          id: 'inst-closed-first',
          name: 'Zero Balance Fund',
          kind: 'fund',
          currency: 'EUR',
          currentValue: 0,
          netInvested: 0,
          totalBought: 500,
          totalSold: 500,
          totalInterest: 0,
          totalFees: 0,
          pnl: 0,
          roiPercentage: 0,
          lastSnapshotDate: null,
          operationsCount: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'inst-active-second',
          name: 'Active Growth ETF',
          kind: 'fund',
          currency: 'EUR',
          currentValue: 1500,
          netInvested: 1000,
          totalBought: 1000,
          totalSold: 0,
          totalInterest: 0,
          totalFees: 0,
          pnl: 500,
          roiPercentage: 50,
          lastSnapshotDate: '2026-02-01',
          operationsCount: 1,
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ],
    });

    renderWithProviders(<InstrumentsList />);

    expect(await screen.findByText('Active Growth ETF')).toBeInTheDocument();
    expect(screen.getByText('Zero Balance Fund')).toBeInTheDocument();

    const renderedCards = screen.getAllByTestId('instrument-card');
    // Active should come first
    expect(renderedCards[0]).toHaveTextContent('Active Growth ETF');
    expect(renderedCards[1]).toHaveTextContent('Zero Balance Fund');
  });
});
