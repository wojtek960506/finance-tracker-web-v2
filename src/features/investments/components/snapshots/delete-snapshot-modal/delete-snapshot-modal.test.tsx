import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { DeleteSnapshotModal } from './delete-snapshot-modal';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    deleteOperation: vi.fn(),
  };
});

const mockSnapshot: investmentsApi.InvestmentSnapshotOperation = {
  id: 'op-snap-1',
  kind: 'snapshot',
  instrumentId: 'inst-1',
  amount: 5000,
  currency: 'USD',
  date: '2026-03-01',
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
  ownerId: 'user-1',
};

const mockInstrument: investmentsApi.InvestmentInstrument = {
  id: 'inst-1',
  name: 'Apple Inc.',
  nameNormalized: 'apple inc.',
  kind: 'share',
  currency: 'USD',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ownerId: 'user-1',
};

describe('DeleteSnapshotModal', () => {
  it('calls deleteOperation on confirm and closes modal', async () => {
    vi.mocked(investmentsApi.deleteOperation).mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });
    const onClose = vi.fn();

    renderWithProviders(
      <DeleteSnapshotModal
        snapshot={mockSnapshot}
        instrument={mockInstrument}
        isOpen={true}
        onClose={onClose}
      />,
    );

    expect(screen.getByText(/apple inc\./i)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /delete snapshot/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(investmentsApi.deleteOperation).toHaveBeenCalledWith('op-snap-1');
    });

    expect(onClose).toHaveBeenCalled();
  });
});
