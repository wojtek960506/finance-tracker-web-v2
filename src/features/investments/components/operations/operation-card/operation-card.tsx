import clsx from 'clsx';
import { ExternalLink, Pencil, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type {
  InvestmentInstrument,
  InvestmentInstrumentSummary,
  InvestmentOperation,
} from '@features/investments/api';
import { InstrumentKindBadge } from '@features/investments/components/instruments/instrument-kind-badge';
import { InvestmentCard } from '@features/investments/components/shared';
import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';
import { Button } from '@shared/ui';

import { OperationKindBadge } from '../operation-kind-badge';

type OperationCardProps = {
  operation: InvestmentOperation;
  instrument?: InvestmentInstrument | InvestmentInstrumentSummary;
  onEditOperation?: (operation: InvestmentOperation) => void;
  onDeleteOperation?: (operation: InvestmentOperation) => void;
};

export const OperationCard = ({
  operation,
  instrument,
  onEditOperation,
  onDeleteOperation,
}: OperationCardProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();

  const isSnapshot = operation.kind === 'snapshot';
  const isStandalone = !(
    'transactionId' in operation && Boolean(operation.transactionId)
  );
  const handleEdit = onEditOperation;
  const handleDelete = onDeleteOperation;

  const formattedAmount = formatCurrencyAmount(
    operation.amount,
    operation.currency,
    language,
  );

  return (
    <InvestmentCard
      isSnapshot={isSnapshot}
      testId="operation-card"
      className="row-span-4 grid w-full grid-cols-1 grid-rows-subgrid gap-2"
    >
      {/* Row 1: Badges */}
      <div className="flex w-full flex-wrap items-center gap-1.5">
        <OperationKindBadge kind={operation.kind} />
        {instrument && <InstrumentKindBadge kind={instrument.kind} />}
      </div>

      {/* Row 2: Instrument Name */}
      <h3
        className={clsx(
          'text-sm font-semibold tracking-tight text-foreground sm:text-base',
          'break-words [overflow-wrap:anywhere] pt-0 sm:pt-0.5',
        )}
      >
        {instrument?.name ?? t('unknownInstrument')}
      </h3>

      {/* Row 3: Amount & Optional Note */}
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-baseline justify-end gap-2">
          {isSnapshot && (
            <span className="text-xs font-medium text-text-muted">
              {t('operations.snapshotBalance')}:
            </span>
          )}
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formattedAmount}
          </span>
        </div>

        {operation.note && (
          <p
            className={clsx(
              'text-xs text-text-muted sm:text-sm',
              'break-words [overflow-wrap:anywhere]',
            )}
          >
            {operation.note}
          </p>
        )}
      </div>

      {/* Row 4: Footer */}
      <footer
        className={clsx(
          'flex w-full items-center justify-between border-t mt-0.5 pt-0.5',
          'text-xs text-text-muted md:text-sm',
          isSnapshot ? 'border-purple-500/15' : 'border-fg/10',
        )}
      >
        <span>{new Date(operation.date).toLocaleDateString(language)}</span>

        <div className="flex shrink-0 items-center gap-1">
          {isStandalone ? (
            <>
              {handleEdit ? (
                <Button
                  variant="ghost"
                  className="size-7 p-0 text-text-muted hover:text-foreground sm:size-8"
                  onClick={() => handleEdit(operation)}
                  title={
                    isSnapshot ? t('actions.editSnapshot') : t('actions.editOperation')
                  }
                  aria-label={
                    isSnapshot ? t('actions.editSnapshot') : t('actions.editOperation')
                  }
                >
                  <Pencil className="size-3.5 sm:size-4" />
                </Button>
              ) : null}

              {handleDelete ? (
                <Button
                  variant="ghost"
                  className="size-7 p-0 text-text-muted hover:text-destructive sm:size-8"
                  onClick={() => handleDelete(operation)}
                  title={
                    isSnapshot
                      ? t('actions.deleteSnapshot')
                      : t('actions.deleteOperation')
                  }
                  aria-label={
                    isSnapshot
                      ? t('actions.deleteSnapshot')
                      : t('actions.deleteOperation')
                  }
                >
                  <Trash className="size-3.5 sm:size-4" />
                </Button>
              ) : null}
            </>
          ) : null}

          {!isStandalone && 'transactionId' in operation && operation.transactionId ? (
            <Link
              to={`/transactions/${operation.transactionId}`}
              className={clsx(
                'inline-flex h-7 items-center gap-1 rounded-md px-2 py-1 sm:h-8',
                'text-xs font-medium text-primary hover:bg-primary/10 md:text-sm',
                'transition-colors',
              )}
              title={t('actions.viewTransaction')}
            >
              <span>{t('actions.viewTransaction')}</span>
              <ExternalLink className="size-3.5 sm:size-4" />
            </Link>
          ) : null}
        </div>
      </footer>
    </InvestmentCard>
  );
};
