import { ArrowRightLeft, Euro, Rows3, Wallet } from 'lucide-react';
import type { ComponentType } from 'react';

import type { TransactionKind } from '@transactions/consts';

type TransactionKindIconProps = {
  kind: TransactionKind | 'bulk';
  className?: string;
  'aria-hidden'?: boolean;
};

type TransactionKindCardIconProps = {
  className?: string;
  'aria-hidden'?: boolean;
};

const transactionKindIcons: Record<
  TransactionKind | 'bulk',
  ComponentType<TransactionKindCardIconProps>
> = {
  standard: Wallet,
  transfer: ArrowRightLeft,
  exchange: Euro,
  bulk: Rows3,
};

export const TransactionKindIcon = ({
  kind,
  className,
  'aria-hidden': ariaHidden,
}: TransactionKindIconProps) => {
  const Icon = transactionKindIcons[kind];

  return <Icon className={className} aria-hidden={ariaHidden} />;
};
