import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleFormActions } from './vehicle-form-actions';

describe('VehicleFormActions', () => {
  it('renders submit and cancel buttons with default labels', () => {
    const handleCancel = vi.fn();

    render(
      <VehicleFormActions
        isPending={false}
        onCancel={handleCancel}
        submitLabel="Create"
        submitTestId="submit-btn"
        cancelTestId="cancel-btn"
      />,
    );

    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Create');
    expect(screen.getByTestId('cancel-btn')).toHaveTextContent('Cancel');

    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('shows saving label and disables buttons when isPending is true', () => {
    const handleCancel = vi.fn();

    render(
      <VehicleFormActions
        isPending={true}
        onCancel={handleCancel}
        submitLabel="Create"
        submitTestId="submit-btn"
        cancelTestId="cancel-btn"
      />,
    );

    expect(screen.getByTestId('submit-btn')).toBeDisabled();
    expect(screen.getByTestId('cancel-btn')).toBeDisabled();
    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Saving...');
  });

  it('uses custom submittingLabel when provided', () => {
    render(
      <VehicleFormActions
        isPending={true}
        onCancel={vi.fn()}
        submitLabel="Save"
        submittingLabel="Loading..."
        submitTestId="submit-btn"
      />,
    );

    expect(screen.getByTestId('submit-btn')).toHaveTextContent('Loading...');
  });
});
