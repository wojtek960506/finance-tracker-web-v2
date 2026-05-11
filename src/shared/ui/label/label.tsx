import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, ComponentProps<'label'>>(
  ({ children, className, ...props }, ref) => (
    <label ref={ref} {...props} className={clsx('flex flex-col gap-1 sm:gap-2 text-sm sm:text-base', className)}>
      {children}
    </label>
  ),
);
