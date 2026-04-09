import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NumberInput } from './number-input';

vi.mock('@ui', () => ({
  Input: ({
    ref,
    type,
    onChange,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <div>
      <input {...props} ref={ref} type={type} onChange={onChange} />
      <button
        type="button"
        onClick={() =>
          onChange?.({ target: { value: '1,2' } } as React.ChangeEvent<HTMLInputElement>)
        }
      >
        emit comma
      </button>
      <button
        type="button"
        onClick={() =>
          onChange?.({ target: { value: 'abc' } } as React.ChangeEvent<HTMLInputElement>)
        }
      >
        emit invalid
      </button>
    </div>
  ),
}));

describe('NumberInput', () => {
  it('renders as a numeric input with default step and input mode', () => {
    render(
      <NumberInput
        value="10"
        onValueChange={() => {}}
        decimalPlaces={2}
        aria-label="amount"
      />,
    );

    const input = screen.getByLabelText('amount');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('step', '1');
  });

  it('normalizes commas and forwards valid values', () => {
    const onValueChange = vi.fn();

    render(
      <NumberInput
        value="10"
        onValueChange={onValueChange}
        decimalPlaces={2}
        step="0.01"
        aria-label="amount"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'emit comma' }));
    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '' } });

    expect(onValueChange).toHaveBeenNthCalledWith(1, '1.2');
    expect(onValueChange).toHaveBeenNthCalledWith(2, '');
    expect(screen.getByLabelText('amount')).toHaveAttribute('step', '0.01');
  });

  it('ignores invalid values and too many decimal places', () => {
    const onValueChange = vi.fn();

    render(
      <NumberInput
        value=""
        onValueChange={onValueChange}
        decimalPlaces={2}
        aria-label="amount"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'emit invalid' }));
    fireEvent.change(screen.getByLabelText('amount'), { target: { value: '1.234' } });

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
