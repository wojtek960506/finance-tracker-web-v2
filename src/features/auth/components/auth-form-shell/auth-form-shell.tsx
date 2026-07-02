import type { ComponentProps, ReactNode } from 'react';

import { Card } from '@ui';

type AuthFormShellProps = {
  children: ReactNode;
  cardClassName?: string;
} & ComponentProps<'form'>;

export const AuthFormShell = ({
  children,
  className,
  cardClassName,
  ...props
}: AuthFormShellProps) => (
  <div className="h-full flex justify-center items-center text-base sm:text-lg">
    <Card className={cardClassName ?? 'w-full max-w-[30rem]'}>
      <form {...props} className={className ?? 'flex flex-col'} autoComplete="off">
        {children}
      </form>
    </Card>
  </div>
);
