import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { SpendingTransactionBadge } from './spending-transaction-badge';

describe('SpendingTransactionBadge', () => {
  it('renders linked transaction badge pointing to transaction route', () => {
    render(
      <MemoryRouter>
        <SpendingTransactionBadge transactionId="tx-123" />
      </MemoryRouter>,
    );

    const badge = screen.getByTestId('linked-transaction-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('href', '/transactions/tx-123');
    expect(badge).toHaveClass('text-bt-primary');
    expect(screen.getByText('Linked')).toBeInTheDocument();
  });

  it('renders informational unlinked badge with warning color and not a button', () => {
    render(
      <MemoryRouter>
        <SpendingTransactionBadge />
      </MemoryRouter>,
    );

    const unlinkedBadge = screen.getByTestId('unlinked-transaction-badge');
    expect(unlinkedBadge).toBeInTheDocument();
    expect(unlinkedBadge.tagName).toBe('SPAN');
    expect(unlinkedBadge).toHaveClass('text-warning');
    expect(screen.getByText('Unlinked')).toBeInTheDocument();
  });

  it('applies sm size styling', () => {
    render(
      <MemoryRouter>
        <SpendingTransactionBadge transactionId="tx-456" size="sm" />
      </MemoryRouter>,
    );

    const badge = screen.getByTestId('linked-transaction-badge');
    expect(badge).toHaveClass('text-[10px]');
  });
});
