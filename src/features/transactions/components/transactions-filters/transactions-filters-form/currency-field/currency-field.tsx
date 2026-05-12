import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import { CurrencySelectField } from '@transactions/components/shared';

import type { TransactionFiltersFormValues } from '../utils';

export const CurrencyField = () => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <Label>
      <span>{t('currency')}</span>
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
    </Label>
  );
};
