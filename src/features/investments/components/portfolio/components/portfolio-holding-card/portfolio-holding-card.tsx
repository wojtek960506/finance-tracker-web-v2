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
        'group row-span-3 grid w-full grid-cols-1 grid-rows-subgrid',
        'cursor-pointer gap-2.5 transition-colors',
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
      {/* Row 1: Title and Chevron */}
      <div className="flex w-full items-start justify-between gap-2">
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

        <ChevronRight
          className={clsx(
            'size-5 shrink-0 text-text-muted transition-transform',
            'group-hover:translate-x-0.5 group-hover:text-foreground',
          )}
        />
      </div>

      {/* Row 2: Badges */}
      <div className="flex w-full flex-wrap items-center gap-1.5">
        <InstrumentStatusBadge isClosed={isClosed} />
        <InstrumentKindBadge kind={instrument.kind} />
      </div>

      {/* Row 3: Metrics Grid */}
      <div className="grid w-full grid-cols-2 gap-2 border-t border-fg/10 pt-2 text-sm">
        <div className="col-span-2 flex items-center justify-between">
          <span className="text-text-muted text-xs sm:text-sm">
            {t('portfolio.result')}
          </span>
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

        <span className="text-text-muted text-xs sm:text-sm">
          {t('portfolio.invested')}
        </span>
        <p className="text-right text-sm font-semibold text-text-muted">
          {formattedInvested}
        </p>
      </div>
    </InvestmentCard>
  );
};
