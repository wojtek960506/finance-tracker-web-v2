import { useQueryClient } from '@tanstack/react-query';

type InvalidateTransactionQueriesOptions = {
  includeTransactions?: boolean;
  includeTransactionDetails?: boolean;
  includeTrashedTransactions?: boolean;
  includeTrashedTransactionDetails?: boolean;
  removeTransactionIds?: Array<string | undefined>;
  removeTrashedTransactionIds?: Array<string | undefined>;
  removeAllTrashedTransactionDetails?: boolean;
};

export const useInvalidateTransactionQueries = () => {
  const queryClient = useQueryClient();

  return async (options: InvalidateTransactionQueriesOptions = {}) => {
    const {
      includeTransactions = true,
      includeTransactionDetails = true,
      includeTrashedTransactions = true,
      includeTrashedTransactionDetails = true,
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
      ...(includeTransactionDetails
        ? [queryClient.invalidateQueries({ queryKey: ['transaction'] })]
        : []),
      ...(includeTrashedTransactions
        ? [queryClient.invalidateQueries({ queryKey: ['trashed-transactions'] })]
        : []),
      ...(includeTrashedTransactionDetails
        ? [queryClient.invalidateQueries({ queryKey: ['trashed-transaction'] })]
        : []),
    ]);
  };
};
