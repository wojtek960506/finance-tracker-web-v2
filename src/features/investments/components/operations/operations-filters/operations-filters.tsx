import clsx from 'clsx';
import { Camera, LoaderCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrument } from '@features/investments/api';
import { OPERATION_KINDS } from '@features/investments/consts';
import { Button, Input } from '@shared/ui';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OperationsFiltersProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedKind: string;
  onSelectedKindChange: (kind: string) => void;
  selectedInstrumentId: string;
  onSelectedInstrumentIdChange: (instrumentId: string) => void;
  instruments: InvestmentInstrument[];
  isFetching?: boolean;
  onCreateSnapshot?: () => void;
};

export const OperationsFilters = ({
  searchQuery,
  onSearchQueryChange,
  selectedKind,
  onSelectedKindChange,
  selectedInstrumentId,
  onSelectedInstrumentIdChange,
  instruments,
  isFetching,
  onCreateSnapshot,
}: OperationsFiltersProps) => {
  const { t } = useTranslation('investments');

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      data-testid="operations-filters"
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search input */}
        <div className="relative min-w-[180px] flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t('operations.searchPlaceholder')}
            className="w-full pr-9 sm:pr-10"
            aria-label={t('operations.searchPlaceholder')}
          />
          {isFetching ? (
            <LoaderCircle
              className={clsx(
                'pointer-events-none absolute right-3 top-1/2 size-4',
                '-translate-y-1/2 animate-spin text-text-muted',
              )}
            />
          ) : (
            <Search
              className={clsx(
                'pointer-events-none absolute right-3 top-1/2 size-4',
                '-translate-y-1/2 text-text-muted',
              )}
            />
          )}
        </div>

        {/* Instrument dropdown */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedInstrumentId}
            onValueChange={onSelectedInstrumentIdChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('operations.allInstruments')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('operations.allInstruments')}</SelectItem>
              {instruments.map((inst) => (
                <SelectItem key={inst.id} value={inst.id}>
                  {inst.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kind filter pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
              selectedKind === 'all'
                ? 'bg-bt-primary text-bt-primary-fg'
                : 'bg-muted/50 text-text-muted hover:bg-muted',
            )}
            onClick={() => onSelectedKindChange('all')}
          >
            {t('allKinds')}
          </button>
          {OPERATION_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors',
                selectedKind === kind
                  ? 'bg-bt-primary text-bt-primary-fg'
                  : 'bg-muted/50 text-text-muted hover:bg-muted',
              )}
              onClick={() => onSelectedKindChange(kind)}
            >
              {t(`operationKind.${kind}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Snapshot Action Button */}
      {onCreateSnapshot ? (
        <Button
          variant="primary"
          onClick={onCreateSnapshot}
          className="shrink-0 gap-1.5 self-stretch sm:self-auto"
        >
          <Camera className="size-4" />
          <span>{t('operations.newSnapshot')}</span>
        </Button>
      ) : null}
    </div>
  );
};
