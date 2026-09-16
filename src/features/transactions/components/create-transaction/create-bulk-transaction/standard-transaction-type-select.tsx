import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  type StandardTransactionFormValues,
  standardTransactionTypeOptions,
} from '@transactions/components/transaction-forms';
import {
  getTransactionTypeSelectItemClassName,
  getTransactionTypeSelectValueClassName,
} from '@transactions/utils';

import { COMPACT_FIELD_CLASS_NAME } from './consts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type StandardTransactionTypeSelectProps = {
  value: StandardTransactionFormValues['transactionType'];
  onChange: (value: StandardTransactionFormValues['transactionType']) => void;
  index: number;
};

export const StandardTransactionTypeSelect = ({
  value,
  onChange,
  index,
}: StandardTransactionTypeSelectProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Select
      value={value}
      onValueChange={(val) =>
        onChange(val as StandardTransactionFormValues['transactionType'])
      }
    >
      <SelectTrigger
        aria-label={t('transactionType')}
        className={clsx(
          COMPACT_FIELD_CLASS_NAME,
          getTransactionTypeSelectValueClassName(value),
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {standardTransactionTypeOptions.map((transactionType) => (
          <SelectItem
            key={`${index}-${transactionType}`}
            value={transactionType}
            className={getTransactionTypeSelectItemClassName(transactionType)}
          >
            {t(transactionType)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
