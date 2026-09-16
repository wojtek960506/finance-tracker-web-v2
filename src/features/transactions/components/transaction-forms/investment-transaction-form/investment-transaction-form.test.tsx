import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InvestmentTransactionForm } from './investment-transaction-form';
import { getDefaultInvestmentTransactionFormValues } from './utils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en-US' } }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@features/investments/components/instruments', () => ({
  InstrumentSelectField: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      data-testid="mock-instrument-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  CreateInstrumentModal: () => null,
}));

vi.mock('@transactions/components/shared', async () => {
  const actual = await vi.importActual<typeof import('@transactions/components/shared')>(
    '@transactions/components/shared',
  );
  return {
    ...actual,
    CurrencySelectField: ({
      value,
      onChange,
    }: {
      value: string;
      onChange: (v: string) => void;
    }) => (
      <input
        data-testid="mock-currency-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    NamedResourceSelectField: ({ value }: { value: string }) => (
      <div>{value || 'resource-field'}</div>
    ),
  };
});

describe('InvestmentTransactionForm', () => {
  it('validates required fields on submit', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InvestmentTransactionForm
        defaultValues={getDefaultInvestmentTransactionFormValues()}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /saveTransaction/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('dateRequired')).toBeInTheDocument();
      expect(screen.getByText('amountRequired')).toBeInTheDocument();
      expect(screen.getByText('currencyRequired')).toBeInTheDocument();
      expect(screen.getByText('descriptionRequired')).toBeInTheDocument();
      expect(screen.getByText('instrumentRequired')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid values and selected operation kind', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <InvestmentTransactionForm
        defaultValues={getDefaultInvestmentTransactionFormValues({
          date: '2026-09-10',
          amount: '500',
          currency: 'USD',
          description: 'Buy Apple stock',
          instrumentId: 'inst-1',
          operationKind: 'buy',
          note: '5 shares @ 100',
        })}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const sellBtn = screen.getByTestId('operation-kind-sell');
    await user.click(sellBtn);

    const submitBtn = screen.getByRole('button', { name: /saveTransaction/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        date: '2026-09-10',
        amount: '500',
        currency: 'USD',
        description: 'Buy Apple stock',
        instrumentId: 'inst-1',
        operationKind: 'sell',
        note: '5 shares @ 100',
        paymentMethodId: '',
        accountId: '',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <InvestmentTransactionForm
        defaultValues={getDefaultInvestmentTransactionFormValues()}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it('prevents form submission on Enter inside description input', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InvestmentTransactionForm
        defaultValues={getDefaultInvestmentTransactionFormValues()}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const descInput = screen.getByLabelText(/description/i);
    fireEvent.keyDown(descInput, { key: 'Enter', code: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
