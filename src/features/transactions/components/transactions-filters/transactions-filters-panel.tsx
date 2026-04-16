import './transactions-filters-panel.css';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';
import type { TransactionFilters } from '@transactions/api';

import {
  getTransactionFiltersFormDefaults,
  normalizeTransactionFiltersFormValues,
  transactionFiltersFormSchema,
  type TransactionFiltersFormValues,
} from './transactions-filters-form/utils';
import {
  AmountRangeFields,
  CategoryFields,
  CurrencyField,
  DateRangeFields,
  NamedResourceField,
  TransactionTypeField,
} from './transactions-filters-form';

type TransactionsFiltersPanelProps = {
  appliedFilters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
};

export const TransactionsFiltersPanel = ({
  appliedFilters,
  onApply,
}: TransactionsFiltersPanelProps) => {
  const { t } = useTranslation('transactions');

  const form = useForm<TransactionFiltersFormValues>({
    resolver: zodResolver(transactionFiltersFormSchema),
    defaultValues: getTransactionFiltersFormDefaults(appliedFilters),
  });

  useEffect(() => {
    form.reset(getTransactionFiltersFormDefaults(appliedFilters));
  }, [appliedFilters, form]);

  const handleApply = form.handleSubmit((values) => {
    onApply(normalizeTransactionFiltersFormValues(values));
  });

  return (
    <Card
      className={clsx(
        'relative z-[141] h-full w-full min-w-0 max-w-full gap-4 overflow-hidden',
        'rounded-3xl border-fg/20 bg-modal-bg/95',
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl">{t('filters')}</h2>
        <p className="text-sm text-text-muted">{t('filtersDescription')}</p>
      </div>

      <FormProvider {...form}>
        <form
          className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden"
          onSubmit={handleApply}
        >
          <div
            className={clsx(
              'grid min-h-0 min-w-0 gap-4 overflow-y-auto pr-[1px]',
              'transactions-filters-form-container',
            )}
          >
            <DateRangeFields />
            <AmountRangeFields />
            <TransactionTypeField />
            <CurrencyField />
            <CategoryFields />
            <NamedResourceField
              name="paymentMethodId"
              kind="paymentMethods"
              copy={{
                label: 'paymentMethod',
                placeholder: 'paymentMethodPlaceholder',
                searchPlaceholder: 'searchPaymentMethodPlaceholder',
                emptyMessage: 'noPaymentMethodsFound',
                showMoreLabel: 'showMorePaymentMethods',
                showLessLabel: 'showLessPaymentMethods',
                clearLabel: 'clearPaymentMethodFilter',
              }}
            />

            <NamedResourceField
              name="accountId"
              kind="accounts"
              copy={{
                label: 'account',
                placeholder: 'accountPlaceholder',
                searchPlaceholder: 'searchAccountPlaceholder',
                emptyMessage: 'noAccountsFound',
                showMoreLabel: 'showMoreAccounts',
                showLessLabel: 'showLessAccounts',
                clearLabel: 'clearAccountFilter',
              }}
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-fg/10 pt-4">
            <Button type="button" variant="primary" onClick={handleApply}>
              {t('applyFilters')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset(getTransactionFiltersFormDefaults({}))}
            >
              {t('clearFilters')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};
