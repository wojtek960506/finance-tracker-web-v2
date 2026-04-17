import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Label } from '@shared/ui';
import { CurrencySelectField } from '@transactions/components/shared';

import type { TransactionFiltersFormValues } from '../utils';

// TODO in general in selectors think about some cancel button because adding big button
// in case of more selectors in form would not be elegant and cancel on right side of the
// trigger might be intuitive
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
