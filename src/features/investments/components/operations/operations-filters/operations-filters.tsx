import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrument } from '@features/investments/api';
import { FilterPills, SearchFilterInput } from '@features/investments/components/shared';
import { OPERATION_KINDS } from '@features/investments/consts';

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
}: OperationsFiltersProps) => {
  const { t } = useTranslation('investments');

  const kindItems = useMemo(
    () =>
      OPERATION_KINDS.map((kind) => ({
        key: kind,
        label: t(`operationKind.${kind}`),
      })),
    [t],
  );

  return (
    <div className="flex flex-col gap-3" data-testid="operations-filters">
      {/* Instrument selector row */}
      <div className="w-full">
        <Select value={selectedInstrumentId} onValueChange={onSelectedInstrumentIdChange}>
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

      {/* Search & Kind filters row: separate below md, side-by-side on md and above */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <SearchFilterInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder={t('operations.searchPlaceholder')}
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
