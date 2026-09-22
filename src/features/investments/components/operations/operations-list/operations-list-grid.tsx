import type {
  InvestmentInstrument,
  InvestmentOperation,
} from '@features/investments/api';

import { OperationCard } from '../operation-card';

type OperationsListGridProps = {
  operations: InvestmentOperation[];
  instrumentsMap: Map<string, InvestmentInstrument>;
  onEditOperation?: (operation: InvestmentOperation) => void;
  onDeleteOperation?: (operation: InvestmentOperation) => void;
};

export const OperationsListGrid = ({
  operations,
  instrumentsMap,
  onEditOperation,
  onDeleteOperation,
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
          onEditOperation={onEditOperation}
          onDeleteOperation={onDeleteOperation}
        />
      ))}
    </div>
  );
};
