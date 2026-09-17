import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { CreateSnapshotModal } from './create-snapshot-modal';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    createSnapshotOperation: vi.fn(),
    getInstruments: vi.fn(),
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

describe('CreateSnapshotModal', () => {
  it('submits snapshot creation payload and closes modal', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    vi.mocked(investmentsApi.createSnapshotOperation).mockResolvedValue({
      id: 'op-new',
      kind: 'snapshot',
      instrumentId: 'inst-1',
      amount: 4000,
      currency: 'USD',
      date: '2026-03-15',
      createdAt: '2026-03-15T00:00:00Z',
      updatedAt: '2026-03-15T00:00:00Z',
      ownerId: 'user-1',
    });

    const onClose = vi.fn();

    renderWithProviders(
      <CreateSnapshotModal
        isOpen={true}
        onClose={onClose}
        defaultInstrumentId="inst-1"
      />,
    );

    const instrumentInput = await screen.findByDisplayValue('Apple Inc.');
    expect(instrumentInput).toBeInTheDocument();
    expect(instrumentInput).toBeDisabled();

    const amountInput = screen.getByLabelText(/balance amount/i);
    fireEvent.change(amountInput, { target: { value: '4000' } });

    const submitBtn = screen.getByRole('button', { name: /record snapshot/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(investmentsApi.createSnapshotOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          instrumentId: 'inst-1',
          amount: 4000,
          currency: 'USD',
        }),
      );
    });

    expect(onClose).toHaveBeenCalled();
  });
});
