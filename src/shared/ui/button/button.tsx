import { type ComponentProps, forwardRef } from 'react';

import {
  type ButtonSize,
  type ButtonVariant,
  getButtonClassName,
} from './get-button-class-name';

export type { ButtonSize, ButtonVariant };

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      className={getButtonClassName({ variant, size, className })}
    >
      {children}
    </button>
  ),
);
