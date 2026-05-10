import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

import { useScrollFocusedInputIntoView } from '@shared/hooks';

type InputProps = ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, onFocus, ...props }, ref) => {
    const scrollFocusedInputIntoView = useScrollFocusedInputIntoView();

    return (
      <input
        {...props}
        ref={ref}
        className={clsx(
          'text-fg px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-bg',
          'focus-within:border-fg focus-within:ring-2 focus-within:ring-blue-300',
          'outline-none',
          'autofill:[-webkit-text-fill-color:theme(colors.fg)]',
          'autofill:shadow-[inset_0_0_0px_1000px_theme(colors.bg)]',
          'disabled:opacity-70 disabled:cursor-not-allowed',
          className,
        )}
        onFocus={(event) => {
          scrollFocusedInputIntoView(event.currentTarget);
          onFocus?.(event);
        }}
      >
        {children}
      </input>
    );
  },
);
