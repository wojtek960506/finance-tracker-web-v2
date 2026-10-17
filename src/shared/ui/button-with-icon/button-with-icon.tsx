import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Button, type ButtonVariant } from '../button';

export type IconPosition = 'left' | 'right';

export type ButtonWithIconProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Mandatory Lucide icon */
  icon: LucideIcon;
  /** Position of the icon relative to the text (default: 'left') */
  iconPosition?: IconPosition;
  /** Custom icon styling (e.g. adjust size or color) */
  iconClassName?: string;
  variant?: ButtonVariant;
  label?: ReactNode;
  children?: ReactNode;
};

export const ButtonWithIcon = ({
  icon: Icon,
  iconPosition = 'left',
  iconClassName,
  variant = 'primary',
  label,
  children,
  className,
  ...props
}: ButtonWithIconProps) => {
  const iconElement = <Icon className={clsx('size-5 shrink-0', iconClassName)} />;

  return (
    <Button
      variant={variant}
      className={clsx(
        'flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold',
        'sm:h-11 sm:px-5 sm:text-base shrink-0',
        className,
      )}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {label ? <span>{label}</span> : null}
      {children}
      {iconPosition === 'right' && iconElement}
    </Button>
  );
};
