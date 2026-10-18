import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

import { useSportSpendingLinking } from '../../hooks';
import { formatDate, formatPln } from '../../utils';

import type { UnlinkSportSpendingModalProps } from './types';

export const UnlinkSportSpendingModal = ({
  isOpen,
  target,
  onClose,
  onSuccess,
}: UnlinkSportSpendingModalProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  const { unlinkSpending, isUnlinking } = useSportSpendingLinking({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  if (!target) return null;

  const handleConfirm = () => {
    void unlinkSpending({
      entryId: target.id,
    }).catch(() => {
      // Toast error handled by useSportSpendingLinking
    });
  };

  return (
    <DeleteRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isPending={isUnlinking}
      title={t('spendings.unlinkModal.title')}
      prompt={t('spendings.unlinkModal.prompt')}
      hint={t('spendings.unlinkModal.hint')}
      hintClassName="text-xs text-warning"
      confirmLabel={t('spendings.unlinkModal.confirm')}
      confirmVariant="warning"
      testIdPrefix="unlink-sport-spending"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-fg">
            <span>{target.itemName}</span>
            {target.categoryName && (
              <span className="text-[11px] font-normal text-text-muted">
                • {target.categoryName}
              </span>
            )}
          </div>
          <span className="text-[11px] text-text-muted">
            {formatDate(target.date, lang)}
          </span>
        </div>

        <span className="text-sm font-bold text-fg sm:text-base">
          {formatPln(target.costPln, lang)}
        </span>
      </div>
    </DeleteRecordModal>
  );
};
