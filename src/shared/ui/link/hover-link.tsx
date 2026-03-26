import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const HoverLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="hover:text-active-nav">
    {children}
  </Link>
);
