import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { InstrumentSelectField } from '@features/investments/components/instruments/instrument-select-field';

import { OperationKindFilter } from './operation-kind-filter';

type OperationsFiltersProps = {
  selectedKind: string;
  onSelectedKindChange: (kind: string) => void;
  selectedInstrumentId: string;
  onSelectedInstrumentIdChange: (instrumentId: string) => void;
  className?: string;
};

export const OperationsFilters = ({
  selectedKind,
  onSelectedKindChange,
  selectedInstrumentId,
  onSelectedInstrumentIdChange,
  className,
}: OperationsFiltersProps) => {
  const { t } = useTranslation('investments');

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-fg/10 bg-muted/20 p-3 sm:p-4',
        className,
      )}
      data-testid="operations-filters"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        {/* Operation Kind Filter Pills */}
        <div className="flex flex-1 flex-col gap-1.5 self-center">
          <span className="text-xs font-medium text-text-muted hidden lg:block">
            {t('form.operationKind')}
          </span>
          <OperationKindFilter
            selectedKind={selectedKind}
            onSelectKind={onSelectedKindChange}
          />
        </div>

        <div className="hidden h-auto w-px self-stretch bg-fg/10 md:block" />
        <div className="h-px w-full bg-fg/10 md:hidden" />

        {/* Instrument Combobox Filter */}
        <div className="flex w-full shrink-0 flex-col gap-1.5 md:w-64 self-center">
          <InstrumentSelectField
            value={selectedInstrumentId === 'all' ? '' : selectedInstrumentId}
            onChange={(id) => onSelectedInstrumentIdChange(id || 'all')}
            placeholder={t('operations.allInstruments')}
            searchPlaceholder={t('operations.allInstruments')}
            showClear={true}
          />
        </div>
      </div>
    </div>
  );
};
