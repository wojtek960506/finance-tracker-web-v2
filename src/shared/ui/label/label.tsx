import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, ComponentProps<'label'>>(
  ({ children, className, ...props }, ref) => (
    <label
      ref={ref}
      {...props}
      className={clsx('flex min-w-0 max-w-full flex-col gap-1 text-sm sm:text-base', className)}
    >
      {children}
    </label>
  ),
);
