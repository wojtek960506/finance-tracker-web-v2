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

type ExchangeRowFieldsProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  index: number;
  showLabels: boolean;
};

export const ExchangeRowFields = ({
  form,
  index,
  showLabels,
}: ExchangeRowFieldsProps) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.exchangeValues;

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('date')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.date`}
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
          {...form.register(`rows.${index}.exchangeValues.description`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError
          message={errors?.description?.message && t(errors.description.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amountExpense')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.amountExpense`}
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
        <FieldError
          message={errors?.amountExpense?.message && t(errors.amountExpense.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('expenseCurrency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.currencyExpense`}
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
        <FieldError
          message={errors?.currencyExpense?.message && t(errors.currencyExpense.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('amountIncome')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.amountIncome`}
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
        <FieldError
          message={errors?.amountIncome?.message && t(errors.amountIncome.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('incomeCurrency')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.currencyIncome`}
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
        <FieldError
          message={errors?.currencyIncome?.message && t(errors.currencyIncome.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('paymentMethod')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.exchangeValues.paymentMethodId`}
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
          name={`rows.${index}.exchangeValues.accountExpenseId`}
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
          name={`rows.${index}.exchangeValues.accountIncomeId`}
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
