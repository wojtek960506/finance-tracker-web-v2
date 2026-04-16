import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Label } from '@shared/ui';
import { CurrencySelectField } from '@transactions/components/shared';

import type { TransactionFiltersFormValues } from '../utils';

export const CurrencyField = () => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();
  const selectedCurrency = useWatch({
    control: form.control,
    name: 'currency',
  });

  return (
    <Label>
      <span className="text-sm font-semibold">{t('currency')}</span>
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
      {selectedCurrency ? (
        <Button
          type="button"
          variant="ghost"
          className="justify-start"
          onClick={() => form.setValue('currency', '')}
        >
          {t('clearCurrencyFilter')}
        </Button>
      ) : null}
    </Label>
  );
};
