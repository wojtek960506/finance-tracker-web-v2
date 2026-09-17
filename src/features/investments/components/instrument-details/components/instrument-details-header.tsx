import clsx from 'clsx';
import { ArrowLeft, Camera, Pencil, Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { InstrumentKindBadge } from '@features/investments/components/instruments/instrument-kind-badge';
import { useLanguage } from '@shared/hooks';
import { Button, getButtonClassName } from '@shared/ui';

import { useInstrumentDetailsContext } from '../context';

export const InstrumentDetailsHeader = () => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();
  const {
    instrument,
    openCreateSnapshotModal,
    openUpdateInstrumentModal,
    openDeleteInstrumentModal,
  } = useInstrumentDetailsContext();

  return (
    <header className="flex flex-col gap-4 border-b border-fg/10 pb-4">
      {/* Back button */}
      <div>
        <Link
          to="/investments/instruments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t('details.backToInstruments')}</span>
        </Link>
      </div>

      {/* Main header row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {instrument.name}
            </h1>
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

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span>
              {t('createdOn')}:{' '}
              {new Date(instrument.createdAt).toLocaleDateString(language)}
            </span>
            {instrument.notes ? (
              <>
                <span>•</span>
                <span className="italic">{instrument.notes}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end lg:justify-start">
          <Button
            type="button"
            variant="primary"
            onClick={openCreateSnapshotModal}
            className="flex items-center gap-1.5"
          >
            <Camera className="size-5 sm:size-6" />
            <span>{t('operations.recordSnapshot')}</span>
          </Button>

          <Link
            to={`/transactions/new/investment?instrumentId=${instrument.id}`}
            className={getButtonClassName({
              variant: 'outline',
              className: 'flex items-center gap-1.5',
            })}
          >
            <Plus className="size-5 sm:size-6" />
            <span>{t('operations.newInvestmentTransaction')}</span>
          </Link>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={openUpdateInstrumentModal}
            title={t('actions.edit')}
            aria-label={t('actions.edit')}
          >
            <Pencil />
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={openDeleteInstrumentModal}
            title={t('actions.delete')}
            aria-label={t('actions.delete')}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </header>
  );
};
