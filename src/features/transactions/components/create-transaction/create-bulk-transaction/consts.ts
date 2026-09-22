import clsx from 'clsx';

import {
  FIELD_CONTROL_CLASS_NAME,
  type InvestmentOperationKind,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

export const bulkTransactionKinds = [
  'standard',
  'transfer',
  'exchange',
  'investment',
] as const;

export const COMPACT_FIELD_CLASS_NAME = `${FIELD_CONTROL_CLASS_NAME} h-9 text-sm`;
export const COMPACT_LABEL_CLASS_NAME = 'gap-1 text-xs font-medium text-text-muted';
export const INLINE_FIELD_CLASS_NAME = 'w-[10rem] min-w-[10rem] shrink-0';
export const INLINE_KIND_FIELD_CLASS_NAME = 'w-[10rem] min-w-[10rem] shrink-0';
export const INLINE_LABEL_TEXT_CLASS_NAME = 'sr-only';

export const getBulkLabelClassName = (showLabel: boolean, required = false) =>
  showLabel ? (required ? REQUIRED_LABEL_CLASS_NAME : '') : INLINE_LABEL_TEXT_CLASS_NAME;

export const getInvestmentOperationKindSelectValueClassName = (
  kind?: InvestmentOperationKind,
) => {
  switch (kind) {
    case 'buy':
      return 'text-blue-600 dark:text-blue-400 font-semibold';
    case 'sell':
      return 'text-amber-600 dark:text-amber-400 font-semibold';
    default:
      return '';
  }
};

export const getInvestmentOperationKindSelectItemClassName = (
  kind: InvestmentOperationKind,
) => {
  switch (kind) {
    case 'buy':
      return clsx(
        'text-blue-600 dark:text-blue-400',
        'focus:text-blue-600 dark:focus:text-blue-400 font-semibold',
      );
    case 'sell':
      return clsx(
        'text-amber-600 dark:text-amber-400',
        'focus:text-amber-600 dark:focus:text-amber-400 font-semibold',
      );
  }
};
