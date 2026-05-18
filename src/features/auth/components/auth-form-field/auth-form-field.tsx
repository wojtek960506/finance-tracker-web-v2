import clsx from 'clsx';
import type { ReactNode } from 'react';

import { REQUIRED_LABEL_CLASS_NAME } from '@transactions/components/transaction-forms';
import { Label } from '@ui';

type AuthFormFieldProps = {
  label: ReactNode;
  children: ReactNode;
  error?: ReactNode;
  required?: boolean;
};

const LABEL_CLASS_NAME = 'text-base sm:text-lg font-semibold sm:font-bold mt-2';
const ERROR_CLASS_NAME = 'text-destructive text-xs sm:text-sm h-4 sm:h-5 my-1';

export const AuthFormField = ({
  label,
  children,
  error,
  required = false,
}: AuthFormFieldProps) => (
  <>
    <Label>
      <span className={clsx(LABEL_CLASS_NAME, required && REQUIRED_LABEL_CLASS_NAME)}>
        {label}
      </span>
      {children}
    </Label>
    {error && <p className={ERROR_CLASS_NAME}>{error}</p>}
  </>
);
