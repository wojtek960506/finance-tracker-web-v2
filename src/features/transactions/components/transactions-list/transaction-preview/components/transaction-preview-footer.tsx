import { useTranslation } from 'react-i18next';

import type { Transaction, TrashedTransaction } from '@transactions/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils';
import { ButtonLink } from '@ui';

type TransactionPreviewFooterProps = {
  transaction: Transaction | TrashedTransaction;
};

const GHOST_LINK_CLASS_NAME = 'text-sm sm:text-base';

export const TransactionPreviewFooter = ({
  transaction,
}: TransactionPreviewFooterProps) => {
  const { t: tNamedResources } = useTranslation('namedResources');

  const accountLabel = getTransactionNamedResourceLabel(
    transaction.account,
    tNamedResources,
  );
  const paymentMethodLabel = getTransactionNamedResourceLabel(
    transaction.paymentMethod,
    tNamedResources,
  );
  const categoryLabel = getTransactionNamedResourceLabel(
    transaction.category,
    tNamedResources,
  );

  return (
    <footer className="flex flex-wrap items-center justify-between justify-end gap-1">
      <ButtonLink to="/transactions/accounts" className={GHOST_LINK_CLASS_NAME}>
        {accountLabel}
      </ButtonLink>
      <ButtonLink to="/transactions/payment-methods" className={GHOST_LINK_CLASS_NAME}>
        {paymentMethodLabel}
      </ButtonLink>
      <ButtonLink to="/transactions/categories" className={GHOST_LINK_CLASS_NAME}>
        {categoryLabel}
      </ButtonLink>
    </footer>
  );
};
