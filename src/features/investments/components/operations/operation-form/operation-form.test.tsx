import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as investmentsApi from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { OperationForm } from './operation-form';
import { getDefaultOperationFormValues } from './utils';

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

describe('OperationForm', () => {
  it('validates required fields and submits form data', async () => {
    vi.spyOn(investmentsApi, 'getInstruments').mockResolvedValue(mockInstruments);
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    renderWithProviders(
      <OperationForm
        defaultValues={getDefaultOperationFormValues('inst-1', 'USD')}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const amountInput = screen.getByLabelText(/balance/i);
    fireEvent.change(amountInput, { target: { value: '1500.50' } });

    const submitBtn = screen.getByRole('button', { name: /record snapshot/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          instrumentId: 'inst-1',
          amount: 1500.5,
          currency: 'USD',
        }),
      );
    });
  });

  it('renders operation kind toggle for cash-flow instruments like savings/termDeposit', async () => {
    const savingsInstrument: investmentsApi.InvestmentInstrument = {
      id: 'inst-savings',
      name: 'High Yield Savings',
      nameNormalized: 'high yield savings',
      kind: 'savings',
      currency: 'USD',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      ownerId: 'user-1',
    };
    vi.spyOn(investmentsApi, 'getInstruments').mockResolvedValue([savingsInstrument]);
    const onSubmit = vi.fn();

    renderWithProviders(
      <OperationForm
        defaultValues={getDefaultOperationFormValues('inst-savings', 'USD', 'interest')}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    expect(await screen.findByTestId('operation-kind-interest')).toBeInTheDocument();
    expect(screen.getByTestId('operation-kind-fee')).toBeInTheDocument();

    const feeButton = screen.getByTestId('operation-kind-fee');
    fireEvent.click(feeButton);

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '25.00' } });

    const submitBtn = screen.getByRole('button', { name: /record operation/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          instrumentId: 'inst-savings',
          kind: 'fee',
          amount: 25,
          currency: 'USD',
        }),
      );
    });
  });
});
