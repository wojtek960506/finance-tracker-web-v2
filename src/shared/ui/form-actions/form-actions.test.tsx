import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FormActions } from './form-actions';

describe('FormActions', () => {
  it('renders cancel and submit buttons with proper labels', () => {
    const onCancel = vi.fn();

    render(
      <FormActions
        onCancel={onCancel}
        submitLabel="Save Changes"
        cancelLabel="Discard"
      />,
    );

    const cancelBtn = screen.getByTestId('form-cancel');
    const submitBtn = screen.getByTestId('form-submit');

    expect(cancelBtn).toHaveTextContent('Discard');
    expect(submitBtn).toHaveTextContent('Save Changes');

    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables buttons and shows submittingLabel when isPending is true', () => {
    render(
      <FormActions
        isPending={true}
        onCancel={vi.fn()}
        submitLabel="Save"
        submittingLabel="Saving..."
      />,
    );

    const cancelBtn = screen.getByTestId('form-cancel');
    const submitBtn = screen.getByTestId('form-submit');

    expect(cancelBtn).toBeDisabled();
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent('Saving...');
  });
});
