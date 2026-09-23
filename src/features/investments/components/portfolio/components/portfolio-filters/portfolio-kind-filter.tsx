import clsx from 'clsx';
import { CandlestickChart, Layers, PieChart, PiggyBank, Vault } from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { INSTRUMENT_KINDS } from '@features/investments/consts';

const kindIcons: Record<string, ComponentType<{ className?: string }>> = {
  share: CandlestickChart,
  fund: PieChart,
  termDeposit: Vault,
  savings: PiggyBank,
};

type PortfolioKindFilterProps = {
  selectedKind: string;
  onSelectKind: (kind: string) => void;
  className?: string;
};

export const PortfolioKindFilter = ({
  selectedKind,
  onSelectKind,
  className,
}: PortfolioKindFilterProps) => {
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

      {INSTRUMENT_KINDS.map((kind) => {
        const Icon = kindIcons[kind] ?? Layers;
        const isSelected = selectedKind === kind;

        return (
          <button
            key={kind}
            type="button"
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1',
              'text-xs font-semibold capitalize transition-colors',
              isSelected
                ? 'border-primary/40 bg-primary/20 text-primary shadow-sm'
                : 'border-fg/10 bg-muted/30 text-text-muted hover:bg-muted hover:text-foreground',
            )}
            onClick={() => onSelectKind(kind)}
          >
            <Icon className="size-3.5" />
            <span>{t(`kind.${kind}`)}</span>
          </button>
        );
      })}
    </div>
  );
};
