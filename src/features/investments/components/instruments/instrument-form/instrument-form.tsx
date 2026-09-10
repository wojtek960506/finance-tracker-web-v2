import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrumentKind } from '@features/investments/api';
import { INSTRUMENT_KINDS } from '@features/investments/consts';
import { Button, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';
import { CurrencySelectField } from '@transactions/components/shared';

import { InstrumentKindBadge } from '../instrument-kind-badge';

import { instrumentFormSchema, type InstrumentFormValues } from './utils';

type InstrumentFormProps = {
  defaultValues: InstrumentFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: InstrumentFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export const InstrumentForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: InstrumentFormProps) => {
  const { t } = useTranslation('investments');
  const { t: tCommon } = useTranslation('common');

  const form = useForm<InstrumentFormValues>({
    resolver: zodResolver(instrumentFormSchema),
    defaultValues,
  });

  const selectedKind = useWatch({
    control: form.control,
    name: 'kind',
  });

  const handleSubmit: SubmitHandler<InstrumentFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
      onKeyDown={preventImplicitFormSubmit}
      data-testid="instrument-form"
    >
      {/* Name field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instrument-name">
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.name')}
          </span>
        </Label>
        <Input
          id="instrument-name"
          placeholder={t('form.namePlaceholder')}
          {...form.register('name')}
          aria-invalid={Boolean(form.formState.errors.name)}
          disabled={isPending}
        />
        {form.formState.errors.name && (
          <span className="text-xs text-destructive">
            {t(`form.errors.${form.formState.errors.name.message}`, {
              defaultValue: form.formState.errors.name.message,
            })}
          </span>
        )}
      </div>

      {/* Kind selector */}
      <div className="flex flex-col gap-1.5">
        <Label>
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.kind')}
          </span>
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {INSTRUMENT_KINDS.map((kind) => {
            const isSelected = selectedKind === kind;
            return (
              <button
                key={kind}
                type="button"
                className={clsx(
                  'rounded-full border p-1 transition-all',
                  isSelected
                    ? 'ring-2 ring-bt-primary ring-offset-1 border-transparent'
                    : 'opacity-60 hover:opacity-100',
                )}
                onClick={() => form.setValue('kind', kind as InvestmentInstrumentKind)}
                disabled={isPending}
              >
                <InstrumentKindBadge kind={kind} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instrument-currency">
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
            {t(`form.errors.${form.formState.errors.currency.message}`, {
              defaultValue: form.formState.errors.currency.message,
            })}
          </span>
        )}
      </div>

      {/* Notes field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instrument-notes">{t('form.notes')}</Label>
        <Input
          id="instrument-notes"
          placeholder={t('form.notesPlaceholder')}
          {...form.register('notes')}
          disabled={isPending}
        />
      </div>

      {/* Form actions */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {tCommon('cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending
            ? tCommon('saving', { defaultValue: 'Saving...' })
            : mode === 'create'
              ? t('form.createSubmit')
              : t('form.updateSubmit')}
        </Button>
      </div>
    </form>
  );
};
