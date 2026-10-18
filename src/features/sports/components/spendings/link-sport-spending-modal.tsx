import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, formatDateOnly, Modal, TransactionCombobox } from '@shared/ui';
import type { Transaction } from '@transactions/api';

import { useSportSpendingLinking } from '../../hooks';
import { formatDate, formatPln } from '../../utils';

import type {
  CategoryFilterOption,
  DateFilterOption,
  LinkSportSpendingModalProps,
} from './types';
import { isSportCategory } from './utils';

export const LinkSportSpendingModal = ({
  isOpen,
  targets,
  onClose,
  onSuccess,
}: LinkSportSpendingModalProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null,
  );
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('exact');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterOption>('sport');

  const { linkSpendings, isLinking } = useSportSpendingLinking({
    onSuccess: () => {
      setSelectedTransaction(null);
      onClose();
      onSuccess?.();
    },
  });

  if (targets.length === 0) return null;

  const primaryTarget = targets[0];
  const isMultiple = targets.length > 1;
  const totalAmount = targets.reduce((sum, item) => sum + item.costPln, 0);
  const targetDateOnly = formatDateOnly(primaryTarget.date);

  const handleLink = () => {
    if (!selectedTransaction) return;

    void linkSpendings({
      transactionId: selectedTransaction.id,
      entryIds: targets.map((target) => target.id),
    }).catch(() => {
      // Error handled by useSportSpendingLinking
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
      <div className="flex flex-col gap-4" data-testid="link-sport-spending-modal">
        {/* Header */}
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">
            {t('spendings.linkModal.title')}
          </h2>
          <p className="text-xs text-text-muted">
            {t('spendings.linkModal.description')}
          </p>
        </header>

        {/* Target Activities Preview Card */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fg">
              <span>
                {isMultiple
                  ? t('spendings.linkModal.multipleActivities', { count: targets.length })
                  : primaryTarget.itemName}
              </span>
              {!isMultiple && primaryTarget.categoryName && (
                <span className="text-[11px] font-normal text-text-muted">
                  • {primaryTarget.categoryName}
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted">
              {formatDate(primaryTarget.date, lang)}
            </span>
          </div>

          <span className="text-sm font-bold text-fg sm:text-base">
            {formatPln(totalAmount, lang)}
          </span>
        </div>

        {/* Filter Chips: Date Window & Category Filter */}
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

          <button
            type="button"
            className={clsx(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              dateFilter === 'all'
                ? 'bg-bt-primary text-bt-primary-foreground font-semibold'
                : 'bg-muted text-text-muted hover:text-fg',
            )}
            onClick={() => setDateFilter('all')}
            data-testid="filter-chip-all-dates"
          >
            {t('spendings.linkModal.allDatesChip')}
          </button>

          <button
            type="button"
            className={clsx(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              categoryFilter === 'sport'
                ? 'border border-primary/20 bg-primary/10 font-semibold text-primary'
                : 'bg-muted text-text-muted hover:text-fg',
            )}
            onClick={() =>
              setCategoryFilter(categoryFilter === 'sport' ? 'all' : 'sport')
            }
            data-testid="filter-chip-sport-category"
          >
            {categoryFilter === 'sport'
              ? t('spendings.linkModal.sportOnlyChip')
              : t('spendings.linkModal.allCategoriesChip')}
          </button>
        </div>

        {/* Transaction Selector Combobox */}
        <TransactionCombobox
          value={selectedTransaction}
          onChange={setSelectedTransaction}
          targetDate={primaryTarget.date}
          targetAmount={totalAmount}
          dateFilter={dateFilter}
          categoryPredicate={categoryFilter === 'sport' ? isSportCategory : undefined}
          disabled={isLinking}
          searchPlaceholder={t('spendings.linkModal.searchPlaceholder')}
          loadingPlaceholder={t('spendings.linkModal.linking')}
          emptyMessage={t('spendings.linkModal.noTransactionsFound')}
          exactMatchBadgeText={t('spendings.linkModal.exactMatchBadge')}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLinking}
            data-testid="cancel-link-sport-spending-button"
          >
            {t('actions.cancel')}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleLink}
            disabled={!selectedTransaction || isLinking}
            data-testid="confirm-link-sport-spending-button"
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
