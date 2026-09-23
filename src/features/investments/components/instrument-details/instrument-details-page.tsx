import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card, LoadingCard } from '@shared/ui';

import {
  InstrumentDetailsHeader,
  InstrumentDetailsModals,
  InstrumentOperationsLedger,
  InstrumentSummaryMetrics,
} from './components';
import { InstrumentDetailsProvider } from './context';
import { useInstrumentDetails } from './hooks';

export const InstrumentDetailsPage = () => {
  const { t } = useTranslation('investments');
  const { isLoading, error, instrument, contextValue } = useInstrumentDetails();

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4 p-2 sm:p-4">
        <LoadingCard
          title={t('details.loadingTitle')}
          description={t('details.loadingDescription')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (error || !instrument || !contextValue) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4 p-2 sm:p-4">
        <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {t('details.notFoundTitle')}
          </h2>
          <p className="max-w-md text-xs text-text-muted sm:text-sm">
            {t('details.notFoundDescription')}
          </p>
          <Link
            to="/investments/portfolio"
            className={clsx(
              'mt-2 inline-flex items-center gap-1.5 text-xs font-medium',
              'text-primary hover:underline',
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t('details.backToInstruments')}</span>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <InstrumentDetailsProvider value={contextValue}>
      <div
        className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-6 p-2 sm:p-4"
        data-testid="instrument-details-page"
      >
        <InstrumentDetailsHeader />
        <InstrumentSummaryMetrics />
        <InstrumentOperationsLedger />
        <InstrumentDetailsModals />
      </div>
    </InstrumentDetailsProvider>
  );
};
