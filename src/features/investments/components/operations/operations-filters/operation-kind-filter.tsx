import clsx from 'clsx';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  Coins,
  Layers,
  Receipt,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { OPERATION_KINDS } from '@features/investments/consts';

const kindIcons: Record<string, ComponentType<{ className?: string }>> = {
  snapshot: Camera,
  buy: ArrowDownLeft,
  sell: ArrowUpRight,
  interest: Coins,
  fee: Receipt,
};

const kindSelectedStyles: Record<string, string> = {
  snapshot: clsx(
    'border-purple-500/40 bg-purple-500/20 text-purple-700',
    'dark:text-purple-300 shadow-sm',
  ),
  buy: clsx(
    'border-blue-500/40 bg-blue-500/20 text-blue-700',
    'dark:text-blue-300 shadow-sm',
  ),
  sell: clsx(
    'border-amber-500/40 bg-amber-500/20 text-amber-700',
    'dark:text-amber-300 shadow-sm',
  ),
  interest: clsx(
    'border-emerald-500/40 bg-emerald-500/20 text-emerald-700',
    'dark:text-emerald-300 shadow-sm',
  ),
  fee: clsx(
    'border-rose-500/40 bg-rose-500/20 text-rose-700',
    'dark:text-rose-300 shadow-sm',
  ),
};

const unselectedPillStyle =
  'border-fg/10 bg-muted/30 text-text-muted hover:bg-muted hover:text-foreground';

type OperationKindFilterProps = {
  selectedKind: string;
  onSelectKind: (kind: string) => void;
  className?: string;
};

// TODO maybe try to create common component to handle also `portfolio kind` filter
export const OperationKindFilter = ({
  selectedKind,
  onSelectKind,
  className,
}: OperationKindFilterProps) => {
  const { t } = useTranslation('investments');

  return (
    <div className={clsx('flex flex-wrap items-center gap-1.5', className)}>
      <button
        type="button"
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
          'transition-colors',
          selectedKind === 'all'
            ? 'bg-bt-primary text-bt-primary-fg shadow-sm'
            : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
        )}
        onClick={() => onSelectKind('all')}
      >
        <Layers className="size-3.5" />
        <span>{t('allKinds')}</span>
      </button>

      {OPERATION_KINDS.map((kind) => {
        const Icon = kindIcons[kind] ?? Layers;
        const isSelected = selectedKind === kind;
        const selectedStyle =
          kindSelectedStyles[kind] ??
          'border-primary/40 bg-primary/20 text-primary shadow-sm';

        return (
          <button
            key={kind}
            type="button"
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1',
              'text-xs font-semibold capitalize transition-colors',
              isSelected ? selectedStyle : unselectedPillStyle,
            )}
            onClick={() => onSelectKind(kind)}
          >
            <Icon className="size-3.5" />
            <span>{t(`operationKind.${kind}`)}</span>
          </button>
        );
      })}
    </div>
  );
};
