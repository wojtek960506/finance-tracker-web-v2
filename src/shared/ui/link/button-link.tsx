import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { type ButtonVariant, getButtonClassName } from '@ui';

export const ButtonLink = ({
  to,
  state,
  className,
  variant = 'inverse',
  children,
}: {
  to: string;
  state?: unknown;
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
}) => (
  <Link
    to={to}
    state={state}
    className={getButtonClassName({
      variant,
      className: clsx('py-0 sm:py-0', className),
    })}
  >
    {children}
  </Link>
);
