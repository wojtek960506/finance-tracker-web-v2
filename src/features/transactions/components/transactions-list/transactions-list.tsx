import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { Button } from '@shared/ui';
import { getTransactions } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';
import { TransactionsPagination } from './transactions-pagination';

export const TransactionsList = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page],
    queryFn: async () => await getTransactions(page),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  if (!data || data.items.length === 0)
    return <p>There are no transactions - TODO add button to create one</p>;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 max-w-150 m-auto">
      <Button
        variant="primary"
        className={MAIN_BUTTON_TEXT}
        onClick={() => navigate('/transactions/new')}
      >
        {t('newTransaction')}
      </Button>

      <ul className="flex flex-col gap-2 sm:gap-3">
        {data.items.map((transaction) => (
          <TransactionPreview transaction={transaction} key={transaction.id} />
        ))}
      </ul>
      <TransactionsPagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
