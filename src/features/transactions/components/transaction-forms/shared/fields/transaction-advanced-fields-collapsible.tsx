import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Collapsible } from '@shared/ui';

type TransactionAdvancedFieldsCollapsibleProps = {
  isOpen: boolean;
  children: ReactNode;
};

export const TransactionAdvancedFieldsCollapsible = ({
  isOpen,
  children,
}: TransactionAdvancedFieldsCollapsibleProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="sm:col-span-2">
      <Collapsible
        header={
          <span className="text-base font-medium sm:text-lg">{t('advancedFields')}</span>
        }
        indicatorPosition="left"
        isInitiallyOpen={isOpen}
        triggerMode="full-row"
        contentInset="none"
        contentClassName="px-[2px] pb-[2px]"
      >
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">{children}</div>
      </Collapsible>
    </div>
  );
};
