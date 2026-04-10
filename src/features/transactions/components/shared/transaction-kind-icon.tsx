import {
  ArrowRightLeft,
  Euro,  
  Wallet,
} from 'lucide-react';
import type { ComponentType } from 'react';

import type { TransactionKind } from '@transactions/consts';

type TransactionKindIconProps = {
  kind: TransactionKind;
  className?: string;
  'aria-hidden'?: boolean;
};

type TransactionKindCardIconProps = {
  className?: string;
  'aria-hidden'?: boolean;
};

const transactionKindIcons: Record<
  TransactionKind,
  ComponentType<TransactionKindCardIconProps>
> = {
  standard: Wallet,
  transfer: ArrowRightLeft,
  exchange: Euro,
};

export const TransactionKindIcon = ({
  kind,
  className,
  'aria-hidden': ariaHidden,
}: TransactionKindIconProps) => {
  const Icon = transactionKindIcons[kind];

  return <Icon className={className}  aria-hidden={ariaHidden} />;
};
