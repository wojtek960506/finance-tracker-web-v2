import clsx from 'clsx';
import { LoaderCircle, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { INSTRUMENT_KINDS } from '@features/investments/consts';
import { Button, Input } from '@shared/ui';

type InstrumentsListHeaderProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedKind: string;
  onSelectedKindChange: (kind: string) => void;
  isFetching?: boolean;
  onCreateNew: () => void;
};

export const InstrumentsListHeader = ({
  searchQuery,
  onSearchQueryChange,
  selectedKind,
  onSelectedKindChange,
  isFetching,
  onCreateNew,
}: InstrumentsListHeaderProps) => {
  const { t } = useTranslation('investments');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search input */}
        <div className="relative min-w-[200px] flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pr-9 sm:pr-10"
            aria-label={t('searchPlaceholder')}
          />
          {isFetching ? (
            <LoaderCircle className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-text-muted" />
          ) : (
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          )}
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
          {INSTRUMENT_KINDS.map((kind) => (
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
              {t(`kind.${kind}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <Button
        variant="primary"
        onClick={onCreateNew}
        className="shrink-0 gap-1.5 self-stretch sm:self-auto"
      >
        <Plus className="size-4" />
        <span>{t('newInstrument')}</span>
      </Button>
    </div>
  );
};
