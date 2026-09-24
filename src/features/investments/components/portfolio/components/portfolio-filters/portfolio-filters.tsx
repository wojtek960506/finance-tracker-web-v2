import clsx from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SearchFilterInput } from '@features/investments/components/shared';
import { Button } from '@shared/ui';

import { PortfolioKindFilter } from './portfolio-kind-filter';
import {
  type PortfolioStatusFilter,
  PortfolioStatusPills,
} from './portfolio-status-pills';

type PortfolioFiltersProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedStatus: PortfolioStatusFilter;
  onSelectStatus: (status: PortfolioStatusFilter) => void;
  selectedKind: string;
  onSelectKind: (kind: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isFetching?: boolean;
  className?: string;
};

export const PortfolioFilters = ({
  searchQuery,
  onSearchQueryChange,
  selectedStatus,
  onSelectStatus,
  selectedKind,
  onSelectKind,
  onResetFilters,
  hasActiveFilters,
  isFetching,
  className,
}: PortfolioFiltersProps) => {
  const { t } = useTranslation('investments');

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-fg/10 bg-muted/20 p-3 sm:p-4',
        className,
      )}
      data-testid="portfolio-filters"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilterInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder={t('searchPlaceholder')}
          isFetching={isFetching}
          className="w-full flex-1"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className={clsx(
              'self-start shrink-0 gap-1.5 text-xs text-text-muted',
              'hover:text-foreground sm:self-auto',
            )}
          >
            <RotateCcw className="size-3.5" />
            <span>{t('clearFilters')}</span>
          </Button>
        )}
      </div>

      <div
        className={clsx(
          'flex flex-col gap-3 border-t border-fg/10 pt-3',
          'md:flex-row md:items-start md:justify-between md:gap-4',
        )}
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">{t('form.kind')}</span>
          <PortfolioKindFilter selectedKind={selectedKind} onSelectKind={onSelectKind} />
        </div>

        <div className="hidden h-auto w-px self-stretch bg-fg/10 md:block" />
        <div className="h-px w-full bg-fg/10 md:hidden" />

        <div className="flex shrink-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">{t('statusLabel')}</span>
          <PortfolioStatusPills
            selectedStatus={selectedStatus}
            onSelectStatus={onSelectStatus}
          />
        </div>
      </div>
    </div>
  );
};
