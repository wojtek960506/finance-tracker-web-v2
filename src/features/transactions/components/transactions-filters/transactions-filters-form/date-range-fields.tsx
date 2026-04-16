import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next";

import { FieldError } from "@transactions/components/transaction-forms";

import type { TransactionFiltersFormValues } from "./utils";

import { DateInput, Label } from "@/shared/ui";

export const DateRangeFields = () => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
      <Label>
        <span className="text-sm font-semibold">{t('startDate')}</span>
        <Controller
          control={form.control}
          name="startDate"
          render={({ field }) => <DateInput {...field} />}
        />
        <FieldError
          message={
            form.formState.errors.startDate?.message &&
            t(form.formState.errors.startDate.message)
          }
        />
      </Label>

      <Label>
        <span className="text-sm font-semibold">{t('endDate')}</span>
        <Controller
          control={form.control}
          name="endDate"
          render={({ field }) => <DateInput {...field} />}
        />
        <FieldError
          message={
            form.formState.errors.endDate?.message &&
            t(form.formState.errors.endDate.message)
          }
        />
      </Label>
    </div>
  )
}
