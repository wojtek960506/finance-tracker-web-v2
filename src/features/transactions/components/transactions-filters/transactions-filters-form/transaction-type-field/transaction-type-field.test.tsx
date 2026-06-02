import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import type { TransactionFiltersFormValues } from '../utils';

import { TransactionTypeField } from './transaction-type-field';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultValues: TransactionFiltersFormValues = {
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  transactionType: '',
  currency: '',
  categoryMode: 'include',
  categoryIds: [],
  excludeCategoryIds: [],
  paymentMethodMode: 'include',
  paymentMethodIds: [],
  excludePaymentMethodIds: [],
  accountMode: 'include',
  accountIds: [],
  excludeAccountIds: [],
};

const renderField = () => {
  const Wrapper = () => {
    const form = useForm<TransactionFiltersFormValues>({
      defaultValues,
    });

    return (
      <FormProvider {...form}>
        <TransactionTypeField />
      </FormProvider>
    );
  };

  return render(<Wrapper />);
};

describe('TransactionTypeField', () => {
  it('renders only expense and income toggles', () => {
    renderField();

    expect(
      screen.queryByRole('button', { name: 'allTransactionTypes' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'expense' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'income' })).toBeInTheDocument();
  });

  it('toggles the selected transaction type on and off', async () => {
    const user = userEvent.setup();
    renderField();

    const expenseButton = screen.getByRole('button', { name: 'expense' });
    const incomeButton = screen.getByRole('button', { name: 'income' });

    expect(expenseButton).toHaveAttribute('aria-pressed', 'false');
    expect(incomeButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(expenseButton);

    expect(expenseButton).toHaveAttribute('aria-pressed', 'true');
    expect(expenseButton).toHaveClass('bg-destructive');
    expect(expenseButton).toHaveClass('text-destructive-foreground');
    expect(incomeButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(expenseButton);

    expect(expenseButton).toHaveAttribute('aria-pressed', 'false');
    expect(expenseButton).toHaveClass('bg-transparent');

    await user.click(incomeButton);

    expect(incomeButton).toHaveAttribute('aria-pressed', 'true');
    expect(incomeButton).toHaveClass('bg-bt-primary');
    expect(incomeButton).toHaveClass('text-bt-primary-subtle');
    expect(expenseButton).toHaveAttribute('aria-pressed', 'false');
  });
});
