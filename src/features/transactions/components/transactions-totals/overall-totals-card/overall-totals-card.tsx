import clsx from 'clsx';

import { Card } from '@ui';

type OverallTotalsCardVariant = 'total' | 'expense' | 'income';

const overallTotalsCardVariantClasses: Record<
  OverallTotalsCardVariant,
  { card: string; label: string; value: string }
> = {
  total: {
    card: 'border-fg/15 bg-bg/55',
    label: 'text-text-muted',
    value: 'text-text',
  },
  expense: {
    card: 'border-destructive-border bg-destructive/8',
    label: 'text-destructive/80',
    value: 'text-destructive',
  },
  income: {
    card: 'border-bt-primary/25 bg-bt-primary/8',
    label: 'text-bt-primary/80',
    value: 'text-bt-primary',
  },
};

type OverallTotalsCardProps = {
  label: string;
  value: number;
  variant?: OverallTotalsCardVariant;
};

export const OverallTotalsCard = ({
  label,
  value,
  variant = 'total',
}: OverallTotalsCardProps) => {
  const classes = overallTotalsCardVariantClasses[variant];

  return (
    <Card className={clsx(
      'gap-1 rounded-2xl shadow-none flex flex-row justify-between items-center',
      classes.card
    )}>
      <span className={clsx('text-sm', classes.label)}>{label}</span>
      <strong className={clsx('text-2xl font-semibold', classes.value)}>{value}</strong>
    </Card>
  );
};
