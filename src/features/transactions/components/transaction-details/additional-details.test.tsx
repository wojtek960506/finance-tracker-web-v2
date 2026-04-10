import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  makeTransaction,
  makeTrashedTransaction,
} from '@test-utils/factories/transaction';
import type { Transaction, TransactionDetails } from '@transactions/api';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';

import { AdditionalDetails } from './additional-details';

const mocks = vi.hoisted(() => ({
  language: 'en' as const,
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: mocks.language }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string) => ({
    t: (key: string) => (namespace === 'namedResources' ? `named:${key}` : key),
  }),
}));

vi.mock('@ui', () => ({
  ButtonLink: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={to} data-to={to} className={className}>
      {children}
    </a>
  ),
}));

const baseTransaction: Transaction = makeTransaction();

describe('AdditionalDetails', () => {
  it('renders nothing for non transfer/exchange categories', () => {
    const { container } = render(<AdditionalDetails transaction={baseTransaction} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders reference link for transfer transactions', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: TRANSFER_CATEGORY, type: 'system' },
      refId: 'ref-123',
    };

    render(<AdditionalDetails transaction={transaction} />);

    const link = screen.getByText('goToReferencedTransaction');
    expect(link).toHaveAttribute('href', '/transactions/ref-123');
  });

  it('renders exchange rate and reference link for exchange transactions', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: EXCHANGE_CATEGORY, type: 'system' },
      currencies: 'USD/PLN',
      exchangeRate: 3.5,
      refId: 'ref-123',
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.getByText('exchangeRate')).toBeInTheDocument();
    expect(screen.getByText('1 USD = 3.5000 PLN')).toBeInTheDocument();
    expect(screen.getByText('goToReferencedTransaction')).toHaveAttribute(
      'href',
      '/transactions/ref-123',
    );
  });

  it('handles missing exchange data and reference id', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: EXCHANGE_CATEGORY, type: 'system' },
      currencies: undefined,
      exchangeRate: undefined,
      refId: undefined,
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.queryByText('exchangeRate')).not.toBeInTheDocument();
    expect(screen.queryByText('goToReferencedTransaction')).not.toBeInTheDocument();
  });

  it('uses a custom reference path prefix when provided', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: TRANSFER_CATEGORY, type: 'system' },
      refId: 'trash-ref-123',
    };

    render(
      <AdditionalDetails
        transaction={transaction}
        referencePathPrefix="/transactions/trash"
      />,
    );

    expect(screen.getByText('goToReferencedTransaction')).toHaveAttribute(
      'href',
      '/transactions/trash/trash-ref-123',
    );
  });

  it('does not treat a user category with a reserved system name as a linked transaction kind', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: TRANSFER_CATEGORY, type: 'user' },
      currencies: 'USD/PLN',
      exchangeRate: 3.5,
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.getByText('exchangeRate')).toBeInTheDocument();
    expect(screen.getByText('1 USD = 3.5000 PLN')).toBeInTheDocument();
    expect(screen.queryByText('goToReferencedTransaction')).not.toBeInTheDocument();
  });

  it('renders a referenced transaction summary with only changed fields', () => {
    const transaction: TransactionDetails = {
      ...makeTransaction({
        refId: 'ref-123',
        amount: 10,
        currency: 'USD',
        transactionType: 'expense',
        date: '2024-01-03',
        category: { id: 'cat-1', type: 'user', name: 'Food' },
        paymentMethod: { id: 'pm-1', type: 'paymentMethod', name: 'Card' },
        account: { id: 'acc-1', type: 'account', name: 'Main' },
      }),
      reference: makeTransaction({
        id: 'ref-123',
        amount: 20,
        currency: 'EUR',
        transactionType: 'income',
        date: '2024-01-04',
        category: { id: 'cat-system', type: 'system', name: 'exchange' },
        paymentMethod: { id: 'pm-system', type: 'system', name: 'cash' },
        account: { id: 'acc-system', type: 'system', name: 'savings' },
      }),
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.getByText('referencedTransaction')).toBeInTheDocument();
    expect(screen.getByText('amount')).toHaveClass('text-transaction-income-label');
    expect(screen.getByText('+20.00 EUR')).toHaveClass('text-bt-primary');
    expect(screen.getByText('named:savings')).toBeInTheDocument();
    expect(screen.getByText('named:cash')).toBeInTheDocument();
    expect(screen.getByText('named:exchange')).toBeInTheDocument();
    expect(screen.getByText('1/4/2024')).toBeInTheDocument();
    expect(screen.getByText('goToReferencedTransaction')).toHaveAttribute(
      'href',
      '/transactions/ref-123',
    );
  });

  it('renders reference summary for trashed transaction details too', () => {
    const transaction = {
      ...makeTrashedTransaction({ refId: 'trash-ref-123' }),
      reference: makeTrashedTransaction({
        id: 'trash-ref-123',
        amount: 30,
        currency: 'PLN',
      }),
    };

    render(
      <AdditionalDetails
        transaction={transaction}
        referencePathPrefix="/transactions/trash"
      />,
    );

    expect(screen.getByText('-30.00 PLN')).toBeInTheDocument();
    expect(screen.getByText('goToReferencedTransaction')).toHaveAttribute(
      'href',
      '/transactions/trash/trash-ref-123',
    );
  });

  it('does not render reference summary when referenced transaction has the same visible details', () => {
    const reference = makeTransaction({ id: 'ref-123' });
    const transaction: TransactionDetails = {
      ...makeTransaction({ refId: 'ref-123' }),
      reference,
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.queryByText('referencedTransaction')).not.toBeInTheDocument();
    expect(screen.getByText('goToReferencedTransaction')).toHaveAttribute(
      'href',
      '/transactions/ref-123',
    );
  });

  it('shows amount summary when only currency differs in referenced transaction', () => {
    const transaction: TransactionDetails = {
      ...makeTransaction({ refId: 'ref-123' }),
      reference: makeTransaction({ id: 'ref-123', currency: 'EUR' }),
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.getByText('-10.00 EUR')).toBeInTheDocument();
  });

  it('shows amount summary when only transaction type differs in referenced transaction', () => {
    const transaction: TransactionDetails = {
      ...makeTransaction({ refId: 'ref-123' }),
      reference: makeTransaction({ id: 'ref-123', transactionType: 'income' }),
    };

    render(<AdditionalDetails transaction={transaction} />);

    expect(screen.getByText('+10.00 USD')).toBeInTheDocument();
  });
});
