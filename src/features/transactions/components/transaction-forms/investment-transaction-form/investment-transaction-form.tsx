import { useTranslation } from 'react-i18next';

import { CreateInstrumentModal } from '@features/investments/components/instruments';
import { Card, Label } from '@shared/ui';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  preventImplicitFormSubmit,
  TransactionAmountField,
  TransactionCurrencyField,
  TransactionDateField,
  TransactionDescriptionField,
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
          <TransactionDescriptionField
            registration={form.register('description')}
            errorMessage={form.formState.errors.description?.message}
            disabled={isPending}
          />

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
          <TransactionDateField
            control={form.control}
            name="date"
            errorMessage={form.formState.errors.date?.message}
            disabled={isPending}
          />

          {/* Amount Field */}
          <TransactionAmountField
            control={form.control}
            name="amount"
            errorMessage={form.formState.errors.amount?.message}
            disabled={isPending}
          />

          {/* Currency Field */}
          <TransactionCurrencyField
            control={form.control}
            name="currency"
            errorMessage={form.formState.errors.currency?.message}
          />

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
            isOpen={shouldOpenAdvancedFields}
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
