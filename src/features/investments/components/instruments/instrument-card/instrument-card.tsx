import clsx from 'clsx';
import { Pencil, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import type { InvestmentInstrument } from '@features/investments/api';
import { InvestmentCard } from '@features/investments/components/shared';
import { useLanguage } from '@shared/hooks';
import { Button } from '@shared/ui';

import { InstrumentKindBadge } from '../instrument-kind-badge';
import { InstrumentStatusBadge } from '../instrument-status-badge';

type InstrumentCardProps = {
  instrument: InvestmentInstrument;
  isClosed: boolean;
  onEdit: (instrument: InvestmentInstrument) => void;
  onDelete: (instrument: InvestmentInstrument) => void;
};

export const InstrumentCard = ({
  instrument,
  isClosed,
  onEdit,
  onDelete,
}: InstrumentCardProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <InvestmentCard
      testId="instrument-card"
      className={clsx(
        'group cursor-pointer transition-colors',
        isClosed
          ? 'opacity-80 hover:opacity-100 hover:border-fg/30'
          : clsx(
              'border-emerald-500/20 bg-emerald-500/[0.02]',
              'dark:border-emerald-500/25 dark:bg-emerald-950/10',
              'hover:border-emerald-500/50',
            ),
      )}
      onClick={() => navigate(`/investments/instruments/${instrument.id}`)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3
              className={clsx(
                'text-base font-semibold tracking-tight text-foreground sm:text-lg',
                'break-words [overflow-wrap:anywhere]',
              )}
            >
              <Link
                to={`/investments/instruments/${instrument.id}`}
                className="transition-colors group-hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {instrument.name}
              </Link>
            </h3>

            <div className="flex flex-wrap items-center gap-1.5">
              <InstrumentStatusBadge isClosed={isClosed} />
              <InstrumentKindBadge kind={instrument.kind} />
              {instrument.currency ? (
                <span
                  className={clsx(
                    'inline-flex items-center rounded-md border border-fg/10 bg-bg',
                    'px-2 py-0.5 text-xs font-medium text-text-muted',
                  )}
                >
                  {instrument.currency}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              className="size-8 p-0 text-text-muted hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(instrument);
              }}
              title={t('actions.edit')}
              aria-label={t('actions.edit')}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 p-0 text-text-muted hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(instrument);
              }}
              title={t('actions.delete')}
              aria-label={t('actions.delete')}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>

        {instrument.notes ? (
          <p
            className={clsx(
              'text-xs text-text-muted sm:text-sm',
              'break-words [overflow-wrap:anywhere]',
            )}
          >
            {instrument.notes}
          </p>
        ) : null}
      </div>

      <footer className="border-t border-fg/10 pt-2 text-xs text-text-muted">
        <span>
          {t('createdOn')}: {new Date(instrument.createdAt).toLocaleDateString(language)}
        </span>
      </footer>
    </InvestmentCard>
  );
};
