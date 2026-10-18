import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Input, Label } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

import {
  type SportEntryFormInput,
  sportEntryFormSchema,
  type SportEntryFormValues,
} from '../../schemas';
import { getCategoryDisplayName } from '../../utils';

import { SportActivityFormActions } from './sport-activity-form-actions';
import type { SportActivityFormProps } from './types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS_NAME = 'text-xs text-destructive';

export const SportActivityForm = ({
  categories,
  defaultValues,
  isPending = false,
  mode,
  onSubmit,
  onCancel,
}: SportActivityFormProps) => {
  const { t } = useTranslation('sports');

  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const form = useForm<SportEntryFormInput, unknown, SportEntryFormValues>({
    resolver: zodResolver(sportEntryFormSchema),
    defaultValues: {
      categoryId: defaultValues?.categoryId ?? categories[0]?.id ?? '',
      date: defaultValues?.date ? defaultValues.date.split('T')[0] : todayStr,
      itemName: defaultValues?.itemName ?? '',
      costPln: defaultValues?.costPln ?? ('' as unknown as number),
      description: defaultValues?.description ?? null,
      transactionId: defaultValues?.transactionId ?? null,
    },
  });

  const {
    formState: { errors },
  } = form;

  const handleSubmit: SubmitHandler<SportEntryFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
      onKeyDown={preventImplicitFormSubmit}
      className="flex flex-col gap-3.5 sm:gap-4"
      data-testid="sport-activity-form"
    >
      {/* Category Field */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="sport-activity-category">
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('modals.category')}</span>
        </Label>
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="sport-activity-category"
                className="w-full"
                data-testid="sport-activity-category-select"
              >
                <SelectValue placeholder={t('modals.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent position="popper">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {getCategoryDisplayName(cat, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <span className={FIELD_ERROR_CLASS_NAME}>
            {t('modals.errors.categoryRequired')}
          </span>
        )}
      </div>

      {/* Date & Cost Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="sport-activity-date">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('modals.date')}</span>
          </Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DateInput
                id="sport-activity-date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.date && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('modals.errors.dateRequired')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="sport-activity-cost">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('modals.cost')}</span>
          </Label>
          <Input
            id="sport-activity-cost"
            type="number"
            step="0.01"
            min="0"
            placeholder={t('modals.costPlaceholder')}
            data-testid="sport-activity-cost-input"
            {...form.register('costPln', { valueAsNumber: true })}
          />
          {errors.costPln && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('modals.errors.costPositive')}
            </span>
          )}
        </div>
      </div>

      {/* Activity / Item Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="sport-activity-item-name">
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('modals.itemName')}</span>
        </Label>
        <Input
          id="sport-activity-item-name"
          type="text"
          placeholder={t('modals.itemNamePlaceholder')}
          data-testid="sport-activity-item-name-input"
          {...form.register('itemName')}
        />
        {errors.itemName && (
          <span className={FIELD_ERROR_CLASS_NAME}>
            {t('modals.errors.itemNameRequired')}
          </span>
        )}
      </div>

      <SportActivityFormActions
        isPending={isPending}
        onCancel={onCancel}
        submitLabel={
          mode === 'create' ? t('modals.submitCreate') : t('entries.editEntry')
        }
        submitTestId="sport-activity-form-submit"
        cancelTestId="sport-activity-form-cancel"
      />
    </form>
  );
};
