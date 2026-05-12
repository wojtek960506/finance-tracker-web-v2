import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Collapsible } from '@shared/ui';

import { AmountRangeFields } from '../amount-range-fields';
import { CategoryFields } from '../category-fields';
import { CurrencyField } from '../currency-field';
import { DateRangeFields } from '../date-range-fields';
import { NamedResourceField } from '../named-resource-field';
import { TransactionTypeField } from '../transaction-type-field';
import type { TransactionFiltersFormValues } from '../utils';

export const TransactionsFiltersFields = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFiltersFormValues>();
  const [categoryMode, categoryId, excludeCategoryIds, paymentMethodId, accountId] = useWatch({
    control,
    name: ['categoryMode', 'categoryId', 'excludeCategoryIds', 'paymentMethodId', 'accountId'],
  });
  const shouldOpenAdvancedFields = Boolean(
    paymentMethodId ||
      accountId ||
      (categoryMode === 'include' ? categoryId : excludeCategoryIds.length > 0),
  );

  return (
    <div
      className={clsx(
        'grid min-h-0 min-w-0 gap-3 sm:gap-4 overflow-y-auto px-[2px]',
        'transactions-filters-form-container',
      )}
    >
      <DateRangeFields />
      <AmountRangeFields />
      <TransactionTypeField />
      <CurrencyField />
      <Collapsible
        header={<span className="text-base font-medium sm:text-lg">{t('advancedFields')}</span>}
        indicatorPosition="left"
        isInitiallyOpen={shouldOpenAdvancedFields}
        triggerMode="full-row"
        contentInset="none"
        contentClassName="pt-3 sm:pt-4"
      >
        <div className="grid min-w-0 gap-3 sm:gap-4">
          <CategoryFields />
          <NamedResourceField name="paymentMethodId" kind="paymentMethods" />
          <NamedResourceField name="accountId" kind="accounts" />
        </div>
      </Collapsible>
    </div>
  );
};
