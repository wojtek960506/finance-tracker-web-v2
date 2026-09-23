import {
  Activity,
  Coins,
  Flame,
  Landmark,
  Layers,
  Lock,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Umbrella,
  Wallet,
} from 'lucide-react';
import type { ElementType } from 'react';

import type { NetWorthCategory } from './api';

export const NET_WORTH_DEFAULT_CURRENCIES = ['PLN', 'USD', 'EUR', 'GBP', 'CHF'] as const;

export type CategoryStyle = {
  icon: ElementType;
  colorClass: string;
  bgClass: string;
  progressClass: string;
};

export const NET_WORTH_CATEGORY_STYLES: Record<NetWorthCategory, CategoryStyle> = {
  cash: {
    icon: Landmark,
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    progressClass: 'bg-emerald-500',
  },
  share: {
    icon: TrendingUp,
    colorClass: 'text-sky-500',
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
    progressClass: 'bg-sky-500',
  },
  fund: {
    icon: Layers,
    colorClass: 'text-indigo-500',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    progressClass: 'bg-indigo-500',
  },
  termDeposit: {
    icon: Lock,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    progressClass: 'bg-amber-500',
  },
  savings: {
    icon: PiggyBank,
    colorClass: 'text-pink-600',
    bgClass: 'bg-pink-600/10 dark:bg-pink-600/20',
    progressClass: 'bg-pink-600',
  },
};

export const FALLBACK_CATEGORY_STYLE: CategoryStyle = {
  icon: Coins,
  colorClass: 'text-neutral-500',
  bgClass: 'bg-neutral-500/10 dark:bg-neutral-500/20',
  progressClass: 'bg-neutral-500',
};

export const INDEPENDENCE_PERIOD_OPTIONS = [3, 6, 12, 24, 36] as const;
export type IndependencePeriodOption = (typeof INDEPENDENCE_PERIOD_OPTIONS)[number];

export type SummaryCardVariant = 'total' | 'liquid' | 'investments';

export type SummaryCardStyle = {
  icon: ElementType;
  iconClass: string;
  cardClass?: string;
  titleClass?: string;
  valueClass?: string;
  percentageClass?: string;
};

export const NET_WORTH_SUMMARY_CARD_STYLES: Record<SummaryCardVariant, SummaryCardStyle> =
  {
    total: {
      icon: Wallet,
      iconClass: 'text-primary',
      cardClass:
        'border-primary/30 bg-primary/[0.04] dark:border-primary/40 dark:bg-primary/10',
      titleClass: 'text-primary',
      valueClass: 'text-2xl font-black sm:text-3xl',
    },
    liquid: {
      icon: Landmark,
      iconClass: 'text-emerald-500',
      percentageClass: 'text-emerald-600 dark:text-emerald-400',
    },
    investments: {
      icon: TrendingUp,
      iconClass: 'text-sky-500',
      percentageClass: 'text-sky-600 dark:text-sky-400',
    },
  };

export type IndependenceCardVariant =
  | 'horizon'
  | 'zeroIncome'
  | 'liquidBuffer'
  | 'burnRate';

export type IndependenceCardStyle = {
  icon: ElementType;
  iconClass: string;
  titleClass: string;
  cardClass?: string;
  valueClass?: string;
  unitClass?: string;
  secondaryValueClass?: string;
};

export const NET_WORTH_INDEPENDENCE_CARD_STYLES: Record<
  IndependenceCardVariant,
  IndependenceCardStyle
> = {
  horizon: {
    icon: ShieldCheck,
    iconClass: 'text-emerald-500',
    titleClass: 'text-emerald-600 dark:text-emerald-400',
    cardClass:
      'border-emerald-500/30 bg-emerald-500/[0.04] dark:border-emerald-500/40 dark:bg-emerald-500/10',
  },
  zeroIncome: {
    icon: Activity,
    iconClass: 'text-rose-500',
    titleClass: 'text-rose-600 dark:text-rose-400',
  },
  liquidBuffer: {
    icon: Umbrella,
    iconClass: 'text-sky-500',
    titleClass: 'text-sky-600 dark:text-sky-400',
  },
  burnRate: {
    icon: Flame,
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-600 dark:text-amber-400',
    valueClass: 'text-xl font-bold tracking-tight text-foreground sm:text-2xl',
    unitClass: 'text-xs font-normal text-text-muted sm:text-sm',
    secondaryValueClass: 'text-xs font-medium text-foreground/80 sm:text-sm',
  },
};
