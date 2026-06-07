import type { Transaction, TransactionFilters } from '@transactions/api';

import {
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from './transactions-query';

export const DEFAULT_TRANSACTIONS_RETURN_TO = '/transactions';

export type TransactionsRouteState = {
  returnTo?: string;
};

export const getTransactionsRouteState = (returnTo: string): TransactionsRouteState => ({
  returnTo,
});

export const getTransactionsReturnTo = (
  state: unknown,
  fallback = DEFAULT_TRANSACTIONS_RETURN_TO,
) => {
  if (
    typeof state === 'object' &&
    state !== null &&
    'returnTo' in state &&
    typeof state.returnTo === 'string'
  ) {
    return state.returnTo;
  }

  return fallback;
};

export const getPathWithSearch = ({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}) => `${pathname}${search}`;

const matchesOptionalDateRange = (date: string, startDate?: string, endDate?: string) => {
  const normalizedDate = date.slice(0, 10);

  if (startDate && normalizedDate < startDate) return false;
  if (endDate && normalizedDate > endDate) return false;

  return true;
};

export const transactionMatchesFilters = (
  transaction: Transaction,
  filters: TransactionFilters,
) => {
  if (!matchesOptionalDateRange(transaction.date, filters.startDate, filters.endDate)) {
    return false;
  }

  if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
    return false;
  }

  if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
    return false;
  }

  if (
    filters.transactionType &&
    transaction.transactionType !== filters.transactionType
  ) {
    return false;
  }

  if (filters.currency && transaction.currency !== filters.currency) {
    return false;
  }

  if (
    filters.categoryIds?.length &&
    !filters.categoryIds.includes(transaction.category.id)
  ) {
    return false;
  }

  if (
    filters.excludeCategoryIds?.length &&
    filters.excludeCategoryIds.includes(transaction.category.id)
  ) {
    return false;
  }

  if (
    filters.paymentMethodIds?.length &&
    !filters.paymentMethodIds.includes(transaction.paymentMethod.id)
  ) {
    return false;
  }

  if (
    filters.excludePaymentMethodIds?.length &&
    filters.excludePaymentMethodIds.includes(transaction.paymentMethod.id)
  ) {
    return false;
  }

  if (
    filters.accountIds?.length &&
    !filters.accountIds.includes(transaction.account.id)
  ) {
    return false;
  }

  if (
    filters.excludeAccountIds?.length &&
    filters.excludeAccountIds.includes(transaction.account.id)
  ) {
    return false;
  }

  return true;
};

export const shouldWarnAboutHiddenTransactions = (
  transactions: Transaction[],
  returnTo: string,
) => {
  // TODO consider broadening this warning to cover pagination too.
  // Right now we can only prove whether returned transactions match the active
  // filters from the return URL. We cannot reliably tell whether they would be
  // visible on the current page without knowing their position in the full
  // sorted result set after the mutation.
  const [, search = ''] = returnTo.split('?');
  const { filters } = parseTransactionsRouteSearchParams(new URLSearchParams(search));

  if (countActiveTransactionFilters(filters) === 0) {
    return false;
  }

  return !transactions.some((transaction) =>
    transactionMatchesFilters(transaction, filters),
  );
};
