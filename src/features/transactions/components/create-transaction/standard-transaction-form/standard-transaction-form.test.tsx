import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StandardTransactionForm } from './standard-transaction-form';

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

describe('StandardTransactionForm', () => {
  it('submits valid values and lets the transaction type change', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <StandardTransactionForm
        defaultValues={{
          date: '2024-01-03',
          description: 'Groceries',
          amount: '10',
          currency: 'USD',
          categoryId: 'cat-1',
          paymentMethodId: 'pm-1',
          accountId: 'acc-1',
          transactionType: 'expense',
        }}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'income' }));
    await user.click(screen.getByRole('button', { name: 'saveTransaction' }));

    expect(onSubmit).toHaveBeenCalledWith({
      date: '2024-01-03',
      description: 'Groceries',
      amount: '10',
      currency: 'USD',
      categoryId: 'cat-1',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
      transactionType: 'income',
    });
  });

  it('shows validation messages for empty values', async () => {
    const user = userEvent.setup();

    render(
      <StandardTransactionForm
        defaultValues={{
          date: '',
          description: '',
          amount: '',
          currency: '',
          categoryId: '',
          paymentMethodId: '',
          accountId: '',
          transactionType: 'expense',
        }}
        isPending={false}
        mode="create"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'saveTransaction' }));

    expect(screen.getByText('dateRequired')).toBeInTheDocument();
    expect(screen.getByText('descriptionRequired')).toBeInTheDocument();
    expect(screen.getByText('amountRequired')).toBeInTheDocument();
    expect(screen.getByText('currencyRequired')).toBeInTheDocument();
    expect(screen.getByText('categoryRequired')).toBeInTheDocument();
    expect(screen.getByText('paymentMethodRequired')).toBeInTheDocument();
    expect(screen.getByText('accountRequired')).toBeInTheDocument();
  });
});
