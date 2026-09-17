import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as api from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { EditSnapshotModal } from './edit-snapshot-modal';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInstruments: vi.fn().mockResolvedValue([
      {
        id: 'inst-1',
        name: 'Apple Inc.',
        nameNormalized: 'apple inc.',
        kind: 'share',
        currency: 'USD',
      },
    ]),
    updateSnapshotOperation: vi.fn().mockResolvedValue({
      id: 'op-1',
      kind: 'snapshot',
      instrumentId: 'inst-1',
      amount: 25000,
      currency: 'USD',
      date: '2026-03-01',
    }),
  };
});

const mockSnapshot: api.InvestmentSnapshotOperation = {
  id: 'op-1',
  kind: 'snapshot',
  ownerId: 'user-1',
  instrumentId: 'inst-1',
  amount: 20000,
  currency: 'USD',
  date: '2026-02-01',
  note: 'Initial snapshot',
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
};

describe('EditSnapshotModal', () => {
  it('renders snapshot form with existing values and submits updates', async () => {
    const onClose = vi.fn();

    renderWithProviders(
      <EditSnapshotModal snapshot={mockSnapshot} isOpen={true} onClose={onClose} />,
    );

    expect(screen.getByText('Edit Balance Snapshot')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial snapshot')).toBeInTheDocument();

    const amountInput = screen.getByDisplayValue('20000');
    fireEvent.change(amountInput, { target: { value: '25000' } });

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.updateSnapshotOperation).toHaveBeenCalledWith('op-1', {
        instrumentId: 'inst-1',
        amount: 25000,
        currency: 'USD',
        date: '2026-02-01',
        note: 'Initial snapshot',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
