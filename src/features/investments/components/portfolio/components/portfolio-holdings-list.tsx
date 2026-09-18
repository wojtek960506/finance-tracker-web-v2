import clsx from 'clsx';
import { ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import type { InvestmentInstrumentSummary } from '@features/investments/api';
import { InstrumentKindBadge } from '@features/investments/components/instruments/instrument-kind-badge';
import { InvestmentCard } from '@features/investments/components/shared';
import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';

type PortfolioHoldingsListProps = {
  instruments: InvestmentInstrumentSummary[];
};

export const PortfolioHoldingsList = ({ instruments }: PortfolioHoldingsListProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();
  const navigate = useNavigate();

  if (instruments.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            {t('portfolio.holdingsTitle')}
          </h2>
          <p className="text-xs text-text-muted sm:text-sm">
            {t('portfolio.holdingsDescription')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {instruments.map((instrument) => {
          const isPositive = instrument.pnl >= 0;
          const formattedCurrent = formatCurrencyAmount(
            instrument.currentValue,
            instrument.currency,
            language,
          );
          const formattedInvested = formatCurrencyAmount(
            instrument.netInvested,
            instrument.currency,
            language,
          );
          const formattedPnL = formatCurrencyAmount(
            instrument.pnl,
            instrument.currency,
            language,
          );

          return (
            <InvestmentCard
              key={instrument.id}
              testId="portfolio-holding-card"
              className="group cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => navigate(`/investments/instruments/${instrument.id}`)}
            >
              <div className="flex flex-col gap-3">
                {/* Header: Name and Kind */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3
                      className={clsx(
                        'text-base font-semibold tracking-tight text-foreground',
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
                      <InstrumentKindBadge kind={instrument.kind} />
                      <span
                        className={clsx(
                          'inline-flex items-center rounded-md border border-fg/10 bg-bg',
                          'px-2 py-0.5 text-xs font-medium text-text-muted',
                        )}
                      >
                        {instrument.currency}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="size-5 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 border-t border-fg/10 pt-2 text-xs">
                  <div>
                    <span className="text-text-muted">
                      {t('details.currentValuation')}
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {formattedCurrent}
                    </p>
                  </div>

                  <div>
                    <span className="text-text-muted">{t('details.netInvested')}</span>
                    <p className="text-sm font-semibold text-text-muted">
                      {formattedInvested}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between border-t border-fg/5 pt-1.5">
                    <span className="text-text-muted">{t('details.totalProfit')}</span>
                    <div className="flex items-center gap-1 text-right">
                      {isPositive ? (
                        <ArrowUpRight className="size-3.5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="size-3.5 text-rose-500" />
                      )}
                      <span
                        className={clsx(
                          'font-bold',
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400',
                        )}
                      >
                        {formattedPnL} ({isPositive ? '+' : ''}
                        {instrument.roiPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer notes / snapshots */}
                <footer className="flex items-center justify-between border-t border-fg/10 pt-2 text-xs text-text-muted">
                  <span>
                    {instrument.lastSnapshotDate
                      ? `${t('details.lastSnapshotOn')}: ${new Date(
                          instrument.lastSnapshotDate,
                        ).toLocaleDateString(language)}`
                      : t('details.noValuationRecorded')}
                  </span>
                  <span>
                    {instrument.operationsCount}{' '}
                    {t('details.totalOperations').toLowerCase()}
                  </span>
                </footer>
              </div>
            </InvestmentCard>
          );
        })}
      </div>
    </div>
  );
};
