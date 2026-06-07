import type {
  GetTransactionsQuery,
  TransactionFilters,
  TransactionType,
} from '@transactions/api';

export const TRANSACTIONS_PAGE_LIMIT = 30;
export const DEFAULT_TRANSACTIONS_PAGE = 1;

const TRANSACTION_TYPES = new Set<TransactionType>(['expense', 'income']);

const parsePositiveNumber = (value: string | null) => {
  if (!value) return undefined;

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return undefined;

  return parsed;
};

const parsePage = (value: string | null) => {
  if (!value) return DEFAULT_TRANSACTIONS_PAGE;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_TRANSACTIONS_PAGE;

  return parsed;
};

const parseTransactionType = (value: string | null) =>
  value && TRANSACTION_TYPES.has(value as TransactionType)
    ? (value as TransactionType)
    : undefined;

const parseMultiValueFilter = (value: string | null) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// TODO maybe extract some bigger functions from this file but keep imports as before
const appendFilterParams = (params: URLSearchParams, filters: TransactionFilters) => {
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.minAmount !== undefined) params.set('minAmount', String(filters.minAmount));
  if (filters.maxAmount !== undefined) params.set('maxAmount', String(filters.maxAmount));
  if (filters.transactionType) params.set('transactionType', filters.transactionType);
  if (filters.currency) params.set('currency', filters.currency);
  if (filters.categoryIds?.length)
    params.set('categoryIds', filters.categoryIds.join(','));
  if (filters.excludeCategoryIds?.length) {
    params.set('excludeCategoryIds', filters.excludeCategoryIds.join(','));
  }
  if (filters.paymentMethodIds?.length) {
    params.set('paymentMethodIds', filters.paymentMethodIds.join(','));
  }
  if (filters.excludePaymentMethodIds?.length) {
    params.set('excludePaymentMethodIds', filters.excludePaymentMethodIds.join(','));
  }
  if (filters.accountIds?.length) params.set('accountIds', filters.accountIds.join(','));
  if (filters.excludeAccountIds?.length) {
    params.set('excludeAccountIds', filters.excludeAccountIds.join(','));
  }
};

export const buildTransactionFiltersSearchParams = (filters: TransactionFilters = {}) => {
  const params = new URLSearchParams();

  appendFilterParams(params, filters);

  return params;
};

export const buildTransactionsApiSearchParams = ({
  page = DEFAULT_TRANSACTIONS_PAGE,
  filters = {},
}: GetTransactionsQuery = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(TRANSACTIONS_PAGE_LIMIT),
    sortBy: 'date',
    sortOrder: 'desc',
  });

  appendFilterParams(params, filters);

  return params;
};

export const buildTransactionsRouteSearchParams = ({
  page = DEFAULT_TRANSACTIONS_PAGE,
  filters = {},
}: GetTransactionsQuery = {}) => {
  const params = new URLSearchParams();

  if (page > DEFAULT_TRANSACTIONS_PAGE) {
    params.set('page', String(page));
  }

  appendFilterParams(params, filters);

  return params;
};

export const parseTransactionsRouteSearchParams = (
  searchParams: URLSearchParams,
): Required<GetTransactionsQuery> => {
  const filters: TransactionFilters = {};
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const minAmount = parsePositiveNumber(searchParams.get('minAmount'));
  const maxAmount = parsePositiveNumber(searchParams.get('maxAmount'));
  const transactionType = parseTransactionType(searchParams.get('transactionType'));
  const currency = searchParams.get('currency');
  const categoryIds = parseMultiValueFilter(searchParams.get('categoryIds'));
  const excludeCategoryIds = parseMultiValueFilter(
    searchParams.get('excludeCategoryIds'),
  );
  const paymentMethodIds = parseMultiValueFilter(searchParams.get('paymentMethodIds'));
  const excludePaymentMethodIds = parseMultiValueFilter(
    searchParams.get('excludePaymentMethodIds'),
  );
  const accountIds = parseMultiValueFilter(searchParams.get('accountIds'));
  const excludeAccountIds = parseMultiValueFilter(searchParams.get('excludeAccountIds'));

  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (minAmount !== undefined) filters.minAmount = minAmount;
  if (maxAmount !== undefined) filters.maxAmount = maxAmount;
  if (transactionType) filters.transactionType = transactionType;
  if (currency) filters.currency = currency;
  if (categoryIds && categoryIds.length > 0) filters.categoryIds = categoryIds;
  if (excludeCategoryIds && excludeCategoryIds.length > 0) {
    filters.excludeCategoryIds = excludeCategoryIds;
  }
  if (paymentMethodIds && paymentMethodIds.length > 0) {
    filters.paymentMethodIds = paymentMethodIds;
  }
  if (excludePaymentMethodIds && excludePaymentMethodIds.length > 0) {
    filters.excludePaymentMethodIds = excludePaymentMethodIds;
  }
  if (accountIds && accountIds.length > 0) filters.accountIds = accountIds;
  if (excludeAccountIds && excludeAccountIds.length > 0) {
    filters.excludeAccountIds = excludeAccountIds;
  }

  return {
    page: parsePage(searchParams.get('page')),
    filters,
  };
};

export const countActiveTransactionFilters = (filters: TransactionFilters) =>
  [
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount,
    filters.transactionType,
    filters.currency,
    filters.categoryIds?.length ? filters.categoryIds.join(',') : undefined,
    filters.excludeCategoryIds?.length ? filters.excludeCategoryIds.join(',') : undefined,
    filters.paymentMethodIds?.length ? filters.paymentMethodIds.join(',') : undefined,
    filters.excludePaymentMethodIds?.length
      ? filters.excludePaymentMethodIds.join(',')
      : undefined,
    filters.accountIds?.length ? filters.accountIds.join(',') : undefined,
    filters.excludeAccountIds?.length ? filters.excludeAccountIds.join(',') : undefined,
  ].filter((value) => value !== undefined && value !== '').length;
