import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { type ButtonVariant, getButtonClassName } from '@ui';

export const ButtonLink = ({
  to,
  state,
  className,
  variant = 'inverse',
  children,
  preventFocusOnPress = false,
  onMouseDown,
  disabled = false,
}: {
  to: string;
  state?: unknown;
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
  preventFocusOnPress?: boolean;
  onMouseDown?: ComponentProps<typeof Link>['onMouseDown'];
  disabled?: boolean;
}) => (
  <Link
    to={to}
    state={state}
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : undefined}
    onMouseDown={(event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      if (preventFocusOnPress) {
        event.preventDefault();
      }

      onMouseDown?.(event);
    }}
    onClick={(event) => {
      if (disabled) {
        event.preventDefault();
      }
    }}
    className={getButtonClassName({
      variant,
      className: clsx(
        'py-0 sm:py-0',
        disabled && 'pointer-events-none opacity-70',
        className,
      ),
    })}
  >
    {children}
  </Link>
);
