import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { useAuthToken, useLanguage } from '@shared/hooks';
import { Button, Card } from '@shared/ui';
import { getTransaction } from '@transactions/api';

const Detail = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-0 px-4">
      <span className="text-text-muted text-left text-sm">{title}</span>
      <span className="text-md md:text-lg">{children}</span>
    </div>
  );
};

export const TransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

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
      <Card className="max-w-100 m-auto gap-3 md:gap-4">
        <Button variant="secondary">{t('updateTransaction')}</Button>
        <h1 className="text-lg md:text-xl font-semibold text-left px-4">
          {transaction.description}
        </h1>
        <div className="flex flex-col gap-2">
          <Detail title={t('date')}>
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
          </Detail>
          <Detail title={t('amount')}>
            {transaction.amount.toFixed(2)} {transaction.currency}
          </Detail>
          <Detail title={t('transactionType')}>{transaction.transactionType}</Detail>
          <Detail title={t('category')}>
            <Link to="/categories" className="hover:text-active-nav">
              {transaction.category.name}
            </Link>
          </Detail>
          <Detail title={t('paymentMethod')}>
            <Link to="/paymentMethods" className="hover:text-active-nav">
              {transaction.paymentMethod.name}
            </Link>
          </Detail>
          <Detail title={t('account')}>
            <Link to="/accounts" className="hover:text-active-nav">
              {transaction.account.name}
            </Link>
          </Detail>
        </div>
        <Button variant="destructive">{t('deleteTransaction')}</Button>
      </Card>
    </>
  );
};
