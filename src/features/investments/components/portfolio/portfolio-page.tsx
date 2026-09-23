import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateInstrumentModal } from '@features/investments/components/instruments';
import { InvestmentsLayout } from '@features/investments/components/investments-layout';
import { Button, LoadingCard } from '@shared/ui';

import {
  PortfolioCurrencyPills,
  PortfolioEmptyState,
  PortfolioHoldingsList,
  PortfolioSummaryMetrics,
} from './components';
import { usePortfolio } from './hooks';

export const PortfolioPage = () => {
  const { t } = useTranslation('investments');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    currencies,
    activeCurrency,
    setActiveCurrency,
    currentCurrencySummary,
    instruments,
    hasHoldings,
    isLoading,
    error,
  } = usePortfolio();

  return (
    <InvestmentsLayout>
      <div className="flex flex-col gap-4 p-1" data-testid="portfolio-page">
        {isLoading && (
          <LoadingCard
            title={t('portfolio.loadingTitle')}
            description={t('portfolio.loadingDescription')}
            widthClassName="max-w-[35rem]"
          />
        )}

        {error && <p className="p-4 text-sm text-destructive">{error.message}</p>}

        {!isLoading && !error && !hasHoldings && (
          <PortfolioEmptyState onCreateInstrument={() => setIsCreateModalOpen(true)} />
        )}

        {!isLoading && !error && hasHoldings && (
          <>
            {/* Header with Title and Quick Add Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {t('portfolio.title')}
                </h1>
                <p className="text-xs text-text-muted sm:text-sm">
                  {t('portfolio.description')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-1.5 shrink-0 whitespace-nowrap"
                >
                  <Plus className="size-4" />
                  <span>{t('newInstrument')}</span>
                </Button>
              </div>
            </div>

            {/* Currency Filter / Selector */}
            <PortfolioCurrencyPills
              currencies={currencies}
              activeCurrency={activeCurrency}
              onSelectCurrency={setActiveCurrency}
            />

            {/* Top Multi-Currency Summary Cards */}
            {currentCurrencySummary && (
              <PortfolioSummaryMetrics summary={currentCurrencySummary} />
            )}

            {/* Holdings breakdown */}
            <PortfolioHoldingsList instruments={instruments} />
          </>
        )}

        <CreateInstrumentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </InvestmentsLayout>
  );
};
