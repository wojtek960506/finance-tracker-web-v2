import clsx from 'clsx';
import {
  ArrowRightLeft,
  DollarSign,
  Euro,
  JapaneseYen,
  PoundSterling,
  Wallet,
} from 'lucide-react';
import type { ComponentProps, ComponentType } from 'react';

import type { TransactionKind } from '@transactions/consts';

type TransactionKindIconVariant = 'default' | 'compact' | 'feature';

type TransactionKindIconProps = {
  kind: TransactionKind;
  className?: string;
  variant?: TransactionKindIconVariant;
  'aria-hidden'?: boolean;
};

type TransactionKindCardIconProps = {
  className?: string;
  variant?: TransactionKindIconVariant;
  'aria-hidden'?: boolean;
};

const ExchangeCurrenciesIcon = ({
  className,
  variant = 'default',
  'aria-hidden': ariaHidden,
}: Pick<ComponentProps<'span'>, 'className'> & {
  variant?: TransactionKindIconVariant;
  'aria-hidden'?: boolean;
}) => (
  <span
    className={clsx(
      'grid shrink-0 grid-cols-2 grid-rows-2 place-items-center',
      variant === 'compact'
        ? 'size-4 gap-1.75'
        : variant === 'feature'
          ? 'size-6 gap-4'
          : 'size-5 gap-3',
      className,
    )}
    aria-hidden={ariaHidden}
  >
    <DollarSign
      className={
        variant === 'compact'
          ? 'size-3.25'
          : variant === 'feature'
            ? 'size-5.5'
            : 'size-4'
      }
    />
    <Euro
      className={
        variant === 'compact'
          ? 'size-3.25'
          : variant === 'feature'
            ? 'size-5.5'
            : 'size-4'
      }
    />
    <PoundSterling
      className={
        variant === 'compact'
          ? 'size-3.25'
          : variant === 'feature'
            ? 'size-5.5'
            : 'size-4'
      }
    />
    <JapaneseYen
      className={
        variant === 'compact'
          ? 'size-3.25'
          : variant === 'feature'
            ? 'size-5.5'
            : 'size-4'
      }
    />
  </span>
);

const transactionKindIcons: Record<
  TransactionKind,
  ComponentType<TransactionKindCardIconProps>
> = {
  standard: Wallet,
  transfer: ArrowRightLeft,
  exchange: ExchangeCurrenciesIcon,
};

export const TransactionKindIcon = ({
  kind,
  className,
  variant = 'default',
  'aria-hidden': ariaHidden,
}: TransactionKindIconProps) => {
  const Icon = transactionKindIcons[kind];

  return <Icon className={className} variant={variant} aria-hidden={ariaHidden} />;
};
