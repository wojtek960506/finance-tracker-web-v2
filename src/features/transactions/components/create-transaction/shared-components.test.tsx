import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FieldError, FieldSection, TransactionFormActions } from './shared-components';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('transaction shared components', () => {
  it('renders a field section with the provided class name', () => {
    render(
      <FieldSection className="custom-class">
        <span>Field</span>
      </FieldSection>,
    );

    expect(screen.getByText('Field').parentElement).toHaveClass('custom-class');
  });

  it('renders a field error only when a message exists', () => {
    const { rerender } = render(<FieldError />);
    expect(screen.queryByText('Error')).not.toBeInTheDocument();

    rerender(<FieldError message="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders create actions and calls cancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<TransactionFormActions isPending={false} mode="create" onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'cancel' }));

    expect(onCancel).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'saveTransaction' })).toBeInTheDocument();
  });

  it('renders update pending label when updating', () => {
    render(<TransactionFormActions isPending mode="update" onCancel={() => {}} />);

    expect(screen.getByRole('button', { name: 'updatingTransaction' })).toBeDisabled();
  });
});
