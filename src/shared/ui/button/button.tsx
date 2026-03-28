import clsx from 'clsx';
import { type ComponentProps, forwardRef } from 'react';

import { cn } from '@shared/utils';

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
  ({ variant, className, children, ...props }, ref) => {
    variant = variant ?? 'default';
    let variantClassName = '';

    switch (variant) {
      case 'primary':
        variantClassName = clsx(
          'bg-bt-primary text-bt-primary-subtle border-bt-primary-border',
          'hover:bg-bt-primary-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bt-primary-ring',
        );
        break;
      case 'secondary':
        variantClassName = clsx(
          'bg-bt-secondary text-bt-secondary-subtle border-bt-secondary-border',
          'hover:bg-bt-secondary-hover active:bg-bt-secondary-active',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bt-secondary-ring',
        );
        break;
      case 'ghost':
        variantClassName = clsx(
          'bg-transparent hover:bg-bt-ghost-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border',
          'disabled:bg-transparent disabled:text-text-muted',
        );
        break;
      case 'destructive':
        variantClassName = clsx(
          'bg-destructive text-destructive-foreground border-destructive-border',
          'hover:bg-destructive-hover active:bg-destructive-active',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-destructive-ring',
        );
        break;
      case 'inverse':
        variantClassName = clsx(
          'bg-bg text-fg border-fg hover:bg-fg/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg',
        );
        break;
      case 'outline':
        variantClassName = clsx(
          'bg-transparent hover:bg-bt-ghost-hover border-fg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border',
        );
        break;
      case 'default':
      default:
        variantClassName = clsx(
          'bg-fg text-bg hover:bg-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bt-secondary-ring',
        );
    }

    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          'border border-transparent p-1 sm:p-2 rounded-lg sm:rounded-xl',
          'text-base sm:text-lg cursor-pointer disabled:cursor-not-allowed',
          'flex items-center justify-center disabled:bg-bt-disabled disabled:text-bg',
          variantClassName,
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
