import { Camera, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type {
  InvestmentInstrument,
  InvestmentOperation,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import { OperationCard } from '@features/investments/components/operations/operation-card';
import { Button, Card, getButtonClassName } from '@shared/ui';

type InstrumentOperationsLedgerProps = {
  instrument: InvestmentInstrument;
  operations: InvestmentOperation[];
  onRecordSnapshot: () => void;
  onEditSnapshot: (snapshot: InvestmentSnapshotOperation) => void;
  onDeleteSnapshot: (snapshot: InvestmentSnapshotOperation) => void;
};

export const InstrumentOperationsLedger = ({
  instrument,
  operations,
  onRecordSnapshot,
  onEditSnapshot,
  onDeleteSnapshot,
}: InstrumentOperationsLedgerProps) => {
  const { t } = useTranslation('investments');

  const sortedOperations = [...operations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {t('details.operationsHistory')}
        </h2>
        <span className="text-xs text-text-muted">
          {operations.length} {t('operations.count', { count: operations.length })}
        </span>
      </div>

      {sortedOperations.length === 0 ? (
        <Card
          className="flex flex-col items-center justify-center gap-3 p-8 text-center"
          data-testid="instrument-ledger-empty"
        >
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {t('details.noOperationsYet')}
            </h3>
            <p className="max-w-md text-xs text-text-muted sm:text-sm">
              {t('details.noOperationsYetDescription')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={onRecordSnapshot}
              className="flex items-center gap-1.5"
            >
              <Camera className="size-4" />
              <span>{t('operations.recordFirstSnapshot')}</span>
            </Button>

            <Link
              to={`/transactions/new/investment?instrumentId=${instrument.id}`}
              className={getButtonClassName({
                variant: 'outline',
                className: 'flex items-center gap-1.5',
              })}
            >
              <Plus className="size-4" />
              <span>{t('operations.newInvestmentTransaction')}</span>
            </Link>
          </div>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          data-testid="instrument-ledger-grid"
        >
          {sortedOperations.map((op) => (
            <OperationCard
              key={op.id}
              operation={op}
              instrument={instrument}
              onEditSnapshot={onEditSnapshot}
              onDeleteSnapshot={onDeleteSnapshot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
