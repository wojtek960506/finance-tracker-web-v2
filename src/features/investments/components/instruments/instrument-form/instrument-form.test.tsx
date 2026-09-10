import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InstrumentForm } from './instrument-form';
import { getDefaultInstrumentFormValues } from './utils';

vi.mock('@transactions/components/shared', () => ({
  CurrencySelectField: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      data-testid="mock-currency-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('InstrumentForm', () => {
  it('validates required name field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InstrumentForm
        defaultValues={getDefaultInstrumentFormValues()}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const submitBtn = screen.getByRole('button', { name: /form.createSubmit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('nameRequired')).toBeInTheDocument();
      expect(screen.getByText('currencyRequired')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InstrumentForm
        defaultValues={getDefaultInstrumentFormValues()}
        isPending={false}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const nameInput = screen.getByLabelText(/form.name/i);
    fireEvent.change(nameInput, { target: { value: 'S&P 500 ETF' } });

    const notesInput = screen.getByLabelText(/form.notes/i);
    fireEvent.change(notesInput, { target: { value: 'Core portfolio' } });

    const currencyInput = screen.getByTestId('mock-currency-select');
    fireEvent.change(currencyInput, { target: { value: 'USD' } });

    const submitBtn = screen.getByRole('button', { name: /form.createSubmit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'S&P 500 ETF',
        kind: 'share',
        currency: 'USD',
        notes: 'Core portfolio',
      });
    });
  });

  it('calls onCancel callback when Cancel is clicked', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InstrumentForm
        defaultValues={getDefaultInstrumentFormValues()}
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

  it('prevents form submission on Enter keypress inside inputs', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InstrumentForm
        defaultValues={getDefaultInstrumentFormValues()}
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
