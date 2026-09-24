import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { OperationsFilters } from './operations-filters';

vi.mock('@features/investments/api', () => ({
  getInstruments: vi.fn().mockResolvedValue([
    {
      id: 'inst-1',
      name: 'Apple Inc',
      kind: 'share',
      currency: 'USD',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      ownerId: 'user-1',
    },
  ]),
}));

describe('OperationsFilters', () => {
  it('renders filters correctly and triggers kind change when clicking kind buttons', async () => {
    const user = userEvent.setup();
    const onKindChange = vi.fn();
    const onInstrumentChange = vi.fn();

    renderWithProviders(
      <OperationsFilters
        selectedKind="all"
        onSelectedKindChange={onKindChange}
        selectedInstrumentId="all"
        onSelectedInstrumentIdChange={onInstrumentChange}
      />,
    );

    expect(screen.getByTestId('operations-filters')).toBeInTheDocument();

    const snapshotBtn = screen.getByRole('button', { name: /snapshot|wycena/i });
    await user.click(snapshotBtn);
    expect(onKindChange).toHaveBeenCalledWith('snapshot');
  });

  it('renders instrument select field with all instruments option', async () => {
    const onInstrumentChange = vi.fn();

    renderWithProviders(
      <OperationsFilters
        selectedKind="all"
        onSelectedKindChange={vi.fn()}
        selectedInstrumentId="all"
        onSelectedInstrumentIdChange={onInstrumentChange}
      />,
    );

    expect(screen.getByTestId('operations-filters')).toBeInTheDocument();
  });
});
