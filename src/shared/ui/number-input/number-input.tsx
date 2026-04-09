import { type ComponentProps, forwardRef } from 'react';

import { Input } from '@ui';

type NumberInputProps = Omit<ComponentProps<'input'>, 'onChange' | 'type'> & {
  value: string;
  onValueChange: (value: string) => void;
  decimalPlaces: number;
};

const NUMBER_PATTERN = /^-?\d*(?:[.,]\d*)?$/;

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { decimalPlaces, onValueChange, value, step, inputMode = 'decimal', ...props },
    ref,
  ) => (
    <Input
      {...props}
      ref={ref}
      type="number"
      inputMode={inputMode}
      step={step ?? 1}
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value.replace(',', '.');

        if (nextValue !== '' && !NUMBER_PATTERN.test(nextValue)) return;

        const fraction = nextValue.split('.')[1];
        if (fraction && fraction.length > decimalPlaces) return;

        onValueChange(nextValue);
      }}
    />
  ),
);
