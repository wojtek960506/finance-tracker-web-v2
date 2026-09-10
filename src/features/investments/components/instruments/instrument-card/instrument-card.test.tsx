import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { InvestmentInstrument } from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { InstrumentCard } from './instrument-card';

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
  it('renders instrument details correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('Tech giant')).toBeInTheDocument();
  });

  it('triggers onEdit callback when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    const editBtn = screen.getByRole('button', { name: /edit instrument/i });
    fireEvent.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(mockInstrument);
  });

  it('triggers onDelete callback when delete button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <InstrumentCard instrument={mockInstrument} onEdit={onEdit} onDelete={onDelete} />,
    );

    const deleteBtn = screen.getByRole('button', { name: /delete instrument/i });
    fireEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(mockInstrument);
  });
});
