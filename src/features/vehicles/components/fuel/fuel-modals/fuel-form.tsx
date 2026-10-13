import { zodResolver } from '@hookform/resolvers/zod';
import {
  type FuelEntryFormInput,
  fuelEntryFormSchema,
  type FuelEntryFormValues,
} from '@vehicles/schemas';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

export type FuelFormProps = {
  defaultValues?: Partial<FuelEntryFormValues>;
  isPending?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: FuelEntryFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS_NAME = 'text-xs text-destructive';

export const FuelForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: FuelFormProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');

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

  const handleLitersChange = (litersVal: number) => {
    form.setValue('fuelLiters', litersVal, { shouldValidate: true });
    const unitPrice = form.getValues('unitPricePln');
    if (litersVal > 0 && unitPrice > 0) {
      const calcCost = Number((litersVal * unitPrice).toFixed(2));
      form.setValue('costPln', calcCost, { shouldValidate: true });
    }
  };

  const handleUnitPriceChange = (priceVal: number) => {
    form.setValue('unitPricePln', priceVal, { shouldValidate: true });
    const liters = form.getValues('fuelLiters');
    if (liters > 0 && priceVal > 0) {
      const calcCost = Number((liters * priceVal).toFixed(2));
      form.setValue('costPln', calcCost, { shouldValidate: true });
    }
  };

  const handleCostChange = (costVal: number) => {
    form.setValue('costPln', costVal, { shouldValidate: true });
    const liters = form.getValues('fuelLiters');
    if (costVal > 0 && liters > 0) {
      const calcPrice = Number((costVal / liters).toFixed(2));
      form.setValue('unitPricePln', calcPrice, { shouldValidate: true });
    }
  };

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
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('fuelPage.form.date')}</span>
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
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('fuelPage.form.errors.dateRequired')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-odometer">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('fuelPage.form.odometer')}
            </span>
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
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('fuelPage.form.errors.odometerNonNegative')}
            </span>
          )}
        </div>
      </div>

      {/* Liters, Unit Price, Total Cost Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-liters">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('fuelPage.form.fuelLiters')}
            </span>
          </Label>
          <Input
            id="fuel-liters"
            type="number"
            step="0.01"
            min="0"
            placeholder={t('fuelPage.form.fuelLitersPlaceholder')}
            {...form.register('fuelLiters', {
              valueAsNumber: true,
              onChange: (e) => handleLitersChange(parseFloat(e.target.value)),
            })}
          />
          {errors.fuelLiters && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('fuelPage.form.errors.fuelLitersPositive')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-unit-price">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('fuelPage.form.unitPrice')}
            </span>
          </Label>
          <Input
            id="fuel-unit-price"
            type="number"
            step="0.01"
            min="0"
            placeholder={t('fuelPage.form.unitPricePlaceholder')}
            {...form.register('unitPricePln', {
              valueAsNumber: true,
              onChange: (e) => handleUnitPriceChange(parseFloat(e.target.value)),
            })}
          />
          {errors.unitPricePln && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('fuelPage.form.errors.unitPricePositive')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-cost">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('fuelPage.form.cost')}</span>
          </Label>
          <Input
            id="fuel-cost"
            type="number"
            step="0.01"
            min="0"
            placeholder={t('fuelPage.form.costPlaceholder')}
            {...form.register('costPln', {
              valueAsNumber: true,
              onChange: (e) => handleCostChange(parseFloat(e.target.value)),
            })}
          />
          {errors.costPln && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('fuelPage.form.errors.costPositive')}
            </span>
          )}
        </div>
      </div>

      {/* Full Tank Toggle */}
      <div className="flex items-center gap-2.5 rounded-xl bg-card-border/10 p-2.5">
        <input
          id="fuel-full-tank"
          type="checkbox"
          className="size-4 rounded accent-active-nav"
          {...form.register('isFullTank')}
        />
        <div className="flex flex-col">
          <Label
            htmlFor="fuel-full-tank"
            className="cursor-pointer text-xs font-semibold"
          >
            {t('fuelPage.form.isFullTank')}
          </Label>
          <span className="text-[11px] text-text-muted">
            {t('fuelPage.form.isFullTankHint')}
          </span>
        </div>
      </div>

      {/* Station Brand & Address Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-station-brand">{t('fuelPage.form.stationBrand')}</Label>
          <Input
            id="fuel-station-brand"
            placeholder={t('fuelPage.form.stationBrandPlaceholder')}
            {...form.register('stationBrand')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="fuel-station-address">
            {t('fuelPage.form.stationAddress')}
          </Label>
          <Input
            id="fuel-station-address"
            placeholder={t('fuelPage.form.stationAddressPlaceholder')}
            {...form.register('stationAddress')}
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="fuel-description">{t('fuelPage.form.description')}</Label>
        <Input
          id="fuel-description"
          placeholder={t('fuelPage.form.descriptionPlaceholder')}
          {...form.register('description')}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-card-border/40 pt-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          data-testid="fuel-submit-button"
        >
          {isPending
            ? tCommon('loading')
            : mode === 'create'
              ? t('fuelPage.form.createSubmit')
              : t('fuelPage.form.updateSubmit')}
        </Button>
      </div>
    </form>
  );
};
