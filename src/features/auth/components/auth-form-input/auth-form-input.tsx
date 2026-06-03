import type { HTMLInputTypeAttribute } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AuthFormField } from '../auth-form-field';

import { FIELD_CONTROL_CLASS_NAME } from '@/features/transactions/components/transaction-forms';
import { Input } from '@/shared/ui';

type AuthFormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder: string;
  getFieldErrorMessage?: (fieldName: Path<T>) => string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
};

export const AuthFormInput = <T extends FieldValues>({
  form,
  name,
  placeholder,
  getFieldErrorMessage,
  type = 'text',
}: AuthFormInputProps<T>) => {
  const { t } = useTranslation('auth');

  return (
    <AuthFormField label={t(name)} required error={getFieldErrorMessage?.(name)}>
      <Input
        {...form.register(name)}
        id={String(name)}
        type={type}
        placeholder={t(placeholder)}
        autoComplete="off"
        className={FIELD_CONTROL_CLASS_NAME}
      />
    </AuthFormField>
  );
};
