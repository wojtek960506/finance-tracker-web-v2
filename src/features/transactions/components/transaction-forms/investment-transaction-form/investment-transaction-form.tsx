import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  CreateInstrumentModal,
  InstrumentSelectField,
} from '@features/investments/components/instruments';
import { Button, Card, Collapsible, DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  FORM_BUTTON_CLASS_NAME,
  preventImplicitFormSubmit,
  REQUIRED_LABEL_CLASS_NAME,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';

import {
  INVESTMENT_OPERATION_KINDS,
  type InvestmentOperationKind,
  investmentTransactionFormSchema,
  type InvestmentTransactionFormValues,
} from './utils';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type InvestmentTransactionFormProps = {
  defaultValues: InvestmentTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: InvestmentTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const getOperationButtonStyles = (kind: InvestmentOperationKind, isSelected: boolean) => {
  if (!isSelected) {
    return 'border-border bg-card-bg text-text-muted hover:text-fg hover:border-fg/40';
  }

  switch (kind) {
    case 'buy':
      return 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-sm';
    case 'sell':
      return 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm';
    case 'interest':
      return 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold shadow-sm';
    case 'fee':
      return 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-sm';
  }
};

export const InvestmentTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: InvestmentTransactionFormProps) => {
  const { t } = useTranslation('transactions');
  const [isCreateInstrumentModalOpen, setIsCreateInstrumentModalOpen] = useState(false);

  const form = useForm<InvestmentTransactionFormValues>({
    resolver: zodResolver(investmentTransactionFormSchema),
    defaultValues,
  });

  const selectedOperationKind = useWatch({
    control: form.control,
    name: 'operationKind',
  });

  const [paymentMethodId, accountId] = useWatch({
    control: form.control,
    name: ['paymentMethodId', 'accountId'],
  });

  const shouldOpenAdvancedFields = Boolean(paymentMethodId || accountId);

  const handleSubmit: SubmitHandler<InvestmentTransactionFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-3xl gap-4">
        <form
          className="grid gap-3 sm:gap-4 sm:grid-cols-2"
          onKeyDown={preventImplicitFormSubmit}
          onSubmit={form.handleSubmit(handleSubmit)}
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
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <Label>
              <span className={REQUIRED_LABEL_CLASS_NAME}>
                {t('investmentOperationKind')}
              </span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INVESTMENT_OPERATION_KINDS.map((kind) => {
                const isSelected = selectedOperationKind === kind;
                return (
                  <Button
                    key={kind}
                    type="button"
                    variant="outline"
                    className={clsx(
                      FORM_BUTTON_CLASS_NAME,
                      'capitalize transition-all border',
                      getOperationButtonStyles(kind, isSelected),
                    )}
                    onClick={() => form.setValue('operationKind', kind)}
                    disabled={isPending}
                    data-testid={`operation-kind-${kind}`}
                  >
                    {t(`operationKind.${kind}`)}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Instrument Selector */}
          <Label className="sm:col-span-2">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('investmentInstrument')}</span>
            <Controller
              control={form.control}
              name="instrumentId"
              render={({ field }) => (
                <InstrumentSelectField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('selectInstrumentPlaceholder')}
                  onAddNewInstrument={() => setIsCreateInstrumentModalOpen(true)}
                />
              )}
            />
            <FieldError
              message={
                form.formState.errors.instrumentId?.message &&
                t(form.formState.errors.instrumentId.message)
              }
            />
          </Label>

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
          <div className="sm:col-span-2">
            <Collapsible
              header={
                <span className="text-base font-medium sm:text-lg">
                  {t('advancedFields')}
                </span>
              }
              indicatorPosition="left"
              isInitiallyOpen={shouldOpenAdvancedFields}
              triggerMode="full-row"
              contentInset="none"
              contentClassName="px-[2px] pb-[2px]"
            >
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <Label>
                  <span>{t('paymentMethod')}</span>
                  <Controller
                    control={form.control}
                    name="paymentMethodId"
                    render={({ field }) => (
                      <NamedResourceSelectField
                        kind="paymentMethods"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('paymentMethodPlaceholder')}
                      />
                    )}
                  />
                  <FieldError
                    message={
                      form.formState.errors.paymentMethodId?.message &&
                      t(form.formState.errors.paymentMethodId.message)
                    }
                  />
                </Label>

                <Label>
                  <span>{t('account')}</span>
                  <Controller
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <NamedResourceSelectField
                        kind="accounts"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('accountPlaceholder')}
                      />
                    )}
                  />
                  <FieldError
                    message={
                      form.formState.errors.accountId?.message &&
                      t(form.formState.errors.accountId.message)
                    }
                  />
                </Label>
              </div>
            </Collapsible>
          </div>

          {/* Form Actions */}
          <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
        </form>
      </Card>

      <CreateInstrumentModal
        isOpen={isCreateInstrumentModalOpen}
        onClose={() => setIsCreateInstrumentModalOpen(false)}
        onSuccess={(instrumentId) => {
          form.setValue('instrumentId', instrumentId, { shouldValidate: true });
        }}
      />
    </>
  );
};
