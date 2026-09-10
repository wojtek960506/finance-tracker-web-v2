import clsx from 'clsx';
import {
  Bitcoin,
  Boxes,
  CandlestickChart,
  FileText,
  Gem,
  Layers,
  PieChart,
  PiggyBank,
  Vault,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import type { InvestmentInstrumentKind } from '@features/investments/api';

type InstrumentKindBadgeProps = {
  kind: InvestmentInstrumentKind | string;
  className?: string;
};

const kindIcons: Record<string, ComponentType<{ className?: string }>> = {
  share: CandlestickChart,
  fund: PieChart,
  termDeposit: Vault,
  savings: PiggyBank,
  bond: FileText,
  crypto: Bitcoin,
  commodity: Gem,
  custom: Boxes,
};

const kindStyles: Record<string, string> = {
  share: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  fund: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  termDeposit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  savings: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  bond: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  crypto: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  commodity: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  custom: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
};

export const InstrumentKindBadge = ({ kind, className }: InstrumentKindBadgeProps) => {
  const { t } = useTranslation('investments');
  const Icon = kindIcons[kind] ?? Layers;
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
      data-testid="instrument-kind-badge"
    >
      <Icon className="size-3.5" />
      <span>{t(`kind.${kind}`, { defaultValue: kind })}</span>
    </span>
  );
};
