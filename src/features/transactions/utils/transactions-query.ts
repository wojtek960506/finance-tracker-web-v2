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

const appendFilterParams = (params: URLSearchParams, filters: TransactionFilters) => {
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.minAmount !== undefined) params.set('minAmount', String(filters.minAmount));
  if (filters.maxAmount !== undefined) params.set('maxAmount', String(filters.maxAmount));
  if (filters.transactionType) params.set('transactionType', filters.transactionType);
  if (filters.currency) params.set('currency', filters.currency);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.excludeCategoryIds?.length) {
    params.set('excludeCategoryIds', filters.excludeCategoryIds.join(','));
  }
  if (filters.paymentMethodId) params.set('paymentMethodId', filters.paymentMethodId);
  if (filters.accountId) params.set('accountId', filters.accountId);
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
  const excludeCategoryIds = searchParams
    .get('excludeCategoryIds')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const filters: TransactionFilters = {};
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const minAmount = parsePositiveNumber(searchParams.get('minAmount'));
  const maxAmount = parsePositiveNumber(searchParams.get('maxAmount'));
  const transactionType = parseTransactionType(searchParams.get('transactionType'));
  const currency = searchParams.get('currency');
  const categoryId = searchParams.get('categoryId');
  const paymentMethodId = searchParams.get('paymentMethodId');
  const accountId = searchParams.get('accountId');

  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (minAmount !== undefined) filters.minAmount = minAmount;
  if (maxAmount !== undefined) filters.maxAmount = maxAmount;
  if (transactionType) filters.transactionType = transactionType;
  if (currency) filters.currency = currency;
  if (categoryId) filters.categoryId = categoryId;
  if (excludeCategoryIds && excludeCategoryIds.length > 0) {
    filters.excludeCategoryIds = excludeCategoryIds;
  }
  if (paymentMethodId) filters.paymentMethodId = paymentMethodId;
  if (accountId) filters.accountId = accountId;

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
    filters.categoryId,
    filters.excludeCategoryIds?.length ? filters.excludeCategoryIds.join(',') : undefined,
    filters.paymentMethodId,
    filters.accountId,
  ].filter((value) => value !== undefined && value !== '').length;
