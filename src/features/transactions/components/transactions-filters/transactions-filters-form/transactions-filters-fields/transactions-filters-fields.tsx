import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Collapsible } from '@shared/ui';

import { AmountRangeFields } from '../amount-range-fields';
import { CurrencyField } from '../currency-field';
import { DateRangeFields } from '../date-range-fields';
import { NamedResourceFilterField } from '../named-resource-field';
import { TransactionTypeField } from '../transaction-type-field';
import type { TransactionFiltersFormValues } from '../utils';

export const TransactionsFiltersFields = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFiltersFormValues>();
  const [
    categoryMode,
    categoryIds,
    excludeCategoryIds,
    paymentMethodMode,
    paymentMethodIds,
    excludePaymentMethodIds,
    accountMode,
    accountIds,
    excludeAccountIds,
  ] = useWatch({
    control,
    name: [
      'categoryMode',
      'categoryIds',
      'excludeCategoryIds',
      'paymentMethodMode',
      'paymentMethodIds',
      'excludePaymentMethodIds',
      'accountMode',
      'accountIds',
      'excludeAccountIds',
    ],
  });
  const shouldOpenAdvancedFields = Boolean(
    (categoryMode === 'include' ? categoryIds.length > 0 : excludeCategoryIds.length > 0) ||
    (paymentMethodMode === 'include' 
      ? paymentMethodIds.length > 0
      : excludePaymentMethodIds.length > 0) ||
    (accountMode === 'include' ? accountIds.length > 0 : excludeAccountIds.length > 0),
  );

  return (
    <div
      className={clsx(
        'scrollbar-track-modal grid min-h-0 min-w-0 gap-3 overflow-y-auto px-[2px] sm:gap-4',
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
        contentClassName="pt-1 sm:pt-2"
      >
        <div className="grid min-w-0 gap-2 sm:gap-3">
          <NamedResourceFilterField kind="categories" includeSystem />
          <NamedResourceFilterField kind="paymentMethods" />
          <NamedResourceFilterField kind="accounts" />
        </div>
      </Collapsible>
    </div>
  );
};
