import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import { FieldError } from '@transactions/components/transaction-forms';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';

import {
  COMPACT_FIELD_CLASS_NAME,
  COMPACT_LABEL_CLASS_NAME,
  getBulkLabelClassName,
  INLINE_FIELD_CLASS_NAME,
} from './consts';
import { StandardTransactionTypeSelect } from './standard-transaction-type-select';
import type { BulkTransactionFormValues } from './types';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type StandardRowFieldsProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  index: number;
  showLabels: boolean;
};

export const StandardRowFields = ({
  form,
  index,
  showLabels,
}: StandardRowFieldsProps) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.standardValues;
  const selectedTransactionType = useWatch({
    control: form.control,
    name: `rows.${index}.standardValues.transactionType`,
  });

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('date')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.date`}
          render={({ field }) => (
            <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />
          )}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('transactionType')}
        </span>
        <StandardTransactionTypeSelect
          value={selectedTransactionType}
          onChange={(value) =>
            form.setValue(`rows.${index}.standardValues.transactionType`, value, {
              shouldDirty: true,
              shouldValidate: form.formState.isSubmitted,
            })
          }
          index={index}
        />
        <FieldError
          message={errors?.transactionType?.message && t(errors.transactionType.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.standardValues.description`)}
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
          name={`rows.${index}.standardValues.amount`}
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
          name={`rows.${index}.standardValues.currency`}
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
        <span className={getBulkLabelClassName(showLabels)}>{t('category')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.categoryId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="categories"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              includeSystem
              excludedSystemNames={[TRANSFER_CATEGORY, EXCHANGE_CATEGORY]}
            />
          )}
        />
        <FieldError
          message={errors?.categoryId?.message && t(errors.categoryId.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.paymentMethodId`}
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
        <span className={getBulkLabelClassName(showLabels)}>{t('account')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.standardValues.accountId`}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder=""
            />
          )}
        />
        <FieldError message={errors?.accountId?.message && t(errors.accountId.message)} />
      </Label>
    </div>
  );
};
