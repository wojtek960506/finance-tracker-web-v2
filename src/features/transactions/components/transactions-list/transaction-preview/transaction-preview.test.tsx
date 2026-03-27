import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { Transaction } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
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
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const baseTransaction: Transaction = makeTransaction();

describe('TransactionPreview', () => {
  it('renders transaction info and links', () => {
    render(
      <MemoryRouter>
        <TransactionPreview transaction={baseTransaction} />
      </MemoryRouter>,
    );

    const formattedDate = new Date(baseTransaction.date).toLocaleDateString('en-US');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText('10.00 USD')).toBeInTheDocument();
    expect(screen.getByText('Test transaction')).toBeInTheDocument();

    expect(screen.getByText('Main')).toHaveAttribute('href', '/accounts');
    expect(screen.getByText('Card')).toHaveAttribute('href', '/paymentMethods');
    expect(screen.getByText('Food')).toHaveAttribute('href', '/categories');
    expect(screen.getByTestId('transaction-preview-link')).toHaveAttribute(
      'href',
      '/transactions/tx-1',
    );
  });
});
