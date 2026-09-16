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
    expect(
      screen.getByRole('button', { name: /add first instrument/i }),
    ).toBeInTheDocument();
  });
});
