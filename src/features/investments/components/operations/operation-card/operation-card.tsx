import clsx from 'clsx';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type {
  InvestmentInstrument,
  InvestmentOperation,
  InvestmentSnapshotOperation,
} from '@features/investments/api';
import { InstrumentKindBadge } from '@features/investments/components/instruments/instrument-kind-badge';
import { InvestmentCard } from '@features/investments/components/shared';
import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';
import { Button } from '@shared/ui';

import { OperationKindBadge } from '../operation-kind-badge';

type OperationCardProps = {
  operation: InvestmentOperation;
  instrument?: InvestmentInstrument;
  onEditSnapshot?: (snapshot: InvestmentSnapshotOperation) => void;
  onDeleteSnapshot?: (snapshot: InvestmentSnapshotOperation) => void;
};

export const OperationCard = ({
  operation,
  instrument,
  onEditSnapshot,
  onDeleteSnapshot,
}: OperationCardProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();

  const isSnapshot = operation.kind === 'snapshot';
  const formattedAmount = formatCurrencyAmount(
    operation.amount,
    operation.currency,
    language,
  );

  return (
    <InvestmentCard isSnapshot={isSnapshot} testId="operation-card">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <OperationKindBadge kind={operation.kind} />
              {instrument ? <InstrumentKindBadge kind={instrument.kind} /> : null}
            </div>

            <h3
              className={clsx(
                'text-base font-semibold tracking-tight text-foreground sm:text-lg',
                'break-words [overflow-wrap:anywhere]',
              )}
            >
              {instrument?.name ?? t('unknownInstrument')}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isSnapshot ? (
              <>
                {onEditSnapshot ? (
                  <Button
                    variant="ghost"
                    className="size-8 p-0 text-text-muted hover:text-foreground"
                    onClick={() =>
                      onEditSnapshot(operation as InvestmentSnapshotOperation)
                    }
                    title={t('actions.editSnapshot')}
                    aria-label={t('actions.editSnapshot')}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                ) : null}

                {onDeleteSnapshot ? (
                  <Button
                    variant="ghost"
                    className="size-8 p-0 text-text-muted hover:text-destructive"
                    onClick={() =>
                      onDeleteSnapshot(operation as InvestmentSnapshotOperation)
                    }
                    title={t('actions.deleteSnapshot')}
                    aria-label={t('actions.deleteSnapshot')}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </>
            ) : null}

            {!isSnapshot && 'transactionId' in operation && operation.transactionId ? (
              <Link
                to={`/transactions/${operation.transactionId}`}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5',
                  'text-xs font-medium text-primary hover:bg-primary/10',
                  'transition-colors',
                )}
                title={t('actions.viewTransaction')}
              >
                <span>{t('actions.viewTransaction')}</span>
                <ExternalLink className="size-3.5" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          {isSnapshot ? (
            <span className="text-xs font-medium text-text-muted">
              {t('operations.snapshotBalance')}:
            </span>
          ) : null}
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formattedAmount}
          </span>
        </div>

        {operation.note ? (
          <p
            className={clsx(
              'text-xs text-text-muted sm:text-sm',
              'break-words [overflow-wrap:anywhere]',
            )}
          >
            {operation.note}
          </p>
        ) : null}
      </div>

      <footer
        className={clsx(
          'flex items-center justify-between border-t pt-2',
          'text-xs text-text-muted',
          isSnapshot ? 'border-sky-500/15' : 'border-fg/10',
        )}
      >
        <span>{new Date(operation.date).toLocaleDateString(language)}</span>
      </footer>
    </InvestmentCard>
  );
};
