import clsx from 'clsx';
import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrumentSummary } from '@features/investments/api';
import { Button, Collapsible } from '@shared/ui';

import { PortfolioFilters, type PortfolioStatusFilter } from './portfolio-filters';
import { PortfolioHoldingCard } from './portfolio-holding-card';

type PortfolioHoldingsListProps = {
  instruments: InvestmentInstrumentSummary[];
};

// TODO split this file
export const PortfolioHoldingsList = ({ instruments }: PortfolioHoldingsListProps) => {
  const { t } = useTranslation('investments');
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PortfolioStatusFilter>('all');
  const [kindFilter, setKindFilter] = useState('all');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (statusFilter !== 'all') count += 1;
    if (kindFilter !== 'all') count += 1;
    return count;
  }, [searchQuery, statusFilter, kindFilter]);

  const hasActiveFilters = activeFilterCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setKindFilter('all');
  };

  const filteredInstruments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return instruments
      .filter((inst) => {
        const isClosed = inst.currentValue === 0;
        if (statusFilter === 'active' && isClosed) return false;
        if (statusFilter === 'closed' && !isClosed) return false;

        if (kindFilter !== 'all' && inst.kind !== kindFilter) return false;

        if (query && !inst.name.toLowerCase().includes(query)) return false;

        return true;
      })
      .sort((a, b) => {
        const aClosed = a.currentValue === 0;
        const bClosed = b.currentValue === 0;
        if (aClosed !== bClosed) {
          return aClosed ? 1 : -1;
        }
        return b.currentValue - a.currentValue;
      });
  }, [instruments, statusFilter, kindFilter, searchQuery]);

  if (instruments.length === 0) return null;

  const headerContent = (
    <div className="flex flex-1  gap-2 pr-2 flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {t('portfolio.holdingsTitle')}
        </h2>
        <span
          className={clsx(
            'inline-flex items-center rounded-full border border-fg/10 bg-muted/40',
            'px-2 py-0.5 text-xs font-semibold text-text-muted',
          )}
        >
          {filteredInstruments.length}
        </span>
      </div>

      {isSectionOpen && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isFiltersOpen || hasActiveFilters ? 'secondary' : 'ghost'}
            className="gap-1.5 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsFiltersOpen((prev) => !prev);
            }}
            data-testid="toggle-filters-button"
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:block">{t('filters')}</span>
            {hasActiveFilters && (
              <span
                className={clsx(
                  'flex size-4 items-center justify-center rounded-full',
                  'bg-primary text-[10px] font-bold text-primary-fg',
                )}
              >
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3" data-testid="portfolio-holdings-section">
      <Collapsible
        header={headerContent}
        indicatorPosition="left"
        isInitiallyOpen={true}
        isOpen={isSectionOpen}
        onOpenChange={setIsSectionOpen}
        triggerMode="split"
        contentInset="none"
        contentClassName="pt-3"
      >
        <div className="flex flex-col gap-3">
          {isFiltersOpen && (
            <PortfolioFilters
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedStatus={statusFilter}
              onSelectStatus={setStatusFilter}
              selectedKind={kindFilter}
              onSelectKind={setKindFilter}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {filteredInstruments.length === 0 ? (
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-2',
                'rounded-lg border border-dashed border-fg/10 p-8 text-center text-text-muted',
              )}
            >
              <p className="text-sm font-medium text-foreground">{t('noResultsTitle')}</p>
              <p className="text-xs text-text-muted">{t('noResultsDescription')}</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={resetFilters} className="mt-2 text-xs">
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredInstruments.map((instrument) => (
                <PortfolioHoldingCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
};
