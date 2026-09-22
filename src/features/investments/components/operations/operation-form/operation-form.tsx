import { zodResolver } from '@hookform/resolvers/zod';
import { InstrumentSelectField } from '@investments/components/instruments/instrument-select-field';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getInstruments } from '@features/investments/api';
import { Button, DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';
import { CurrencySelectField } from '@transactions/components/shared';

import {
  isCashFlowOnlyInstrument,
  isSnapshotOnlyInstrument,
  operationFormSchema,
  type OperationFormValues,
} from './utils';

export type OperationFormProps = {
  defaultValues: OperationFormValues;
  submitLabel?: string;
  isPending: boolean;
  isInstrumentDisabled?: boolean;
  onSubmit: (values: OperationFormValues) => Promise<void> | void;
  onCancel: () => void;
};

// TODO split this file
export const OperationForm = ({
  defaultValues,
  submitLabel,
  isPending,
  isInstrumentDisabled = false,
  onSubmit,
  onCancel,
}: OperationFormProps) => {
  const { t } = useTranslation('investments');
  const { t: tCommon } = useTranslation('common');

  const { data: instruments = [] } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const form = useForm<OperationFormValues>({
    resolver: zodResolver(operationFormSchema),
    defaultValues,
  });

  const currentInstrumentId = useWatch({
    control: form.control,
    name: 'instrumentId',
  });
  const currentKind = useWatch({ control: form.control, name: 'kind' });

  const selectedInstrument = instruments.find((inst) => inst.id === currentInstrumentId);
  const isCashFlow = isCashFlowOnlyInstrument(selectedInstrument?.kind);

  useEffect(() => {
    if (selectedInstrument?.currency && !form.getValues('currency')) {
      form.setValue('currency', selectedInstrument.currency);
    }

    if (isCashFlow && currentKind === 'snapshot') {
      form.setValue('kind', 'interest');
    } else if (
      selectedInstrument &&
      isSnapshotOnlyInstrument(selectedInstrument.kind) &&
      currentKind !== 'snapshot'
    ) {
      form.setValue('kind', 'snapshot');
    }
  }, [selectedInstrument, isCashFlow, currentKind, form]);

  const handleInstrumentChange = (
    instrumentId: string,
    fieldOnChange: (val: string) => void,
  ) => {
    fieldOnChange(instrumentId);
    const inst = instruments.find((i) => i.id === instrumentId);
    if (inst?.currency) {
      form.setValue('currency', inst.currency);
    }
    if (isCashFlowOnlyInstrument(inst?.kind)) {
      form.setValue('kind', 'interest');
    } else if (isSnapshotOnlyInstrument(inst?.kind)) {
      form.setValue('kind', 'snapshot');
    }
  };

  const handleSubmit: SubmitHandler<OperationFormValues> = async (values) => {
    await onSubmit(values);
  };

  const defaultSubmitText = isCashFlow
    ? t('form.createOperationSubmit')
    : t('form.createSnapshotSubmit');

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
      onKeyDown={preventImplicitFormSubmit}
      data-testid="operation-form"
    >
      {/* Instrument field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="operation-instrument">
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.instrument')}
          </span>
        </Label>
        <Controller
          control={form.control}
          name="instrumentId"
          render={({ field }) => (
            <InstrumentSelectField
              value={field.value}
              onChange={(val) => handleInstrumentChange(val, field.onChange)}
              placeholder={t('selectInstrumentPlaceholder')}
              disabled={isInstrumentDisabled || isPending}
            />
          )}
        />
        {form.formState.errors.instrumentId && (
          <span className="text-xs text-destructive">
            {t(`form.errors.${form.formState.errors.instrumentId.message}`)}
          </span>
        )}
      </div>

      {/* Operation Kind selector for cash-flow instruments */}
      {isCashFlow && (
        <div className="flex flex-col gap-1.5">
          <Label>
            <span className="after:ml-0.5 after:text-destructive after:content-['*']">
              {t('form.operationKind')}
            </span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className={clsx(
                'h-10 text-sm font-semibold capitalize border transition-all',
                currentKind === 'interest'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'border-border bg-card-bg text-text-muted hover:text-fg hover:border-fg/40',
              )}
              onClick={() => form.setValue('kind', 'interest')}
              disabled={isPending}
              data-testid="operation-kind-interest"
            >
              {t('operationKind.interest')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={clsx(
                'h-10 text-sm font-semibold capitalize border transition-all',
                currentKind === 'fee'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'border-border bg-card-bg text-text-muted hover:text-fg hover:border-fg/40',
              )}
              onClick={() => form.setValue('kind', 'fee')}
              disabled={isPending}
              data-testid="operation-kind-fee"
            >
              {t('operationKind.fee')}
            </Button>
          </div>
        </div>
      )}

      {/* Amount & Currency row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Amount field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="operation-amount">
            <span className="after:ml-0.5 after:text-destructive after:content-['*']">
              {isCashFlow ? t('form.amount') : t('form.balance')}
            </span>
          </Label>
          <Input
            id="operation-amount"
            type="number"
            step="any"
            placeholder="0.00"
            {...form.register('amount', { valueAsNumber: true })}
            aria-invalid={Boolean(form.formState.errors.amount)}
            disabled={isPending}
          />
          {form.formState.errors.amount && (
            <span className="text-xs text-destructive">
              {t(`form.errors.${form.formState.errors.amount.message}`)}
            </span>
          )}
        </div>

        {/* Currency field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="operation-currency">
            <span className="after:ml-0.5 after:text-destructive after:content-['*']">
              {t('form.currency')}
            </span>
          </Label>
          <Controller
            control={form.control}
            name="currency"
            render={({ field }) => (
              <CurrencySelectField
                value={field.value}
                onChange={field.onChange}
                placeholder={t('form.currencyPlaceholder')}
                searchPlaceholder={t('form.searchCurrency')}
                emptyMessage={t('form.noCurrencyFound')}
              />
            )}
          />
          {form.formState.errors.currency && (
            <span className="text-xs text-destructive">
              {t(`form.errors.${form.formState.errors.currency.message}`)}
            </span>
          )}
        </div>
      </div>

      {/* Date field */}
      <div className="flex flex-col gap-1.5">
        <Label>
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.date')}
          </span>
        </Label>
        <Controller
          control={form.control}
          name="date"
          render={({ field }) => (
            <DateInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isPending}
            />
          )}
        />
        {form.formState.errors.date && (
          <span className="text-xs text-destructive">
            {t(`form.errors.${form.formState.errors.date.message}`)}
          </span>
        )}
      </div>

      {/* Note field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="operation-note">{t('form.notes')}</Label>
        <Input
          id="operation-note"
          placeholder={
            isCashFlow
              ? t('form.operationNotePlaceholder')
              : t('form.snapshotNotePlaceholder')
          }
          {...form.register('note')}
          disabled={isPending}
        />
      </div>

      {/* Form actions */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? tCommon('saving') : submitLabel || defaultSubmitText}
        </Button>
      </div>
    </form>
  );
};
