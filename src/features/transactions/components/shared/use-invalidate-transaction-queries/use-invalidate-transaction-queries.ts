import { useQueryClient } from '@tanstack/react-query';

type InvalidateTransactionQueriesOptions = {
  includeTransactions?: boolean;
  includeTransactionTotals?: boolean;
  includeTransactionDetails?: boolean;
  includeTrashedTransactions?: boolean;
  includeTrashedTransactionDetails?: boolean;
  invalidateTransactionIds?: Array<string | undefined>;
  invalidateTrashedTransactionIds?: Array<string | undefined>;
  removeTransactionIds?: Array<string | undefined>;
  removeTrashedTransactionIds?: Array<string | undefined>;
  removeAllTrashedTransactionDetails?: boolean;
};

export const useInvalidateTransactionQueries = () => {
  const queryClient = useQueryClient();

  return async (options: InvalidateTransactionQueriesOptions = {}) => {
    const {
      includeTransactions = true,
      includeTransactionTotals = true,
      includeTransactionDetails = true,
      includeTrashedTransactions = true,
      includeTrashedTransactionDetails = true,
      invalidateTransactionIds = [],
      invalidateTrashedTransactionIds = [],
      removeTransactionIds = [],
      removeTrashedTransactionIds = [],
      removeAllTrashedTransactionDetails = false,
    } = options;

    for (const transactionId of removeTransactionIds) {
      if (!transactionId) continue;
      queryClient.removeQueries({
        queryKey: ['transaction', transactionId],
        exact: true,
      });
    }

    for (const transactionId of removeTrashedTransactionIds) {
      if (!transactionId) continue;
      queryClient.removeQueries({
        queryKey: ['trashed-transaction', transactionId],
        exact: true,
      });
    }

    if (removeAllTrashedTransactionDetails) {
      queryClient.removeQueries({ queryKey: ['trashed-transaction'] });
    }

    await Promise.all([
      ...(includeTransactions
        ? [queryClient.invalidateQueries({ queryKey: ['transactions'] })]
        : []),
      ...(includeTransactionTotals
        ? [queryClient.invalidateQueries({ queryKey: ['transaction-totals'] })]
        : []),
      ...(includeTransactionDetails
        ? [queryClient.invalidateQueries({ queryKey: ['transaction'] })]
        : []),
      ...invalidateTransactionIds
        .filter((transactionId): transactionId is string => Boolean(transactionId))
        .map((transactionId) =>
          queryClient.invalidateQueries({
            queryKey: ['transaction', transactionId],
            exact: true,
          }),
        ),
      ...(includeTrashedTransactions
        ? [queryClient.invalidateQueries({ queryKey: ['trashed-transactions'] })]
        : []),
      ...(includeTrashedTransactionDetails
        ? [queryClient.invalidateQueries({ queryKey: ['trashed-transaction'] })]
        : []),
      ...invalidateTrashedTransactionIds
        .filter((transactionId): transactionId is string => Boolean(transactionId))
        .map((transactionId) =>
          queryClient.invalidateQueries({
            queryKey: ['trashed-transaction', transactionId],
            exact: true,
          }),
        ),
    ]);
  };
};
