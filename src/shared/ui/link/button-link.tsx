import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { type ButtonVariant, getButtonClassName } from '@ui';

export const ButtonLink = ({
  to,
  className,
  variant = 'inverse',
  children,
}: {
  to: string;
  className?: string;
  variant?: ButtonVariant;
  children: ReactNode;
}) => (
  <Link
    to={to}
    className={getButtonClassName({
      variant,
      className: clsx('py-0 sm:py-0', className),
    })}
  >
    {children}
  </Link>
);
