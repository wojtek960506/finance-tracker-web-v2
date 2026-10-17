import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleForm } from './vehicle-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('VehicleForm', () => {
  it('validates required name field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <VehicleForm
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /form.createSubmit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('form.errors.nameRequired')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <VehicleForm
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const nameInput = screen.getByLabelText(/form.name/i);
    fireEvent.change(nameInput, { target: { value: 'Suzuki SV650' } });

    const brandInput = screen.getByLabelText(/form.brand/i);
    fireEvent.change(brandInput, { target: { value: 'Suzuki' } });

    const modelInput = screen.getByLabelText(/form.model/i);
    fireEvent.change(modelInput, { target: { value: 'SV650' } });

    const yearInput = screen.getByLabelText(/form.productionYear/i);
    fireEvent.change(yearInput, { target: { value: '2007' } });

    // Select motorcycle type
    const motorcycleBtn = screen.getByRole('button', {
      name: /types.motorcycle/i,
    });
    fireEvent.click(motorcycleBtn);

    const submitBtn = screen.getByRole('button', { name: /form.createSubmit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Suzuki SV650',
        brand: 'Suzuki',
        vehicleModel: 'SV650',
        type: 'motorcycle',
        productionYear: 2007,
        slug: '',
        notes: '',
      });
    });
  });

  it('calls onCancel callback when Cancel is clicked', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <VehicleForm
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it('prevents form submission on Enter keydown', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <VehicleForm
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const nameInput = screen.getByLabelText(/form.name/i);
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
