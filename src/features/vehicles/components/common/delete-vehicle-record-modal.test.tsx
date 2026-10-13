import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DeleteVehicleRecordModal } from './delete-vehicle-record-modal';

describe('DeleteVehicleRecordModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    isPending: false,
    title: 'Delete Service Record',
    prompt: 'Are you sure you want to delete this service record?',
    hint: 'This action is irreversible.',
    confirmLabel: 'Delete Service',
    cancelLabel: 'Cancel',
    testIdPrefix: 'service',
  };

  it('renders modal with title, prompt, hint, and children', () => {
    render(
      <DeleteVehicleRecordModal {...defaultProps}>
        <div data-testid="service-preview">Oil Change - 250 PLN</div>
      </DeleteVehicleRecordModal>,
    );

    expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
    expect(screen.getByText('Delete Service Record')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this service record?'),
    ).toBeInTheDocument();
    expect(screen.getByText('This action is irreversible.')).toBeInTheDocument();
    expect(screen.getByTestId('service-preview')).toBeInTheDocument();
  });

  it('triggers onConfirm when clicking confirm button', () => {
    render(<DeleteVehicleRecordModal {...defaultProps} />);

    const confirmBtn = screen.getByTestId('confirm-delete-service-button');
    fireEvent.click(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when clicking cancel button', () => {
    render(<DeleteVehicleRecordModal {...defaultProps} />);

    const cancelBtn = screen.getByTestId('cancel-delete-service-button');
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isPending is true', () => {
    render(<DeleteVehicleRecordModal {...defaultProps} isPending={true} />);

    const cancelBtn = screen.getByTestId('cancel-delete-service-button');
    const confirmBtn = screen.getByTestId('confirm-delete-service-button');

    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();
  });
});
