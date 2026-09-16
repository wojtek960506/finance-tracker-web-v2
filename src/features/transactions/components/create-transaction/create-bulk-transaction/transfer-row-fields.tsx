import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import { FieldError } from '@transactions/components/transaction-forms';

import {
  COMPACT_FIELD_CLASS_NAME,
  COMPACT_LABEL_CLASS_NAME,
  getBulkLabelClassName,
  INLINE_FIELD_CLASS_NAME,
} from './consts';
import type { BulkTransactionFormValues } from './types';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type TransferRowFieldsProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  index: number;
  showLabels: boolean;
};

export const TransferRowFields = ({
  form,
  index,
  showLabels,
}: TransferRowFieldsProps) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.transferValues;

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('date')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.date`}
          render={({ field }) => (
            <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />
          )}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.transferValues.description`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError
          message={errors?.description?.message && t(errors.description.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('amount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.amount`}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              onValueChange={field.onChange}
              decimalPlaces={2}
              step="0.01"
              min="0"
              className={COMPACT_FIELD_CLASS_NAME}
            />
          )}
        />
        <FieldError message={errors?.amount?.message && t(errors.amount.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('currency')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.currency`}
          render={({ field }) => (
            <CurrencySelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              emptyMessage={t('noCurrenciesFound')}
            />
          )}
        />
        <FieldError message={errors?.currency?.message && t(errors.currency.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.paymentMethodId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="paymentMethods"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={errors?.paymentMethodId?.message && t(errors.paymentMethodId.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('fromAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.accountExpenseId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={
            errors?.accountExpenseId?.message && t(errors.accountExpenseId.message)
          }
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('toAccount')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.transferValues.accountIncomeId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError
          message={errors?.accountIncomeId?.message && t(errors.accountIncomeId.message)}
        />
      </Label>
    </div>
  );
};
