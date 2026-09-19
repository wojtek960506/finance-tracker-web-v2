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
  selectedStatus: string;
  onSelectedStatusChange: (status: string) => void;
  isFetching?: boolean;
  onCreateNew: () => void;
};

export const InstrumentsListHeader = ({
  searchQuery,
  onSearchQueryChange,
  selectedKind,
  onSelectedKindChange,
  selectedStatus,
  onSelectedStatusChange,
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

  const statusItems = useMemo(
    () => [
      { key: 'active', label: t('status.active') },
      { key: 'closed', label: t('status.closed') },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-3" data-testid="instruments-list-header">
      {/* Top row: New Instrument button (full width) */}
      <Button variant="primary" onClick={onCreateNew} className="w-full gap-1.5">
        <Plus className="size-4" />
        <span>{t('newInstrument')}</span>
      </Button>

      {/* Filters: Search and Pill Groups */}
      <div className="flex flex-col gap-2.5">
        <SearchFilterInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder={t('searchPlaceholder')}
          isFetching={isFetching}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <FilterPills
            selected={selectedStatus}
            onSelect={onSelectedStatusChange}
            allLabel={t('status.all')}
            items={statusItems}
          />

          <FilterPills
            selected={selectedKind}
            onSelect={onSelectedKindChange}
            allLabel={t('allKinds')}
            items={kindItems}
          />
        </div>
      </div>
    </div>
  );
};
