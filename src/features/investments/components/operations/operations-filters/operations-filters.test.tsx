import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { InvestmentInstrument } from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationsFilters } from './operations-filters';

const mockInstruments: InvestmentInstrument[] = [
  {
    id: 'inst-1',
    name: 'Apple Inc',
    nameNormalized: 'apple inc',
    kind: 'share',
    currency: 'USD',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ownerId: 'user-1',
  },
];

describe('OperationsFilters', () => {
  it('renders filters correctly and triggers search change', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onKindChange = vi.fn();
    const onInstrumentChange = vi.fn();

    renderWithProviders(
      <OperationsFilters
        searchQuery=""
        onSearchQueryChange={onSearchChange}
        selectedKind="all"
        onSelectedKindChange={onKindChange}
        selectedInstrumentId="all"
        onSelectedInstrumentIdChange={onInstrumentChange}
        instruments={mockInstruments}
      />,
    );

    expect(screen.getByTestId('operations-filters')).toBeInTheDocument();

    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Apple');
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('triggers kind change when clicking kind buttons', async () => {
    const user = userEvent.setup();
    const onKindChange = vi.fn();

    renderWithProviders(
      <OperationsFilters
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        selectedKind="all"
        onSelectedKindChange={onKindChange}
        selectedInstrumentId="all"
        onSelectedInstrumentIdChange={vi.fn()}
        instruments={mockInstruments}
      />,
    );

    const snapshotBtn = screen.getByRole('button', { name: /snapshot|wycena/i });
    await user.click(snapshotBtn);
    expect(onKindChange).toHaveBeenCalledWith('snapshot');
  });
});
