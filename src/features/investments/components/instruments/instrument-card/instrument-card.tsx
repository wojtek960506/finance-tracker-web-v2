import clsx from 'clsx';
import { Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrument } from '@features/investments/api';
import { useLanguage } from '@shared/hooks';
import { Button, Card } from '@shared/ui';

import { InstrumentKindBadge } from '../instrument-kind-badge';

type InstrumentCardProps = {
  instrument: InvestmentInstrument;
  onEdit: (instrument: InvestmentInstrument) => void;
  onDelete: (instrument: InvestmentInstrument) => void;
};

export const InstrumentCard = ({ instrument, onEdit, onDelete }: InstrumentCardProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();

  return (
    <Card
      className={clsx(
        'flex flex-col justify-between gap-3 p-4 sm:p-5',
        'transition-all hover:border-fg/30 hover:shadow-sm',
      )}
      data-testid="instrument-card"
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
              {instrument.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
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

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              className="size-8 p-0 text-text-muted hover:text-foreground"
              onClick={() => onEdit(instrument)}
              title={t('actions.edit')}
              aria-label={t('actions.edit')}
            >
              <Edit2 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 p-0 text-text-muted hover:text-destructive"
              onClick={() => onDelete(instrument)}
              title={t('actions.delete')}
              aria-label={t('actions.delete')}
            >
              <Trash2 className="size-4" />
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

      <footer
        className={clsx(
          'flex items-center justify-between border-t border-fg/10 pt-2',
          'text-xs text-text-muted',
        )}
      >
        <span>
          {t('createdOn')}: {new Date(instrument.createdAt).toLocaleDateString(language)}
        </span>
      </footer>
    </Card>
  );
};
