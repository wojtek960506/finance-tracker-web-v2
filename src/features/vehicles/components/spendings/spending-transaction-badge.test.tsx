import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

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
    expect(screen.getByText('Linked')).toBeInTheDocument();
  });

  it('renders interactive unlinked badge and triggers onLink on click', () => {
    const onLink = vi.fn();
    render(
      <MemoryRouter>
        <SpendingTransactionBadge onLink={onLink} />
      </MemoryRouter>,
    );

    const unlinkedBtn = screen.getByTestId('unlinked-transaction-badge');
    expect(unlinkedBtn).toBeInTheDocument();
    expect(screen.getByText('Unlinked')).toBeInTheDocument();

    fireEvent.click(unlinkedBtn);
    expect(onLink).toHaveBeenCalledTimes(1);
  });

  it('renders non-interactive unlinked indicator when onLink is omitted', () => {
    render(
      <MemoryRouter>
        <SpendingTransactionBadge />
      </MemoryRouter>,
    );

    const unlinkedSpan = screen.getByTestId('unlinked-transaction-badge');
    expect(unlinkedSpan.tagName).toBe('SPAN');
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
