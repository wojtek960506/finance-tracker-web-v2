import { type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';

import {
  bulkTransactionKinds,
  COMPACT_FIELD_CLASS_NAME,
  COMPACT_LABEL_CLASS_NAME,
  getBulkLabelClassName,
  INLINE_KIND_FIELD_CLASS_NAME,
} from './consts';
import type { BulkTransactionKind, BulkTransactionKindValue } from './types';
import { getBulkKindTranslationKey } from './utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type BulkTransactionKindFieldProps = {
  index: number;
  kind: BulkTransactionKindValue;
  showLabel: boolean;
  triggerRef: Ref<HTMLButtonElement>;
  setKind: (kind: BulkTransactionKind) => void;
};

export const BulkTransactionKindField = ({
  index,
  kind,
  showLabel,
  triggerRef,
  setKind,
}: BulkTransactionKindFieldProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Label className={`${COMPACT_LABEL_CLASS_NAME} ${INLINE_KIND_FIELD_CLASS_NAME}`}>
      <span className={getBulkLabelClassName(showLabel, true)}>
        {t('transactionKind')}
      </span>
      <Select
        value={kind}
        onValueChange={(value) => setKind(value as BulkTransactionKind)}
      >
        <SelectTrigger
          aria-label={t('transactionKind')}
          className={COMPACT_FIELD_CLASS_NAME}
          ref={triggerRef}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {bulkTransactionKinds.map((transactionKind) => (
            <SelectItem key={`${index}-${transactionKind}`} value={transactionKind}>
              {t(getBulkKindTranslationKey(transactionKind))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
};
