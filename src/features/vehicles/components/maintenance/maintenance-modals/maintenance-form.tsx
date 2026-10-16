import { zodResolver } from '@hookform/resolvers/zod';
import type { MaintenanceSection } from '@vehicles/api';
import { VehicleFormActions } from '@vehicles/components/common';
import { DEFAULT_MAINTENANCE_SECTION, MAINTENANCE_SECTIONS } from '@vehicles/consts';
import {
  type MaintenanceFormInput,
  maintenanceFormSchema,
  type MaintenanceFormValues,
} from '@vehicles/schemas';
import clsx from 'clsx';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

import { MaintenanceSectionBadge } from '../maintenance-section-badge';

export type MaintenanceFormProps = {
  defaultValues?: Partial<MaintenanceFormValues>;
  fixedSection?: MaintenanceSection;
  isPending?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: MaintenanceFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS_NAME = 'text-xs text-destructive';

export const MaintenanceForm = ({
  defaultValues,
  fixedSection,
  isPending = false,
  mode,
  onSubmit,
  onCancel,
}: MaintenanceFormProps) => {
  const { t } = useTranslation('vehicles');

  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const form = useForm<MaintenanceFormInput, unknown, MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      section: fixedSection ?? defaultValues?.section ?? DEFAULT_MAINTENANCE_SECTION,
      date: defaultValues?.date ? defaultValues.date.split('T')[0] : todayStr,
      costPln: defaultValues?.costPln ?? ('' as unknown as number),
      odometerKm: defaultValues?.odometerKm ?? null,
      serviceProvider: defaultValues?.serviceProvider ?? '',
      description: defaultValues?.description ?? '',
      transactionId: defaultValues?.transactionId ?? null,
    },
  });

  const selectedSection = useWatch({
    control: form.control,
    name: 'section',
  });

  const {
    formState: { errors },
  } = form;

  const handleSubmit: SubmitHandler<MaintenanceFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
      onKeyDown={preventImplicitFormSubmit}
      className="flex flex-col gap-4"
      data-testid="maintenance-form"
    >
      {/* Section Selector */}
      <div className="flex flex-col gap-1.5">
        <Label>
          <span className={REQUIRED_LABEL_CLASS_NAME}>
            {t('maintenancePage.form.section')}
          </span>
        </Label>
        {fixedSection ? (
          <div
            className="inline-flex items-center"
            data-testid="maintenance-form-fixed-section"
          >
            <MaintenanceSectionBadge section={fixedSection} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {MAINTENANCE_SECTIONS.map((sec) => {
              const isSelected = selectedSection === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  className={clsx(
                    'rounded-lg border p-1 transition-all',
                    isSelected
                      ? 'border-transparent ring-2 ring-bt-primary ring-offset-1'
                      : 'opacity-60 hover:opacity-100',
                  )}
                  onClick={() => form.setValue('section', sec as MaintenanceSection)}
                  disabled={isPending}
                  data-testid={`maintenance-section-option-${sec}`}
                >
                  <MaintenanceSectionBadge section={sec} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Date & Cost Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="maintenance-date">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('maintenancePage.form.date')}
            </span>
          </Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DateInput
                id="maintenance-date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.date && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('maintenancePage.form.errors.dateRequired')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="maintenance-cost">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('maintenancePage.form.cost')}
            </span>
          </Label>
          <Input
            id="maintenance-cost"
            type="number"
            step="0.01"
            min="0"
            placeholder={t('maintenancePage.form.costPlaceholder')}
            {...form.register('costPln', { valueAsNumber: true })}
            disabled={isPending}
          />
          {errors.costPln && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('maintenancePage.form.errors.costPositive')}
            </span>
          )}
        </div>
      </div>

      {/* Odometer & Service Provider Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="maintenance-odometer">
            {t('maintenancePage.form.odometer')}
          </Label>
          <Input
            id="maintenance-odometer"
            type="number"
            min="0"
            placeholder={t('maintenancePage.form.odometerPlaceholder')}
            {...form.register('odometerKm', {
              setValueAs: (val: string) =>
                val === '' || val === null || val === undefined ? null : Number(val),
            })}
            disabled={isPending}
          />
          {errors.odometerKm && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('maintenancePage.form.errors.odometerNonNegative')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="maintenance-provider">
            {t('maintenancePage.form.serviceProvider')}
          </Label>
          <Input
            id="maintenance-provider"
            type="text"
            placeholder={t('maintenancePage.form.serviceProviderPlaceholder')}
            {...form.register('serviceProvider')}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="maintenance-description">
          {t('maintenancePage.form.description')}
        </Label>
        <Input
          id="maintenance-description"
          type="text"
          placeholder={t('maintenancePage.form.descriptionPlaceholder')}
          {...form.register('description')}
          disabled={isPending}
        />
      </div>

      <VehicleFormActions
        isPending={isPending}
        onCancel={onCancel}
        submitLabel={
          mode === 'create'
            ? t('maintenancePage.form.createSubmit')
            : t('maintenancePage.form.updateSubmit')
        }
        submitTestId="maintenance-form-submit"
        cancelTestId="maintenance-form-cancel"
      />
    </form>
  );
};
