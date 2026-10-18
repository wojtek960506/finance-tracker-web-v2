import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

import { useSportEntryMutations } from '../../hooks';
import { formatDate, formatPln, getCategoryDisplayName } from '../../utils';

import type { DeleteSportActivityModalProps } from './types';

export const DeleteSportActivityModal = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}: DeleteSportActivityModalProps) => {
  const { t, i18n } = useTranslation('sports');
  const { deleteEntry, isDeleting } = useSportEntryMutations();

  if (!item) return null;

  const isLinked = Boolean(item.transactionId);

  const handleConfirm = async () => {
    try {
      await deleteEntry({
        id: item.id,
        transactionId: item.transactionId,
      });
      onClose();
      onSuccess?.();
    } catch {
      // Error handled by mutation hook toast
    }
  };

  return (
    <DeleteRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isPending={isDeleting}
      title={t('modals.deleteTitle')}
      prompt={t('modals.deletePrompt')}
      hint={isLinked ? t('modals.deleteLinkedHint') : t('modals.deleteHint')}
      hintClassName={isLinked ? 'text-xs text-warning' : 'text-xs text-destructive'}
      confirmLabel={t('modals.deleteConfirm')}
      confirmVariant="destructive"
      testIdPrefix="sport-activity"
    >
      <div
        className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-xs"
        data-testid="delete-sport-activity-summary"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-fg">{item.itemName}</span>
            <div className="flex items-center gap-1.5 text-text-muted">
              <span>{getCategoryDisplayName(item.category, t)}</span>
              <span>•</span>
              <span>{formatDate(item.date, i18n.language)}</span>
            </div>
          </div>
          <span className="text-sm font-bold text-fg">
            {formatPln(item.costPln, i18n.language)}
          </span>
        </div>

        {isLinked && (
          <div
            className="mt-1 flex items-center gap-1.5 rounded-lg bg-warning/10 px-2 py-1 text-[11px] font-medium text-warning"
            data-testid="sport-activity-linked-warning"
          >
            <span>{t('spendings.linked')}</span>
          </div>
        )}
      </div>
    </DeleteRecordModal>
  );
};
