import type {
  InvestmentInstrument,
  InvestmentOperation,
  InvestmentSnapshotOperation,
} from '@features/investments/api';

import { OperationCard } from '../operation-card';

type OperationsListGridProps = {
  operations: InvestmentOperation[];
  instrumentsMap: Map<string, InvestmentInstrument>;
  onDeleteSnapshot?: (snapshot: InvestmentSnapshotOperation) => void;
};

export const OperationsListGrid = ({
  operations,
  instrumentsMap,
  onDeleteSnapshot,
}: OperationsListGridProps) => {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      data-testid="operations-list-grid"
    >
      {operations.map((op) => (
        <OperationCard
          key={op.id}
          operation={op}
          instrument={instrumentsMap.get(op.instrumentId)}
          onDeleteSnapshot={onDeleteSnapshot}
        />
      ))}
    </div>
  );
};
