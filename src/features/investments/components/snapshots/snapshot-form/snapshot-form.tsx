import { zodResolver } from '@hookform/resolvers/zod';
import { InstrumentSelectField } from '@investments/components/instruments/instrument-select-field';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getInstruments } from '@features/investments/api';
import { Button, DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';
import { CurrencySelectField } from '@transactions/components/shared';

import { snapshotFormSchema, type SnapshotFormValues } from './utils';

type SnapshotFormProps = {
  defaultValues: SnapshotFormValues;
  isPending: boolean;
  onSubmit: (values: SnapshotFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export const SnapshotForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: SnapshotFormProps) => {
  const { t } = useTranslation('investments');
  const { t: tCommon } = useTranslation('common');

  const { data: instruments = [] } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const form = useForm<SnapshotFormValues>({
    resolver: zodResolver(snapshotFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const currentInstrumentId = form.getValues('instrumentId');
    const currentCurrency = form.getValues('currency');
    if (currentInstrumentId && !currentCurrency) {
      const selectedInst = instruments.find((inst) => inst.id === currentInstrumentId);
      if (selectedInst?.currency) {
        form.setValue('currency', selectedInst.currency);
      }
    }
  }, [instruments, form]);

  const handleInstrumentChange = (
    instrumentId: string,
    fieldOnChange: (val: string) => void,
  ) => {
    fieldOnChange(instrumentId);
    const selectedInst = instruments.find((inst) => inst.id === instrumentId);
    if (selectedInst?.currency) {
      form.setValue('currency', selectedInst.currency);
    }
  };

  const handleSubmit: SubmitHandler<SnapshotFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
      onKeyDown={preventImplicitFormSubmit}
      data-testid="snapshot-form"
    >
      {/* Instrument field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="snapshot-instrument">
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
            />
          )}
        />
        {form.formState.errors.instrumentId && (
          <span className="text-xs text-destructive">
            {t(`form.errors.${form.formState.errors.instrumentId.message}`)}
          </span>
        )}
      </div>

      {/* Amount & Currency row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Balance Amount field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="snapshot-amount">
            <span className="after:ml-0.5 after:text-destructive after:content-['*']">
              {t('form.balance')}
            </span>
          </Label>
          <Input
            id="snapshot-amount"
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
          <Label htmlFor="snapshot-currency">
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
        <Label htmlFor="snapshot-note">{t('form.notes')}</Label>
        <Input
          id="snapshot-note"
          placeholder={t('form.snapshotNotePlaceholder')}
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
          {isPending ? tCommon('saving') : t('form.createSnapshotSubmit')}
        </Button>
      </div>
    </form>
  );
};
