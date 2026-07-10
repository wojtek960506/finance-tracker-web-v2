import { useContext } from 'react';

import { TransactionsPageContext } from './transactions-page-context.shared';

export const useTransactionsPageContext = () => {
  const context = useContext(TransactionsPageContext);

  if (!context) {
    throw new Error(
      'useTransactionsPageContext must be used within a TransactionsPageProvider',
    );
  }

  return context;
};
