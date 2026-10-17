import type { FuelEntryFormInput, FuelEntryFormValues } from '@vehicles/schemas';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input, Label } from '@shared/ui';

type FuelStationFieldsProps = {
  form: UseFormReturn<FuelEntryFormInput, unknown, FuelEntryFormValues>;
};

export const FuelStationFields = ({ form }: FuelStationFieldsProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <>
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
    </>
  );
};
