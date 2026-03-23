import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { useAuthToken } from '@shared/hooks';
import { Button, Card } from '@shared/ui';
import { getTransaction } from '@transactions/api';

export const TransactionDetails = () => {
  const { t } = useTranslation('transactions');

  const { transactionId } = useParams<{ transactionId: string }>();

  const { authToken } = useAuthToken();
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(authToken, transactionId!),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  return (
    <>
      <Card className="max-w-150 m-auto">
        <Button variant="secondary">{t('update')}</Button>
        <h1 className="text-xl font-medium">{transaction.description}</h1>
        <div className="grid grid-cols-[auto_auto] gap-2">
          {/* <span>{t('description')}</span>
          <span>{transaction.description}</span> */}

          <span>{t('date')}</span>
          <time>{transaction.date}</time>

          <span>{t('amount')}</span>
          <span>{transaction.amount}</span>

          <span>{t('currency')}</span>
          <span>{transaction.currency}</span>

          <span>{t('transactionType')}</span>
          <span>{transaction.transactionType}</span>

          <span>{t('category')}</span>
          <span>{transaction.category.name}</span>

          <Link to="/paymentMethods" className="hover:text-active-nav">
            <span>{t('paymentMethod')}</span>
          </Link>
          <Link to="/paymentMethods">
            <span>{transaction.paymentMethod.name}</span>
          </Link>

          <span>{t('account')}</span>
          <span>{transaction.account.name}</span>
        </div>
        <Button variant="destructive">{t('delete')}</Button>
      </Card>
    </>
  );
};
