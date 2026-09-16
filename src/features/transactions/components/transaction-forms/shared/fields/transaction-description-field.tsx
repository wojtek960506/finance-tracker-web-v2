import type { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

import { Input } from '@/components/ui/input';

type TransactionDescriptionFieldProps = {
  registration: UseFormRegisterReturn;
  errorMessage?: string;
  disabled?: boolean;
};

export const TransactionDescriptionField = ({
  registration,
  errorMessage,
  disabled,
}: TransactionDescriptionFieldProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Label className="sm:col-span-2">
      <span className={REQUIRED_LABEL_CLASS_NAME}>{t('description')}</span>
      <Input
        className={FIELD_CONTROL_CLASS_NAME}
        placeholder={t('descriptionPlaceholder')}
        disabled={disabled}
        {...registration}
      />
      <FieldError message={errorMessage && t(errorMessage)} />
    </Label>
  );
};
