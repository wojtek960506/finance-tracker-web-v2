import clsx from 'clsx';
import { ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import type { InvestmentInstrumentSummary } from '@features/investments/api';
import {
  InstrumentKindBadge,
  InstrumentStatusBadge,
} from '@features/investments/components/instruments';
import { InvestmentCard } from '@features/investments/components/shared';
import { formatCurrencyAmount } from '@features/investments/utils';
import { useLanguage } from '@shared/hooks';

type PortfolioHoldingCardProps = {
  instrument: InvestmentInstrumentSummary;
};

export const PortfolioHoldingCard = ({ instrument }: PortfolioHoldingCardProps) => {
  const { t } = useTranslation('investments');
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isClosed = instrument.currentValue === 0;
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
      <div className="flex flex-col gap-3">
        {/* Header: Name and Badges */}
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
              <InstrumentStatusBadge isClosed={isClosed} />
              <InstrumentKindBadge kind={instrument.kind} />
            </div>
          </div>

          <ChevronRight
            className={clsx(
              'size-5 text-text-muted transition-transform',
              'group-hover:translate-x-0.5 group-hover:text-foreground',
            )}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 border-t border-fg/10 pt-2 text-xs">
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

          <div>
            <span className="text-text-muted">{t('details.currentValuation')}</span>
            <p className="text-sm font-bold text-foreground">{formattedCurrent}</p>
          </div>

          <div>
            <span className="text-text-muted">{t('details.netInvested')}</span>
            <p className="text-sm font-semibold text-text-muted">{formattedInvested}</p>
          </div>
        </div>
      </div>
    </InvestmentCard>
  );
};
