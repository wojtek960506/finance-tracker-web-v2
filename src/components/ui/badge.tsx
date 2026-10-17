import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  clsx(
    'inline-flex items-center justify-center rounded-md border font-medium',
    'w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] select-none',
  ),
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        primary:
          'border-bt-primary-border/60 bg-bt-primary/10 text-bt-primary [a&]:hover:bg-bt-primary/20',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-destructive/20 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        outline: 'border-border text-foreground [a&]:hover:bg-muted',
      },
      size: {
        default: 'px-2 py-0.5 text-xs [&_svg]:size-3',
        sm: 'px-1.5 py-0.5 text-[10px] [&_svg]:size-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge };
