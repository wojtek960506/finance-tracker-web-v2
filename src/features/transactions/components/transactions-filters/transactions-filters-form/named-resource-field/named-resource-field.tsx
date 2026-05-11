import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NAMED_RESOURCE, type NamedResourceKind } from '@named-resources/api';
import { Label } from '@shared/ui';
import { capitalize } from '@shared/utils';
import { NamedResourceSelectField } from '@transactions/components/shared';

import type { TransactionFiltersFormValues } from '../utils';

type NamedResourceFieldProps = {
  name: 'paymentMethodId' | 'accountId';
  kind: Exclude<NamedResourceKind, 'categories'>;
};

export const NamedResourceField = ({ name, kind }: NamedResourceFieldProps) => {
  const { control } = useFormContext<TransactionFiltersFormValues>();
  const { t } = useTranslation('transactions');
  const resourceKeyBase = NAMED_RESOURCE[kind];
  const resourceKeyBaseSuffix = capitalize(resourceKeyBase);

  return (
    <Label>
      <span className="text-sm font-semibold">{t(resourceKeyBase)}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NamedResourceSelectField
            kind={kind}
            value={field.value}
            onChange={field.onChange}
            placeholder={t(`${resourceKeyBase}Placeholder`)}
            clearable
            clearLabel={t(`clear${resourceKeyBaseSuffix}Filter`)}
          />
        )}
      />
    </Label>
  );
};
