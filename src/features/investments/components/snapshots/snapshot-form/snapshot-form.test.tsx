import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { SnapshotForm } from './snapshot-form';
import { getDefaultSnapshotFormValues } from './utils';

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
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

describe('SnapshotForm', () => {
  it('renders form fields correctly', () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);

    renderWithProviders(
      <SnapshotForm
        defaultValues={getDefaultSnapshotFormValues()}
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByTestId('snapshot-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/balance amount/i)).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    vi.mocked(investmentsApi.getInstruments).mockResolvedValue(mockInstruments);
    const onSubmit = vi.fn();

    renderWithProviders(
      <SnapshotForm
        defaultValues={{
          instrumentId: 'inst-1',
          amount: 5000,
          currency: 'USD',
          date: '2026-03-15',
          note: 'Q1 balance',
        }}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /record snapshot/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        instrumentId: 'inst-1',
        amount: 5000,
        currency: 'USD',
        date: '2026-03-15',
        note: 'Q1 balance',
      });
    });
  });
});
