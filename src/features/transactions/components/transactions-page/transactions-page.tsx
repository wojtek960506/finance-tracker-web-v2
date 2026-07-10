import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { TransactionsPageContent } from './transactions-page-content';
import { TransactionsPageProvider } from './transactions-page-context';
import { useTransactionsPage } from './use-transactions-page';

// TODO:
// 1. refactor this file
// 2. in forms also do some refactor for single fields
// 3. useEffect for too high page number might be somehow enhanced
// 4. there is some strange behavior for date picker in filter as clicking anywhere is moving to
//    the previous month and also sometimes is mark all of the days
// 5. next click on selectors is swallowed
// 6. when placeholder of selector is too long then it just make it wider and it can exceed the
//    size of parent component
// 7. when selector is open at the beginning scrolling of the whole page works but then it is not
//    possible without focusing on something outside selector
// 8. selector sometimes exceeds size of the parent component when it is open and then
//    scrolling is also strange (maybe can be open above when there is enough space and then
//    can be moved under when there is enough space)
// 9. replace full transactions/totals refetch after create/delete with optimistic query updates
// 10. consider replacing generic loading states with screen-specific skeleton UIs
// 11. revisit bundle size warnings and introduce route-level code splitting where it helps PR #13
export const TransactionsPage = () => {
  const { t } = useTranslation('transactions');
  const { isLoading, error, contextValue } = useTransactionsPage();

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingTransactions')}
        description={t('loadingTransactionsDescription')}
        widthClassName="max-w-[35rem]"
      />
    );
  }
  if (error) return <p>{error.message}</p>;

  return (
    <TransactionsPageProvider value={contextValue}>
      <TransactionsPageContent />
    </TransactionsPageProvider>
  );
};
