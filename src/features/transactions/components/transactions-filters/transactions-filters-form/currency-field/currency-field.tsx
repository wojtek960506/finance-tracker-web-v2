import clsx from 'clsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CurrencySelectField } from '@transactions/components/shared';

import { ACTIVE_FILTER_FIELD_CLASS_NAME } from '../consts';
import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

export const CurrencyField = () => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();
  const currency = useWatch({
    control: form.control,
    name: 'currency',
  });
  const isActive = Boolean(currency);

  return (
    <FilterFieldLabel title={t('currency')} isActive={isActive}>
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
            className={clsx(isActive && ACTIVE_FILTER_FIELD_CLASS_NAME)}
          />
        )}
      />
    </FilterFieldLabel>
  );
};
