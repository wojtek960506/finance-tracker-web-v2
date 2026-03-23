import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

type InputProps = ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      className={clsx(
        ' text-fg px-3 py-2 rounded-lg bg-bg',
        'focus-within:border-fg focus-within:ring-2 focus-within:ring-blue-300',
        'outline-none',
        'autofill:[-webkit-text-fill-color:theme(colors.fg)]',
        'autofill:shadow-[inset_0_0_0px_1000px_theme(colors.bg)]',
        className,
      )}
    >
      {children}
    </input>
  ),
);
