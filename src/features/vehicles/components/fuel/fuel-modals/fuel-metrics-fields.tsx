import type { FuelEntryFormInput, FuelEntryFormValues } from '@vehicles/schemas';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input, Label } from '@shared/ui';

type FuelMetricsFieldsProps = {
  form: UseFormReturn<FuelEntryFormInput, unknown, FuelEntryFormValues>;
};

const REQUIRED_LABEL_CLASS = "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS = 'text-xs text-destructive';

export const FuelMetricsFields = ({ form }: FuelMetricsFieldsProps) => {
  const { t } = useTranslation('vehicles');
  const errors = form.formState.errors;

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

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="fuel-liters">
          <span className={REQUIRED_LABEL_CLASS}>{t('fuelPage.form.fuelLiters')}</span>
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
          <span className={FIELD_ERROR_CLASS}>
            {t('fuelPage.form.errors.fuelLitersPositive')}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="fuel-unit-price">
          <span className={REQUIRED_LABEL_CLASS}>{t('fuelPage.form.unitPrice')}</span>
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
          <span className={FIELD_ERROR_CLASS}>
            {t('fuelPage.form.errors.unitPricePositive')}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="fuel-cost">
          <span className={REQUIRED_LABEL_CLASS}>{t('fuelPage.form.cost')}</span>
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
          <span className={FIELD_ERROR_CLASS}>
            {t('fuelPage.form.errors.costPositive')}
          </span>
        )}
      </div>
    </div>
  );
};
