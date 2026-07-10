import type { ReactNode } from 'react';

import {
  TransactionsPageContext,
  type TransactionsPageContextValue,
} from './transactions-page-context.shared';

export const TransactionsPageProvider = ({
  value,
  children,
}: {
  value: TransactionsPageContextValue;
  children: ReactNode;
}) => (
  <TransactionsPageContext.Provider value={value}>
    {children}
  </TransactionsPageContext.Provider>
);
