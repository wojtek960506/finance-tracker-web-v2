import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TransactionActionModal } from './transaction-action-modal';

vi.mock('@ui', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Modal: ({
    isOpen,
    children,
    ariaLabel,
  }: {
    isOpen: boolean;
    children: ReactNode;
    ariaLabel: string;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label={ariaLabel}>
        {children}
      </div>
    ) : null,
}));

describe('TransactionActionModal', () => {
  it('renders destructive styling and triggers modal actions', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <TransactionActionModal
        isOpen
        onClose={onClose}
        ariaLabel="Delete transaction"
        title="Delete?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={onConfirm}
        tone="destructive"
      >
        <p>Body</p>
      </TransactionActionModal>,
    );

    expect(
      screen.getByRole('dialog', { name: 'Delete transaction' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Delete?')).toHaveClass('text-[var(--color-destructive)]');
    expect(screen.getByText('Delete?').parentElement?.parentElement).toHaveClass(
      'bg-destructive/10',
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });

  it('disables both actions when pending and respects confirmDisabled', () => {
    render(
      <TransactionActionModal
        isOpen
        onClose={vi.fn()}
        ariaLabel="Restore transaction"
        title="Restore?"
        cancelLabel="Cancel"
        confirmLabel="Restore"
        onConfirm={vi.fn()}
        confirmVariant="primary"
        isPending
        confirmDisabled
      >
        <p>Body</p>
      </TransactionActionModal>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Restore' })).toBeDisabled();
  });
});
