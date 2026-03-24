import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@ui';

export const GhostLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) => (
  <Link to={to}>
    <Button variant="ghost" className={clsx('py-0 sm:py-0', className)}>
      {children}
    </Button>
  </Link>
);
