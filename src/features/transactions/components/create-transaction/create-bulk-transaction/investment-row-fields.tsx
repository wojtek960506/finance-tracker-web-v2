import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InstrumentSelectField } from '@features/investments/components/instruments';
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
import { InvestmentOperationKindSelect } from './investment-operation-kind-select';
import type { BulkTransactionFormValues } from './types';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type InvestmentRowFieldsProps = {
  form: UseFormReturn<BulkTransactionFormValues>;
  index: number;
  showLabels: boolean;
  onAddNewInstrument: () => void;
};

export const InvestmentRowFields = ({
  form,
  index,
  showLabels,
  onAddNewInstrument,
}: InvestmentRowFieldsProps) => {
  const { t } = useTranslation('transactions');
  const errors = form.formState.errors.rows?.[index]?.investmentValues;
  const selectedOperationKind = useWatch({
    control: form.control,
    name: `rows.${index}.investmentValues.operationKind`,
  });

  return (
    <div className="flex min-w-max items-start gap-2">
      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>{t('date')}</span>
        <Controller
          control={form.control}
          name={`rows.${index}.investmentValues.date`}
          render={({ field }) => (
            <DateInput {...field} className={COMPACT_FIELD_CLASS_NAME} />
          )}
        />
        <FieldError message={errors?.date?.message && t(errors.date.message)} />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('investmentOperationKind')}
        </span>
        <InvestmentOperationKindSelect
          value={selectedOperationKind}
          onChange={(value) =>
            form.setValue(`rows.${index}.investmentValues.operationKind`, value, {
              shouldDirty: true,
              shouldValidate: form.formState.isSubmitted,
            })
          }
          index={index}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('investmentInstrument')}
        </span>
        <Controller
          control={form.control}
          name={`rows.${index}.investmentValues.instrumentId`}
          render={({ field }) => (
            <InstrumentSelectField
              value={field.value}
              onChange={field.onChange}
              placeholder=""
              searchPlaceholder=""
              onAddNewInstrument={onAddNewInstrument}
              addNewPlacement="menu"
            />
          )}
        />
        <FieldError
          message={errors?.instrumentId?.message && t(errors.instrumentId.message)}
        />
      </Label>

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels, true)}>
          {t('description')}
        </span>
        <Input
          {...form.register(`rows.${index}.investmentValues.description`)}
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
          name={`rows.${index}.investmentValues.amount`}
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
          name={`rows.${index}.investmentValues.currency`}
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
          name={`rows.${index}.investmentValues.paymentMethodId`}
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
          name={`rows.${index}.investmentValues.accountId`}
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

      <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_FIELD_CLASS_NAME}`}>
        <span className={getBulkLabelClassName(showLabels)}>{t('note')}</span>
        <Input
          {...form.register(`rows.${index}.investmentValues.note`)}
          className={COMPACT_FIELD_CLASS_NAME}
        />
        <FieldError message={errors?.note?.message && t(errors.note.message)} />
      </Label>
    </div>
  );
};
