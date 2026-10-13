import { zodResolver } from '@hookform/resolvers/zod';
import type { VehicleType } from '@vehicles/api';
import { VehicleTypeBadge } from '@vehicles/components/all-vehicles';
import { DEFAULT_VEHICLE_TYPE, VEHICLE_TYPES } from '@vehicles/consts';
import {
  type VehicleFormInput,
  vehicleFormSchema,
  type VehicleFormValues,
} from '@vehicles/schemas';
import clsx from 'clsx';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

export type VehicleFormProps = {
  defaultValues?: Partial<VehicleFormValues>;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: VehicleFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const getDefaultVehicleFormValues = (
  vehicle?: Partial<VehicleFormValues> | null,
): VehicleFormValues => ({
  name: vehicle?.name ?? '',
  slug: vehicle?.slug ?? '',
  brand: vehicle?.brand ?? '',
  vehicleModel: vehicle?.vehicleModel ?? '',
  type: vehicle?.type ?? DEFAULT_VEHICLE_TYPE,
  productionYear: vehicle?.productionYear ?? null,
  notes: vehicle?.notes ?? '',
});

export type { VehicleFormInput, VehicleFormValues, VehicleType };

// TODO split into few components
export const VehicleForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: VehicleFormProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');

  const form = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: getDefaultVehicleFormValues(defaultValues),
  });

  const selectedType = useWatch({
    control: form.control,
    name: 'type',
  });

  const handleSubmit: SubmitHandler<VehicleFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
      onKeyDown={preventImplicitFormSubmit}
      data-testid="vehicle-form"
    >
      {/* Name Field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vehicle-name">
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.name')}
          </span>
        </Label>
        <Input
          id="vehicle-name"
          placeholder={t('form.namePlaceholder')}
          {...form.register('name')}
          aria-invalid={Boolean(form.formState.errors.name)}
          disabled={isPending}
        />
        {form.formState.errors.name && (
          <span className="text-xs text-destructive">
            {t(`form.errors.${form.formState.errors.name.message}`)}
          </span>
        )}
      </div>

      {/* Type Selector */}
      <div className="flex flex-col gap-1.5">
        <Label>
          <span className="after:ml-0.5 after:text-destructive after:content-['*']">
            {t('form.type')}
          </span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                className={clsx(
                  'rounded-full border p-1 transition-all',
                  isSelected
                    ? 'border-transparent ring-2 ring-bt-primary ring-offset-1'
                    : 'opacity-60 hover:opacity-100',
                )}
                onClick={() => form.setValue('type', type as VehicleType)}
                disabled={isPending}
              >
                <VehicleTypeBadge type={type} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand & Model Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehicle-brand">{t('form.brand')}</Label>
          <Input
            id="vehicle-brand"
            placeholder={t('form.brandPlaceholder')}
            {...form.register('brand')}
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehicle-model">{t('form.model')}</Label>
          <Input
            id="vehicle-model"
            placeholder={t('form.modelPlaceholder')}
            {...form.register('vehicleModel')}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Production Year & Slug Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehicle-year">{t('form.productionYear')}</Label>
          <Input
            id="vehicle-year"
            type="number"
            min={1900}
            max={2100}
            placeholder={t('form.yearPlaceholder')}
            {...form.register('productionYear', {
              setValueAs: (value: string) =>
                value === '' || value === null || value === undefined
                  ? null
                  : Number(value),
            })}
            aria-invalid={Boolean(form.formState.errors.productionYear)}
            disabled={isPending}
          />
          {form.formState.errors.productionYear && (
            <span className="text-xs text-destructive">
              {t('form.errors.yearInvalid')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehicle-slug">{t('form.slug')}</Label>
          <Input
            id="vehicle-slug"
            placeholder={t('form.slugPlaceholder')}
            {...form.register('slug')}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Notes Field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vehicle-notes">{t('form.notes')}</Label>
        <Input
          id="vehicle-notes"
          placeholder={t('form.notesPlaceholder')}
          {...form.register('notes')}
          disabled={isPending}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending
            ? tCommon('saving')
            : mode === 'create'
              ? t('form.createSubmit')
              : t('form.updateSubmit')}
        </Button>
      </div>
    </form>
  );
};
