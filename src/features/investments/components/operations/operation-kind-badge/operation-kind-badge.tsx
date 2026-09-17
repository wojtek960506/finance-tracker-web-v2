import clsx from 'clsx';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  Coins,
  Receipt,
  Sparkles,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import type { InvestmentOperationKind } from '@features/investments/api';

type OperationKindBadgeProps = {
  kind: InvestmentOperationKind | string;
  className?: string;
};

const kindIcons: Record<string, ComponentType<{ className?: string }>> = {
  snapshot: Camera,
  buy: ArrowDownLeft,
  sell: ArrowUpRight,
  interest: Coins,
  fee: Receipt,
};

const kindStyles: Record<string, string> = {
  snapshot: clsx('bg-sky-500/10 text-sky-600 dark:text-sky-400', 'border-sky-500/20'),
  buy: clsx(
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'border-emerald-500/20',
  ),
  sell: clsx(
    'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'border-purple-500/20',
  ),
  interest: clsx(
    'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'border-amber-500/20',
  ),
  fee: clsx('bg-rose-500/10 text-rose-600 dark:text-rose-400', 'border-rose-500/20'),
};

export const OperationKindBadge = ({ kind, className }: OperationKindBadgeProps) => {
  const { t } = useTranslation('investments');
  const Icon = kindIcons[kind] ?? Sparkles;
  const style =
    kindStyles[kind] ??
    'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border',
        'px-2.5 py-0.5 text-xs font-semibold tracking-wide capitalize transition-colors',
        style,
        className,
      )}
      data-testid="operation-kind-badge"
    >
      <Icon className="size-3.5" />
      <span>{t(`operationKind.${kind}`)}</span>
    </span>
  );
};
