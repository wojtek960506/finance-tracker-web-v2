import { SPENDING_TYPE_CONFIG } from '@vehicles/consts';
import { formatDate, formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

import type { UnlinkSpendingModalProps } from './types';
import { useSpendingLinking } from './use-spending-linking';

export const UnlinkSpendingModal = ({
  isOpen,
  target,
  onClose,
  onSuccess,
}: UnlinkSpendingModalProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { unlinkSpending, isUnlinking } = useSpendingLinking({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  if (!target) return null;

  const typeConfig = SPENDING_TYPE_CONFIG[target.type];
  const TypeIcon = typeConfig.icon;

  const handleConfirm = () => {
    void unlinkSpending({
      spendingType: target.type,
      spendingId: target.id,
    }).catch(() => {
      // Error handled by useSpendingLinking toast
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
      testIdPrefix="unlink-spending"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'flex size-9 items-center justify-center rounded-lg',
              typeConfig.bgClass,
            )}
          >
            <TypeIcon className={clsx('size-4', typeConfig.colorClass)} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fg">
              <span>{target.title || t(`spendingTypes.${target.type}`)}</span>
              {target.vehicleName && (
                <span className="text-[11px] font-normal text-text-muted">
                  • {target.vehicleName}
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted">
              {formatDate(target.date, lang)}
            </span>
          </div>
        </div>

        <span className="text-sm font-bold text-fg sm:text-base">
          {formatPln(target.costPln, lang)}
        </span>
      </div>
    </DeleteRecordModal>
  );
};
