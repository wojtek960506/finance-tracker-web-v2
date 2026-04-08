import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ExchangeTransactionForm } from './exchange-transaction-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../shared/currency-select-field', () => ({
  CurrencySelectField: ({ value }: { value: string }) => <div>{value || 'currency-field'}</div>,
}));

vi.mock('../../shared/named-resource-select-field', () => ({
  NamedResourceSelectField: ({ value }: { value: string }) => <div>{value || 'resource-field'}</div>,
}));

vi.mock('@shared/ui', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DateInput: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => void;
  }) => <input aria-label="date" value={value} onChange={(event) => onChange?.(event.target.value)} />,
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  NumberInput: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => <input aria-label="amount" value={value} onChange={(event) => onValueChange(event.target.value)} />,
}));

describe('ExchangeTransactionForm', () => {
  it('submits valid values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ExchangeTransactionForm
        defaultValues={{
          date: '2024-01-03',
          additionalDescription: 'Exchange',
          amountExpense: '10',
          amountIncome: '8',
          currencyExpense: 'USD',
          currencyIncome: 'EUR',
          paymentMethodId: 'pm-1',
          accountId: 'acc-1',
        }}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'saveTransaction' }));

    expect(onSubmit).toHaveBeenCalledWith({
      date: '2024-01-03',
      additionalDescription: 'Exchange',
      amountExpense: '10',
      amountIncome: '8',
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
    });
  });

  it('shows validation messages for empty values', async () => {
    const user = userEvent.setup();

    render(
      <ExchangeTransactionForm
        defaultValues={{
          date: '',
          additionalDescription: '',
          amountExpense: '',
          amountIncome: '',
          currencyExpense: '',
          currencyIncome: '',
          paymentMethodId: '',
          accountId: '',
        }}
        isPending={false}
        mode="create"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'saveTransaction' }));

    expect(screen.getByText('dateRequired')).toBeInTheDocument();
    expect(screen.getByText('amountExpenseRequired')).toBeInTheDocument();
    expect(screen.getByText('amountIncomeRequired')).toBeInTheDocument();
    expect(screen.getByText('expenseCurrencyRequired')).toBeInTheDocument();
    expect(screen.getByText('incomeCurrencyRequired')).toBeInTheDocument();
    expect(screen.getByText('paymentMethodRequired')).toBeInTheDocument();
    expect(screen.getByText('accountRequired')).toBeInTheDocument();
  });
});
