import { zodResolver } from '@hookform/resolvers/zod';
import { VehicleFormActions } from '@vehicles/components/common';
import {
  type FuelEntryFormInput,
  fuelEntryFormSchema,
  type FuelEntryFormValues,
} from '@vehicles/schemas';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

import { FuelMetricsFields } from './fuel-metrics-fields';
import { FuelStationFields } from './fuel-station-fields';

export type FuelFormProps = {
  defaultValues?: Partial<FuelEntryFormValues>;
  isPending?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: FuelEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const REQUIRED_LABEL_CLASS = "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS = 'text-xs text-destructive';

export const FuelForm = ({
  defaultValues,
  isPending = false,
  mode,
  onSubmit,
  onCancel,
}: FuelFormProps) => {
  const { t } = useTranslation('vehicles');
  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const form = useForm<FuelEntryFormInput, unknown, FuelEntryFormValues>({
    resolver: zodResolver(fuelEntryFormSchema),
    defaultValues: {
      date: defaultValues?.date ?? todayStr,
      fuelLiters: defaultValues?.fuelLiters ?? ('' as unknown as number),
      unitPricePln: defaultValues?.unitPricePln ?? ('' as unknown as number),
      costPln: defaultValues?.costPln ?? ('' as unknown as number),
      odometerKm: defaultValues?.odometerKm ?? ('' as unknown as number),
      isFullTank: defaultValues?.isFullTank ?? true,
      stationBrand: defaultValues?.stationBrand ?? '',
      stationAddress: defaultValues?.stationAddress ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleSubmit: SubmitHandler<FuelEntryFormValues> = async (values) => {
    await onSubmit(values);
  };

  const errors = form.formState.errors;

  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={form.handleSubmit(handleSubmit)}
      onKeyDown={preventImplicitFormSubmit}
      data-testid="fuel-form"
    >
      {/* Date & Odometer Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-date">
            <span className={REQUIRED_LABEL_CLASS}>{t('fuelPage.form.date')}</span>
          </Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DateInput
                id="fuel-date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.date && (
            <span className={FIELD_ERROR_CLASS}>
              {t('fuelPage.form.errors.dateRequired')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-odometer">
            <span className={REQUIRED_LABEL_CLASS}>{t('fuelPage.form.odometer')}</span>
          </Label>
          <Input
            id="fuel-odometer"
            type="number"
            step="1"
            min="0"
            placeholder={t('fuelPage.form.odometerPlaceholder')}
            {...form.register('odometerKm', { valueAsNumber: true })}
          />
          {errors.odometerKm && (
            <span className={FIELD_ERROR_CLASS}>
              {t('fuelPage.form.errors.odometerNonNegative')}
            </span>
          )}
        </div>
      </div>

      {/* Liters, Unit Price, Total Cost Row */}
      <FuelMetricsFields form={form} />

      {/* Station Brand, Address, Full Tank Toggle & Description */}
      <FuelStationFields form={form} />

      {/* Form Action Buttons */}
      <VehicleFormActions
        isPending={isPending}
        onCancel={onCancel}
        submitLabel={
          mode === 'create'
            ? t('fuelPage.form.createSubmit')
            : t('fuelPage.form.updateSubmit')
        }
        submitTestId="fuel-submit-button"
      />
    </form>
  );
};
