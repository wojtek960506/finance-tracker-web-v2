import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { InvestmentInstrument } from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InstrumentCard } from './instrument-card';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

const mockInstrument: InvestmentInstrument = {
  id: 'inst-1',
  name: 'Apple Inc.',
  nameNormalized: 'apple inc.',
  kind: 'share',
  currency: 'USD',
  notes: 'Tech giant',
  ownerId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('InstrumentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders instrument details correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Apple Inc.' })).toHaveAttribute(
      'href',
      '/investments/instruments/inst-1',
    );
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('Tech giant')).toBeInTheDocument();
  });

  it('navigates to instrument details when clicking on the card', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    const card = screen.getByTestId('instrument-card');
    fireEvent.click(card);

    expect(mocks.navigate).toHaveBeenCalledWith('/investments/instruments/inst-1');
  });

  it('triggers onEdit callback when edit button is clicked without navigating', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    const editBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(mockInstrument);
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('triggers onDelete callback when delete button is clicked without navigating', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(mockInstrument);
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
