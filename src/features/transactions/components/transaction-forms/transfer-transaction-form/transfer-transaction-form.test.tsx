import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TransferTransactionForm } from './transfer-transaction-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/components/shared', async () => {
  const actual = await vi.importActual<typeof import('@transactions/components/shared')>(
    '@transactions/components/shared',
  );
  return {
    ...actual,
    CurrencySelectField: ({ value }: { value: string }) => (
      <div>{value || 'currency-field'}</div>
    ),
    NamedResourceSelectField: ({ value }: { value: string }) => (
      <div>{value || 'resource-field'}</div>
    ),
  };
});

vi.mock('@shared/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Collapsible: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header: React.ReactNode;
  }) => (
    <div>
      {header}
      {children}
    </div>
  ),
  DateInput: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <input
      aria-label="date"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Label: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props}>{children}</label>,
  NumberInput: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <input
      aria-label="amount"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    />
  ),
}));

describe('TransferTransactionForm', () => {
  it('submits valid values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TransferTransactionForm
        defaultValues={{
          date: '2024-01-03',
          description: 'Move funds',
          amount: '10',
          currency: 'USD',
          paymentMethodId: 'pm-1',
          accountExpenseId: 'acc-1',
          accountIncomeId: 'acc-2',
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
      description: 'Move funds',
      amount: '10',
      currency: 'USD',
      paymentMethodId: 'pm-1',
      accountExpenseId: 'acc-1',
      accountIncomeId: 'acc-2',
    });
  });

  it('allows the same account for both transfer sides', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TransferTransactionForm
        defaultValues={{
          date: '2024-01-03',
          description: 'Move funds',
          amount: '10',
          currency: 'USD',
          paymentMethodId: 'pm-1',
          accountExpenseId: 'acc-1',
          accountIncomeId: 'acc-1',
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
      description: 'Move funds',
      amount: '10',
      currency: 'USD',
      paymentMethodId: 'pm-1',
      accountExpenseId: 'acc-1',
      accountIncomeId: 'acc-1',
    });
  });

  it('shows validation messages for empty and invalid values', async () => {
    const user = userEvent.setup();

    render(
      <TransferTransactionForm
        defaultValues={{
          date: '',
          description: '',
          amount: '',
          currency: '',
          paymentMethodId: '',
          accountExpenseId: '',
          accountIncomeId: '',
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
  });
});
