import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FilterPills, SearchFilterInput } from '@features/investments/components/shared';
import { INSTRUMENT_KINDS } from '@features/investments/consts';
import { Button } from '@shared/ui';

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

  const kindItems = useMemo(
    () =>
      INSTRUMENT_KINDS.map((kind) => ({
        key: kind,
        label: t(`kind.${kind}`),
      })),
    [t],
  );

  return (
    <div className="flex flex-col gap-3" data-testid="instruments-list-header">
      {/* Top row: New Instrument button (full width) */}
      <Button variant="primary" onClick={onCreateNew} className="w-full gap-1.5">
        <Plus className="size-4" />
        <span>{t('newInstrument')}</span>
      </Button>

      {/* Filters: separate rows below md, side-by-side on md and above */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <SearchFilterInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder={t('searchPlaceholder')}
          isFetching={isFetching}
        />

        <FilterPills
          selected={selectedKind}
          onSelect={onSelectedKindChange}
          allLabel={t('allKinds')}
          items={kindItems}
        />
      </div>
    </div>
  );
};
