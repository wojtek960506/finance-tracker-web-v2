import { type ComponentProps, forwardRef } from 'react';

import { getButtonClassName } from './get-button-class-name';

export type ButtonVariant =
  | 'default'
  | 'inverse'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'ghost'
  | 'outline';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, children, ...props }, ref) => (
    <button {...props} ref={ref} className={getButtonClassName({ variant, className })}>
      {children}
    </button>
  ),
);
