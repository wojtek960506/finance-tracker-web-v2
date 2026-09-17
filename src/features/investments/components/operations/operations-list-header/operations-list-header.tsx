import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { InvestmentInstrument } from '@features/investments/api';
import { Button } from '@shared/ui';
import { getButtonClassName } from '@shared/ui/button/get-button-class-name';

import { OperationsFilters } from '../operations-filters';

type OperationsListHeaderProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedKind: string;
  onSelectedKindChange: (kind: string) => void;
  selectedInstrumentId: string;
  onSelectedInstrumentIdChange: (instrumentId: string) => void;
  instruments: InvestmentInstrument[];
  isFetching?: boolean;
  onCreateSnapshot: () => void;
};

export const OperationsListHeader = ({
  searchQuery,
  onSearchQueryChange,
  selectedKind,
  onSelectedKindChange,
  selectedInstrumentId,
  onSelectedInstrumentIdChange,
  instruments,
  isFetching,
  onCreateSnapshot,
}: OperationsListHeaderProps) => {
  const { t } = useTranslation('investments');

  return (
    <div className="flex flex-col gap-3" data-testid="operations-list-header">
      {/* Action buttons: Record Snapshot + New Investment Transaction */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button variant="primary" onClick={onCreateSnapshot} className="w-full gap-1.5">
          <Plus className="size-4" />
          <span>{t('operations.recordSnapshot')}</span>
        </Button>
        <Link
          to="/transactions/new/investment"
          className={getButtonClassName({
            variant: 'outline',
            className: 'w-full gap-1.5',
          })}
        >
          <Plus className="size-4" />
          <span>{t('operations.newInvestmentTransaction')}</span>
        </Link>
      </div>

      {/* Filter controls */}
      <OperationsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        selectedKind={selectedKind}
        onSelectedKindChange={onSelectedKindChange}
        selectedInstrumentId={selectedInstrumentId}
        onSelectedInstrumentIdChange={onSelectedInstrumentIdChange}
        instruments={instruments}
        isFetching={isFetching}
      />
    </div>
  );
};
