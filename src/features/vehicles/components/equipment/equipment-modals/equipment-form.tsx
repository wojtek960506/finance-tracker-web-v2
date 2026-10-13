import { zodResolver } from '@hookform/resolvers/zod';
import {
  type EquipmentFormInput,
  equipmentFormSchema,
  type EquipmentFormValues,
} from '@vehicles/schemas';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

export type EquipmentFormProps = {
  defaultValues?: Partial<EquipmentFormValues>;
  isPending?: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: EquipmentFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS_NAME = 'text-xs text-destructive';

export const EquipmentForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: EquipmentFormProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');

  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const form = useForm<EquipmentFormInput, unknown, EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      date: defaultValues?.date ? defaultValues.date.split('T')[0] : todayStr,
      itemName: defaultValues?.itemName ?? '',
      costPln: defaultValues?.costPln ?? ('' as unknown as number),
      description: defaultValues?.description ?? '',
      transactionId: defaultValues?.transactionId ?? null,
    },
  });

  const {
    formState: { errors },
  } = form;

  const handleSubmit: SubmitHandler<EquipmentFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
      onKeyDown={preventImplicitFormSubmit}
      className="flex flex-col gap-4"
      data-testid="equipment-form"
    >
      {/* Date & Item Name Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="equipment-date">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('equipmentPage.form.date')}
            </span>
          </Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DateInput
                id="equipment-date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.date && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('equipmentPage.form.errors.dateRequired')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="equipment-item-name">
            <span className={REQUIRED_LABEL_CLASS_NAME}>
              {t('equipmentPage.form.itemName')}
            </span>
          </Label>
          <Input
            id="equipment-item-name"
            type="text"
            placeholder={t('equipmentPage.form.itemNamePlaceholder')}
            {...form.register('itemName')}
          />
          {errors.itemName && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('equipmentPage.form.errors.itemNameRequired')}
            </span>
          )}
        </div>
      </div>

      {/* Cost (PLN) */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="equipment-cost">
          <span className={REQUIRED_LABEL_CLASS_NAME}>
            {t('equipmentPage.form.cost')}
          </span>
        </Label>
        <Input
          id="equipment-cost"
          type="number"
          step="0.01"
          min="0"
          placeholder={t('equipmentPage.form.costPlaceholder')}
          {...form.register('costPln', { valueAsNumber: true })}
        />
        {errors.costPln && (
          <span className={FIELD_ERROR_CLASS_NAME}>
            {t('equipmentPage.form.errors.costPositive')}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="equipment-description">
          {t('equipmentPage.form.description')}
        </Label>
        <Input
          id="equipment-description"
          type="text"
          placeholder={t('equipmentPage.form.descriptionPlaceholder')}
          {...form.register('description')}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          data-testid="equipment-form-cancel"
        >
          {tCommon('cancel')}
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          data-testid="equipment-form-submit"
        >
          {mode === 'create'
            ? t('equipmentPage.form.createSubmit')
            : t('equipmentPage.form.updateSubmit')}
        </Button>
      </div>
    </form>
  );
};
