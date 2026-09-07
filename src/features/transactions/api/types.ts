import type { components, paths } from '@shared/types/api.generated';

export type NamedResource = components['schemas']['TransactionResponse']['category'];

export type TransactionType = components['schemas']['TransactionStandard']['transactionType'];

export type CurrencyCode = components['schemas']['TransactionStandard']['currency'];

export type TransactionStandardDTO = Omit<components['schemas']['TransactionStandard'], 'currency'> & {
  currency: CurrencyCode | (string & {});
};

export type TransactionTransferDTO = Omit<components['schemas']['TransactionTransfer'], 'currency'> & {
  currency: CurrencyCode | (string & {});
};

export type TransactionExchangeDTO = Omit<components['schemas']['TransactionExchange'], 'currencyExpense' | 'currencyIncome'> & {
  currencyExpense: CurrencyCode | (string & {});
  currencyIncome: CurrencyCode | (string & {});
};

export type BulkTransactionDTO =
  | ({ kind: 'standard' } & TransactionStandardDTO)
  | ({ kind: 'transfer' } & TransactionTransferDTO)
  | ({ kind: 'exchange' } & TransactionExchangeDTO);

export type CreateBulkTransactionsDTO = {
  transactions: BulkTransactionDTO[];
};

export type Transaction = components['schemas']['TransactionResponse'];

export type TransactionDeletion = components['schemas']['TransactionDeletion'];

export type TransactionDetails = components['schemas']['TransactionDetailsResponse'];

export type TrashedTransaction = components['schemas']['TrashedTransactionResponse'];

export type TrashedTransactionDetails = components['schemas']['TrashedTransactionDetailsResponse'];

export type TransactionsResponse =
  paths['/api/transactions/']['get']['responses'][200]['content']['application/json'];

export type TrashedTransactionsResponse =
  paths['/api/transactions/trash']['get']['responses'][200]['content']['application/json'];

export type TransactionTotalsResponse =
  paths['/api/transactions/totals']['get']['responses'][200]['content']['application/json'];

export type TransactionTotalsByCurrency =
  TransactionTotalsResponse['byCurrency'][string];

export type TransactionTotalsDetails = TransactionTotalsByCurrency['expense'];

export type TransactionTotalsOverall = TransactionTotalsResponse['overall'];

export type TransactionAccountStatisticsResponse =
  paths['/api/transactions/statistics/accounts']['get']['responses'][200]['content']['application/json'];

export type TransactionAccountStatisticsCurrency =
  TransactionAccountStatisticsResponse['currencies'][number];

export type TransactionAccountStatisticsAccount =
  TransactionAccountStatisticsCurrency['accounts'][number];

export type UpdateManyReply =
  paths['/api/transactions/trash/restore']['post']['responses'][200]['content']['application/json'];

export type DeleteManyReply =
  paths['/api/transactions/trash']['delete']['responses'][200]['content']['application/json'];

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  transactionType?: TransactionType;
  currency?: string;
  categoryIds?: string[];
  excludeCategoryIds?: string[];
  paymentMethodIds?: string[];
  excludePaymentMethodIds?: string[];
  accountIds?: string[];
  excludeAccountIds?: string[];
};

export type GetTransactionsQuery = {
  page?: number;
  filters?: TransactionFilters;
};

export type TransactionAccountStatisticsQuery = Pick<
  TransactionFilters,
  'startDate' | 'endDate' | 'transactionType' | 'currency'
> & {
  baseCurrency?: string;
};
