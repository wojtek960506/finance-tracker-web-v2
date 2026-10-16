import { SPENDING_TYPE_CONFIG } from '@vehicles/consts';
import { formatDate, formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Modal } from '@shared/ui';
import type { Transaction } from '@transactions/api';

import { TransactionCombobox } from './transaction-combobox';
import type { DateFilterOption, LinkSpendingModalProps } from './types';
import { useSpendingLinking } from './use-spending-linking';
import { formatDateOnly } from './utils';

export const LinkSpendingModal = ({
  isOpen,
  target,
  onClose,
  onSuccess,
}: LinkSpendingModalProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null,
  );
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('exact');

  const { linkSpendings, isLinking } = useSpendingLinking({
    onSuccess: () => {
      setSelectedTransaction(null);
      onClose();
      onSuccess?.();
    },
  });

  if (!target) return null;

  const targetDateOnly = formatDateOnly(target.date);
  const typeConfig = SPENDING_TYPE_CONFIG[target.type];
  const TypeIcon = typeConfig.icon;

  const handleLink = async () => {
    if (!selectedTransaction) return;

    await linkSpendings({
      transactionId: selectedTransaction.id,
      spendings: [
        {
          spendingType: target.type,
          spendingId: target.id,
        },
      ],
    });
  };

  const handleClose = () => {
    if (isLinking) return;
    setSelectedTransaction(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={t('spendings.linkModal.title')}
    >
      <div className="flex flex-col gap-4" data-testid="link-spending-modal">
        {/* Header */}
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">
            {t('spendings.linkModal.title')}
          </h2>
          <p className="text-xs text-text-muted">
            {t('spendings.linkModal.description')}
          </p>
        </header>

        {/* Target Spending Preview Card */}
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

        {/* Filter Chips: Date Window & Fixed Transport Category */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={clsx(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              dateFilter === 'exact'
                ? 'bg-bt-primary text-bt-primary-foreground font-semibold'
                : 'bg-muted text-text-muted hover:text-fg',
            )}
            onClick={() => setDateFilter('exact')}
            data-testid="filter-chip-exact"
          >
            {t('spendings.linkModal.exactDateChip', { date: targetDateOnly })}
          </button>

          <button
            type="button"
            className={clsx(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              dateFilter === 'window'
                ? 'bg-bt-primary text-bt-primary-foreground font-semibold'
                : 'bg-muted text-text-muted hover:text-fg',
            )}
            onClick={() => setDateFilter('window')}
            data-testid="filter-chip-window"
          >
            {t('spendings.linkModal.windowChip')}
          </button>

          <span
            className={clsx(
              'rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1',
              'text-xs font-semibold text-primary',
            )}
            data-testid="filter-chip-transport-category"
          >
            {t('spendings.linkModal.transportOnlyChip')}
          </span>
        </div>

        {/* Transaction Selector Combobox */}
        <TransactionCombobox
          value={selectedTransaction}
          onChange={setSelectedTransaction}
          targetDate={target.date}
          targetAmount={target.costPln}
          dateFilter={dateFilter}
          categoryFilter="transport"
          disabled={isLinking}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLinking}
            data-testid="cancel-link-spending-button"
          >
            {t('common:cancel', { defaultValue: 'Cancel' })}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => void handleLink()}
            disabled={!selectedTransaction || isLinking}
            data-testid="confirm-link-spending-button"
          >
            {isLinking
              ? t('spendings.linkModal.linking')
              : t('spendings.linkModal.linkSubmit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
