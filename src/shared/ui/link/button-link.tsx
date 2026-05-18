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
}: {
  to: string;
  state?: unknown;
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
  preventFocusOnPress?: boolean;
  onMouseDown?: ComponentProps<typeof Link>['onMouseDown'];
}) => (
  <Link
    to={to}
    state={state}
    onMouseDown={(event) => {
      if (preventFocusOnPress) {
        event.preventDefault();
      }

      onMouseDown?.(event);
    }}
    className={getButtonClassName({
      variant,
      className: clsx('py-0 sm:py-0', className),
    })}
  >
    {children}
  </Link>
);
