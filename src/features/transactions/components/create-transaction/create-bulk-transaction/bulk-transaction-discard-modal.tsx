import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { TransactionActionModal } from '@transactions/components/shared';

type BulkTransactionDiscardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  meaningfulRowsCount: number;
  restoreFocusRef: RefObject<HTMLButtonElement | null>;
};

export const BulkTransactionDiscardModal = ({
  isOpen,
  onClose,
  onConfirm,
  meaningfulRowsCount,
  restoreFocusRef,
}: BulkTransactionDiscardModalProps) => {
  const { t } = useTranslation('transactions');

  return (
    <TransactionActionModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('bulkTransactionDiscardModalTitle')}
      title={t('bulkTransactionDiscardModalTitle')}
      cancelLabel={t('cancel')}
      confirmLabel={t('bulkTransactionDiscardConfirmLabel')}
      onConfirm={onConfirm}
      restoreFocusRef={restoreFocusRef}
    >
      <p>
        {t('bulkTransactionDiscardModalDescription', {
          count: meaningfulRowsCount,
        })}
      </p>
    </TransactionActionModal>
  );
};
