import type { ComponentProps, ReactNode } from 'react';

import { Card } from '@ui';

type AuthFormShellProps = {
  children: ReactNode;
} & ComponentProps<'form'>;

export const AuthFormShell = ({ children, className, ...props }: AuthFormShellProps) => (
  <div className="h-full flex justify-center items-center text-base sm:text-lg">
    <Card className="w-120">
      <form {...props} className={className ?? 'flex flex-col'} autoComplete="off">
        {children}
      </form>
    </Card>
  </div>
);
