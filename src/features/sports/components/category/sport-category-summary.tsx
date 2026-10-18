import clsx from 'clsx';
import { Flame, Link2, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { formatPln } from '../../utils';
import { SportsStatCard } from '../overview';

import type { SportCategorySummaryProps } from './types';

export const SportCategorySummary = ({
  summary,
  isLoading,
  'data-testid': testId = 'sport-category-summary',
}: SportCategorySummaryProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4"
        data-testid={`${testId}-loading`}
      >
        {[0, 1, 2].map((i) => (
          <Card
            key={i}
            className={clsx(
              'relative flex h-24 flex-col justify-between overflow-hidden',
              'p-3.5 sm:p-4 animate-pulse',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-card-border/30" />
              <div className="size-7 sm:size-8 rounded-lg bg-card-border/30" />
            </div>
            <div className="h-6 w-32 rounded bg-card-border/40" />
          </Card>
        ))}
      </div>
    );
  }

  const totalCost = summary?.totalCostPln ?? 0;
  const totalEntries = summary?.totalEntries ?? 0;
  const linkedCost = summary?.linkedCostPln ?? 0;
  const linkedCount = summary?.linkedEntriesCount ?? 0;
  const linkedPercentage = summary?.linkedPercentage ?? 0;

  const linkedSubtext =
    totalEntries > 0
      ? t('stats.linkedRatio', {
          linked: linkedCount,
          total: totalEntries,
          defaultValue: `${linkedCount} of ${totalEntries} linked`,
        })
      : t('stats.linkedRatio', {
          linked: 0,
          total: 0,
          defaultValue: '0 of 0 linked',
        });

  const linkedBadge =
    totalEntries > 0 ? (
      <span
        className={clsx(
          'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold',
          linkedCount === totalEntries
            ? 'bg-emerald-500/15 text-emerald-500'
            : linkedCount > 0
              ? 'bg-blue-500/15 text-blue-500'
              : 'bg-card-border/30 text-text-muted',
        )}
      >
        {linkedPercentage}%
      </span>
    ) : undefined;

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4"
      data-testid={testId}
    >
      <SportsStatCard
        title={t('stats.totalSpending')}
        value={formatPln(totalCost, lang)}
        Icon={Wallet}
        iconClassName="text-emerald-500"
        data-testid="category-summary-total-spent"
      />

      <SportsStatCard
        title={t('stats.totalEntries')}
        value={String(totalEntries)}
        Icon={Flame}
        iconClassName="text-amber-500"
        data-testid="category-summary-total-entries"
      />

      <SportsStatCard
        title={t('stats.linkedSpending')}
        value={formatPln(linkedCost, lang)}
        subtext={linkedSubtext}
        badge={linkedBadge}
        Icon={Link2}
        iconClassName="text-blue-500"
        data-testid="category-summary-linked"
      />
    </div>
  );
};
