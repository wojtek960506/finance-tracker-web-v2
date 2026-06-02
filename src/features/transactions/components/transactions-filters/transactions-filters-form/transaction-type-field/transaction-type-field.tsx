import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

const FILTER_TYPE_OPTIONS = ['expense', 'income'] as const;

const getTransactionTypeButtonClassName = (
  transactionType: (typeof FILTER_TYPE_OPTIONS)[number],
  isActive: boolean,
) =>
  clsx(
    'transition-colors',
    !isActive
      ? transactionType === 'expense'
        ? clsx(
            '!border-destructive/25 !bg-destructive/8 !text-destructive',
            'hover:!bg-destructive/16 focus-visible:!ring-destructive-ring',
          )
        : clsx(
            '!border-bt-primary/25 !bg-bt-primary/8 !text-bt-primary',
            'hover:!bg-bt-primary/16 focus-visible:!ring-bt-primary-ring',
          )
      : '',
  );

export const TransactionTypeField = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFiltersFormValues>();

  return (
    <FilterFieldLabel title={t('transactionType')}>
      <Controller
        control={control}
        name="transactionType"
        render={({ field }) => (
          <div
            className={clsx(
              'gap-2',
              '2xl:grid 2xl:grid-cols-2',
              'lg:flex lg:flex-col',
              'sm:grid sm:grid-cols-2',
              'flex flex-col',
            )}
          >
            {FILTER_TYPE_OPTIONS.map((transactionType) => {
              const isActive = field.value === transactionType;
              const variant =
                isActive && transactionType === 'expense'
                  ? 'destructive'
                  : isActive
                    ? 'primary'
                    : 'outline';

              return (
                <Button
                  key={transactionType}
                  type="button"
                  variant={variant}
                  aria-pressed={isActive}
                  className={getTransactionTypeButtonClassName(
                    transactionType,
                    isActive,
                  )}
                  onClick={() => field.onChange(isActive ? '' : transactionType)}
                >
                  {t(transactionType)}
                </Button>
              );
            })}
          </div>
        )}
      />
    </FilterFieldLabel>
  );
};
