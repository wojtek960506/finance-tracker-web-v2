import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import type { NamedResourceKind } from '@named-resources/api';

import { NamedResourceFilterSelectField } from '../../named-resource-filter-select-field';
import type { TransactionFiltersFormValues } from '../utils';

type NamedResourceFieldCopy = {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  showMoreLabel: string;
  showLessLabel: string;
  clearLabel: string;
};

type NamedResourceFieldProps = {
  name: 'paymentMethodId' | 'accountId';
  kind: NamedResourceKind;
  copy: NamedResourceFieldCopy;
};

export const NamedResourceField = ({
  name,
  kind,
  copy,
}: NamedResourceFieldProps) => {
  const { control } = useFormContext<TransactionFiltersFormValues>();
  const { t } = useTranslation('transactions');

  return (
    <Label>
      <span className="text-sm font-semibold">{t(copy.label)}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NamedResourceFilterSelectField
            kind={kind}
            value={field.value}
            onChange={field.onChange}
            placeholder={t(copy.placeholder)}
            searchPlaceholder={t(copy.searchPlaceholder)}
            emptyMessage={t(copy.emptyMessage)}
            showMoreLabel={t(copy.showMoreLabel)}
            showLessLabel={t(copy.showLessLabel)}
            clearLabel={t(copy.clearLabel)}
          />
        )}
      />
    </Label>
  );
};
