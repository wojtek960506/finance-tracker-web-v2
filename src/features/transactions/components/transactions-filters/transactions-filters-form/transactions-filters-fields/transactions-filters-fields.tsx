import clsx from 'clsx';

import { AmountRangeFields } from '../amount-range-fields';
import { CategoryFields } from '../category-fields';
import { CurrencyField } from '../currency-field';
import { DateRangeFields } from '../date-range-fields';
import { NamedResourceField } from '../named-resource-field';
import { TransactionTypeField } from '../transaction-type-field';

export const TransactionsFiltersFields = () => (
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
    <NamedResourceField name="paymentMethodId" kind="paymentMethods" />
    <NamedResourceField name="accountId" kind="accounts" />
  </div>
);
