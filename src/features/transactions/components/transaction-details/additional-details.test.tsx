import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { Transaction } from '@transactions/api';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';

import { AdditionalDetails } from './additional-details';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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

  it('does not treat a user category with a reserved system name as linked transaction kind', () => {
    const transaction: Transaction = {
      ...baseTransaction,
      category: { ...baseTransaction.category, name: TRANSFER_CATEGORY, type: 'user' },
      refId: 'ref-123',
      currencies: 'USD/PLN',
      exchangeRate: 3.5,
    };

    const { container } = render(<AdditionalDetails transaction={transaction} />);

    expect(container).toBeEmptyDOMElement();
  });
});
