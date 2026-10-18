import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getTransactions,
  type Transaction,
  type TransactionFilters,
} from '@transactions/api';

import type { TransactionComboboxProps } from './types';
import { formatDate, formatDateOnly, formatPln, getDateWindow } from './utils';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

export const TransactionCombobox = ({
  value,
  onChange,
  targetDate,
  targetAmount,
  dateFilter = 'exact',
  categoryPredicate,
  disabled = false,
  searchPlaceholder,
  loadingPlaceholder,
  emptyMessage,
  exactMatchBadgeText,
}: TransactionComboboxProps) => {
  const { t: tCommon, i18n } = useTranslation('common');
  const lang = i18n.language;

  const queryFilters: TransactionFilters = useMemo(() => {
    const filters: TransactionFilters = {
      transactionType: 'expense',
    };

    if (targetDate && dateFilter === 'exact') {
      const day = formatDateOnly(targetDate);
      filters.startDate = day;
      filters.endDate = day;
    } else if (targetDate && dateFilter === 'window') {
      const windowRange = getDateWindow(targetDate, 3);
      filters.startDate = windowRange.startDate;
      filters.endDate = windowRange.endDate;
    }

    return filters;
  }, [dateFilter, targetDate]);

  const { data: rawTransactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'link-search', queryFilters],
    queryFn: async () => await getTransactions({ page: 1, filters: queryFilters }),
    select: (res) => res.items,
  });

  const filteredAndSortedTransactions = useMemo(() => {
    let items = rawTransactions;

    if (categoryPredicate) {
      items = items.filter((tx) => {
        const catName = 'category' in tx ? tx.category?.name : undefined;
        return categoryPredicate(catName);
      });
    }

    return [...items].sort((a, b) => {
      if (targetAmount !== undefined) {
        const aExact = Math.abs(a.amount - targetAmount) < 0.001;
        const bExact = Math.abs(b.amount - targetAmount) < 0.001;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
      }

      if (categoryPredicate) {
        const aCat = 'category' in a ? a.category?.name : undefined;
        const bCat = 'category' in b ? b.category?.name : undefined;
        const aMatches = categoryPredicate(aCat);
        const bMatches = categoryPredicate(bCat);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [rawTransactions, targetAmount, categoryPredicate]);

  const formatTransactionLabel = (tx: Transaction) => {
    const desc = tx.description || 'Expense';
    const cat = 'category' in tx && tx.category?.name ? ` [${tx.category.name}]` : '';
    return `${formatDateOnly(tx.date)} • ${desc}${cat} • ${tx.amount} ${tx.currency}`;
  };

  const resolvedSearchPlaceholder =
    searchPlaceholder ?? tCommon('search', { defaultValue: 'Search...' });
  const resolvedLoadingPlaceholder =
    loadingPlaceholder ?? tCommon('loading', { defaultValue: 'Loading...' });
  const resolvedEmptyMessage =
    emptyMessage ?? tCommon('noResults', { defaultValue: 'No transactions found.' });
  const resolvedExactMatchBadge = exactMatchBadgeText ?? 'Exact Amount';

  return (
    <div className="flex flex-col gap-1.5" data-testid="transaction-combobox">
      <Combobox<Transaction>
        items={filteredAndSortedTransactions}
        value={value}
        disabled={disabled || isLoading}
        itemToStringLabel={formatTransactionLabel}
        itemToStringValue={formatTransactionLabel}
        onValueChange={onChange}
      >
        <ComboboxInput
          className="w-full"
          placeholder={isLoading ? resolvedLoadingPlaceholder : resolvedSearchPlaceholder}
          disabled={disabled || isLoading}
          showClear
          data-testid="transaction-combobox-input"
        />

        <ComboboxContent>
          <ComboboxEmpty className="p-4 text-center text-xs text-text-muted">
            {resolvedEmptyMessage}
          </ComboboxEmpty>
          <ComboboxList>
            {(tx) => {
              const isExact =
                targetAmount !== undefined && Math.abs(tx.amount - targetAmount) < 0.001;
              const catName = 'category' in tx ? tx.category?.name : undefined;
              const isSelected = value?.id === tx.id;

              return (
                <ComboboxItem
                  key={tx.id}
                  value={tx}
                  className="flex items-center justify-between gap-3 p-2.5 text-xs"
                  data-testid={`transaction-item-${tx.id}`}
                >
                  <div className="flex flex-col gap-0.5 truncate text-left">
                    <div className="flex items-center gap-1.5 truncate font-medium text-fg">
                      <span>{formatDate(tx.date, lang)}</span>
                      <span>•</span>
                      <span className="truncate">{tx.description || '-'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted">
                      {catName && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-fg">
                          {catName}
                        </span>
                      )}

                      {isExact && (
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 rounded bg-emerald-500/10',
                            'px-1.5 py-0.5 font-semibold text-emerald-500',
                          )}
                        >
                          <Sparkles className="size-3" />
                          {resolvedExactMatchBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-bold text-fg sm:text-sm">
                      {formatPln(tx.amount, lang)}
                    </span>
                    {isSelected && <Check className="size-4 text-active-nav" />}
                  </div>
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};
