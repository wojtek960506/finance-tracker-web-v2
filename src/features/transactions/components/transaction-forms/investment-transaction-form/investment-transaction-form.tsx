import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CreateInstrumentModal } from '@features/investments/components/instruments';
import { Card, DateInput, Label } from '@shared/ui';
import { CurrencySelectField } from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  preventImplicitFormSubmit,
  REQUIRED_LABEL_CLASS_NAME,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';

import {
  InvestmentAdvancedFields,
  InvestmentInstrumentField,
  InvestmentOperationKindSelector,
} from './components';
import { useInvestmentTransactionForm } from './hooks';
import type { InvestmentTransactionFormValues } from './utils';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type InvestmentTransactionFormProps = {
  defaultValues: InvestmentTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: InvestmentTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export const InvestmentTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: InvestmentTransactionFormProps) => {
  const { t } = useTranslation('transactions');
  const {
    form,
    selectedOperationKind,
    shouldOpenAdvancedFields,
    isCreateInstrumentModalOpen,
    setIsCreateInstrumentModalOpen,
    handleSelectOperationKind,
    handleInstrumentCreated,
    handleSubmit,
  } = useInvestmentTransactionForm({ defaultValues, onSubmit });

  return (
    <>
      <Card className="mx-auto w-full max-w-3xl gap-4">
        <form
          className="grid gap-3 sm:gap-4 sm:grid-cols-2"
          onKeyDown={preventImplicitFormSubmit}
          onSubmit={handleSubmit}
          data-testid="investment-transaction-form"
        >
          {/* Description Field */}
          <Label className="sm:col-span-2">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('description')}</span>
            <Input
              className={FIELD_CONTROL_CLASS_NAME}
              {...form.register('description')}
              placeholder={t('descriptionPlaceholder')}
              disabled={isPending}
            />
            <FieldError
              message={
                form.formState.errors.description?.message &&
                t(form.formState.errors.description.message)
              }
            />
          </Label>

          {/* Operation Kind Selector */}
          <InvestmentOperationKindSelector
            selectedKind={selectedOperationKind}
            onSelectKind={handleSelectOperationKind}
            disabled={isPending}
          />

          {/* Instrument Selector */}
          <InvestmentInstrumentField
            control={form.control}
            errorMessage={form.formState.errors.instrumentId?.message}
            onAddNewInstrument={() => setIsCreateInstrumentModalOpen(true)}
          />

          {/* Date Field */}
          <Label>
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('date')}</span>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <DateInput {...field} className={FIELD_CONTROL_CLASS_NAME} />
              )}
            />
            <FieldError
              message={
                form.formState.errors.date?.message &&
                t(form.formState.errors.date.message)
              }
            />
          </Label>

          {/* Amount Field */}
          <Label>
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('amount')}</span>
            <Controller
              control={form.control}
              name="amount"
              render={({ field }) => (
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  decimalPlaces={2}
                  step="0.01"
                  min="0"
                  className={FIELD_CONTROL_CLASS_NAME}
                />
              )}
            />
            <FieldError
              message={
                form.formState.errors.amount?.message &&
                t(form.formState.errors.amount.message)
              }
            />
          </Label>

          {/* Currency Field */}
          <Label className="sm:col-span-2">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('currency')}</span>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <CurrencySelectField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('currencyPlaceholder')}
                  searchPlaceholder={t('searchCurrencyPlaceholder')}
                  emptyMessage={t('noCurrenciesFound')}
                />
              )}
            />
            <FieldError
              message={
                form.formState.errors.currency?.message &&
                t(form.formState.errors.currency.message)
              }
            />
          </Label>

          {/* Investment Note Field */}
          <Label className="sm:col-span-2">
            <span>{t('investmentNote')}</span>
            <Input
              className={FIELD_CONTROL_CLASS_NAME}
              {...form.register('note')}
              placeholder={t('investmentNotePlaceholder')}
              disabled={isPending}
            />
            <FieldError
              message={
                form.formState.errors.note?.message &&
                t(form.formState.errors.note.message)
              }
            />
          </Label>

          {/* Advanced Named Resources */}
          <InvestmentAdvancedFields
            control={form.control}
            errors={form.formState.errors}
            isInitiallyOpen={shouldOpenAdvancedFields}
          />

          {/* Form Actions */}
          <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
        </form>
      </Card>

      <CreateInstrumentModal
        isOpen={isCreateInstrumentModalOpen}
        onClose={() => setIsCreateInstrumentModalOpen(false)}
        onSuccess={handleInstrumentCreated}
      />
    </>
  );
};
