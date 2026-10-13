import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

import { FORM_CONTROL_SIZE_CLASS, FORM_CONTROL_SURFACE_CLASS } from '@shared/consts';

type InputProps = ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={clsx(
        'w-full min-w-0 outline-none',
        FORM_CONTROL_SIZE_CLASS,
        FORM_CONTROL_SURFACE_CLASS,
        'placeholder:text-text-muted',
        'autofill:[-webkit-text-fill-color:theme(colors.fg)]',
        'autofill:shadow-[inset_0_0_0px_1000px_theme(colors.bg)]',
        className,
      )}
    >
      {children}
    </input>
  ),
);
