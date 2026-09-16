import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  INVESTMENT_OPERATION_KINDS,
  type InvestmentOperationKind,
} from '@transactions/components/transaction-forms';

import {
  COMPACT_FIELD_CLASS_NAME,
  getInvestmentOperationKindSelectItemClassName,
  getInvestmentOperationKindSelectValueClassName,
} from './consts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type InvestmentOperationKindSelectProps = {
  value: InvestmentOperationKind;
  onChange: (value: InvestmentOperationKind) => void;
  index: number;
};

export const InvestmentOperationKindSelect = ({
  value,
  onChange,
  index,
}: InvestmentOperationKindSelectProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as InvestmentOperationKind)}
    >
      <SelectTrigger
        aria-label={t('investmentOperationKind')}
        className={clsx(
          COMPACT_FIELD_CLASS_NAME,
          getInvestmentOperationKindSelectValueClassName(value),
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {INVESTMENT_OPERATION_KINDS.map((operationKind) => (
          <SelectItem
            key={`${index}-${operationKind}`}
            value={operationKind}
            className={getInvestmentOperationKindSelectItemClassName(operationKind)}
          >
            {t(`operationKind.${operationKind}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
