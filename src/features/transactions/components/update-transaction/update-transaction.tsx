import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getTransaction } from '@transactions/api';
import { getTransactionKind } from '@transactions/consts';

import { UpdateExchangeTransactionView } from './update-exchange-transaction-view';
import { UpdateStandardTransactionView } from './update-standard-transaction-view';
import { UpdateTransferTransactionView } from './update-transfer-transaction-view';

export const UpdateTransaction = () => {
  const { transactionId } = useParams<{ transactionId: string }>();

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
  });

  const transactionKind = transaction ? getTransactionKind(transaction) : undefined;
  const shouldLoadReference =
    Boolean(transaction?.refId) && transactionKind !== 'standard';

  const {
    data: transactionRef,
    isLoading: isTransactionRefLoading,
    error: transactionRefError,
  } = useQuery({
    queryKey: ['transaction', transaction?.refId],
    queryFn: async () => await getTransaction(transaction!.refId!),
    enabled: shouldLoadReference,
  });

  if (isTransactionLoading || isTransactionRefLoading) return <p>Loading</p>;
  if (transactionError) return <p>{transactionError.message}</p>;
  if (transactionRefError) return <p>{transactionRefError.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  if (transactionKind === 'standard') {
    return <UpdateStandardTransactionView transaction={transaction} />;
  }

  if (!transactionRef) return <p>No transaction</p>;

  if (transactionKind === 'transfer') {
    return (
      <UpdateTransferTransactionView
        transaction={transaction}
        transactionRef={transactionRef}
      />
    );
  }

  return (
    <UpdateExchangeTransactionView
      transaction={transaction}
      transactionRef={transactionRef}
    />
  );
};
