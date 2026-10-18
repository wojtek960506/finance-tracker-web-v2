import '@shared/i18n';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DeleteRecordModal } from './delete-record-modal';

describe('DeleteRecordModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    isPending: false,
    title: 'Delete Item Record',
    prompt: 'Are you sure you want to delete this item record?',
    hint: 'This action is irreversible.',
    confirmLabel: 'Delete Item',
    cancelLabel: 'Cancel',
    testIdPrefix: 'item',
  };

  it('renders modal with title, prompt, hint, and children', () => {
    render(
      <DeleteRecordModal {...defaultProps}>
        <div data-testid="item-preview">Running Shoes - 250 PLN</div>
      </DeleteRecordModal>,
    );

    expect(screen.getByTestId('delete-item-modal')).toBeInTheDocument();
    expect(screen.getByText('Delete Item Record')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this item record?'),
    ).toBeInTheDocument();
    expect(screen.getByText('This action is irreversible.')).toBeInTheDocument();
    expect(screen.getByTestId('item-preview')).toBeInTheDocument();
  });

  it('renders function children when item is provided', () => {
    const item = { id: '1', name: 'Road Bike' };

    render(
      <DeleteRecordModal {...defaultProps} item={item}>
        {(record) => <div data-testid="item-preview">{record.name}</div>}
      </DeleteRecordModal>,
    );

    expect(screen.getByTestId('item-preview')).toHaveTextContent('Road Bike');
  });

  it('returns null when item is explicitly null', () => {
    const { container } = render(
      <DeleteRecordModal {...defaultProps} item={null}>
        <div>Preview</div>
      </DeleteRecordModal>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('triggers onConfirm when clicking confirm button', () => {
    render(<DeleteRecordModal {...defaultProps} />);

    const confirmBtn = screen.getByTestId('confirm-delete-item-button');
    fireEvent.click(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('handles async onConfirm and toggles pending state', async () => {
    let resolveConfirm: () => void = () => {};
    const onConfirmAsync = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve;
        }),
    );

    render(
      <DeleteRecordModal
        {...defaultProps}
        onConfirm={onConfirmAsync}
        isPending={undefined}
      />,
    );

    const confirmBtn = screen.getByTestId('confirm-delete-item-button');
    fireEvent.click(confirmBtn);

    expect(confirmBtn).toBeDisabled();

    resolveConfirm();
    await waitFor(() => {
      expect(confirmBtn).not.toBeDisabled();
    });
  });

  it('triggers onClose when clicking cancel button', () => {
    render(<DeleteRecordModal {...defaultProps} />);

    const cancelBtn = screen.getByTestId('cancel-delete-item-button');
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isPending is true', () => {
    render(<DeleteRecordModal {...defaultProps} isPending={true} />);

    const cancelBtn = screen.getByTestId('cancel-delete-item-button');
    const confirmBtn = screen.getByTestId('confirm-delete-item-button');

    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();
  });
});
