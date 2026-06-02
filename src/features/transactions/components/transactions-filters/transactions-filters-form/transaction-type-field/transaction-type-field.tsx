import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';
import {
  getTransactionTypeButtonClassName,
  getTransactionTypeButtonVariant,
} from '@transactions/utils';

import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

const FILTER_TYPE_OPTIONS = ['expense', 'income'] as const;

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

              return (
                <Button
                  key={transactionType}
                  type="button"
                  variant={getTransactionTypeButtonVariant(transactionType, isActive)}
                  aria-pressed={isActive}
                  className={getTransactionTypeButtonClassName(transactionType, isActive)}
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
