import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Collapsible, Label } from '@shared/ui';
import { NamedResourceSelectField } from '@transactions/components/shared';
import { FieldError } from '@transactions/components/transaction-forms';

import type { InvestmentTransactionFormValues } from '../utils';

type InvestmentAdvancedFieldsProps = {
  control: Control<InvestmentTransactionFormValues>;
  errors: FieldErrors<InvestmentTransactionFormValues>;
  isInitiallyOpen: boolean;
};

export const InvestmentAdvancedFields = ({
  control,
  errors,
  isInitiallyOpen,
}: InvestmentAdvancedFieldsProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="sm:col-span-2">
      <Collapsible
        header={
          <span className="text-base font-medium sm:text-lg">{t('advancedFields')}</span>
        }
        indicatorPosition="left"
        isInitiallyOpen={isInitiallyOpen}
        triggerMode="full-row"
        contentInset="none"
        contentClassName="px-[2px] pb-[2px]"
      >
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <Label>
            <span>{t('paymentMethod')}</span>
            <Controller
              control={control}
              name="paymentMethodId"
              render={({ field }) => (
                <NamedResourceSelectField
                  kind="paymentMethods"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('paymentMethodPlaceholder')}
                />
              )}
            />
            <FieldError
              message={
                errors.paymentMethodId?.message && t(errors.paymentMethodId.message)
              }
            />
          </Label>

          <Label>
            <span>{t('account')}</span>
            <Controller
              control={control}
              name="accountId"
              render={({ field }) => (
                <NamedResourceSelectField
                  kind="accounts"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('accountPlaceholder')}
                />
              )}
            />
            <FieldError
              message={errors.accountId?.message && t(errors.accountId.message)}
            />
          </Label>
        </div>
      </Collapsible>
    </div>
  );
};
