import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Label } from '@shared/ui';

import type { TransactionFiltersFormValues } from '../utils';

const FILTER_TYPE_OPTIONS = ['', 'expense', 'income'] as const;

export const TransactionTypeField = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFiltersFormValues>();

  return (
    <Label>
      <span className="text-sm font-semibold">{t('transactionType')}</span>
      <Controller
        control={control}
        name="transactionType"
        render={({ field }) => (
          <div
            className={clsx(
              'gap-2',
              '2xl:grid 2xl:grid-cols-3',
              'lg:flex lg:flex-col',
              'sm:grid sm:grid-cols-3',
              'flex flex-col',
            )}
          >
            {FILTER_TYPE_OPTIONS.map((transactionType) => {
              const isActive = field.value === transactionType;

              return (
                <Button
                  key={transactionType || 'all'}
                  type="button"
                  variant={isActive ? 'primary' : 'outline'}
                  onClick={() => field.onChange(transactionType)}
                >
                  {transactionType ? t(transactionType) : t('allTransactionTypes')}
                </Button>
              );
            })}
          </div>
        )}
      />
    </Label>
  );
};
