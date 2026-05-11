import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  type NamedResourceKind,
} from '@named-resources/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';

import {
  Select,
  SelectContent,
  SelectControl,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type NamedResourceSelectFieldProps = {
  kind: NamedResourceKind;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearable?: boolean;
  clearLabel?: string;
  includeSystem?: boolean;
};

const getFavoriteIcon = () => <Star className="size-4 fill-current" aria-hidden="true" />;
const ALL_RESOURCES_LABEL_KEY: Record<NamedResourceKind, string> = {
  categories: 'allCategories',
  paymentMethods: 'allPaymentMethods',
  accounts: 'allAccounts',
};

// TODO split this component
export const NamedResourceSelectField = ({
  kind,
  value,
  onChange,
  placeholder,
  clearable = false,
  clearLabel,
  includeSystem = kind !== 'categories',
}: NamedResourceSelectFieldProps) => {
  const { t: tNamedResources } = useTranslation('namedResources');

  const { data = [], isLoading } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });

  const availableResources = useMemo(
    () => data.filter((resource) => (includeSystem ? true : resource.type !== 'system')),
    [data, includeSystem],
  );

  const favoriteResources = useMemo(
    () => availableResources.filter((resource) => resource.isFavorite),
    [availableResources],
  );
  const otherResources = useMemo(
    () => availableResources.filter((resource) => !resource.isFavorite),
    [availableResources],
  );

  return (
    <SelectControl
      clearable={clearable}
      hasValue={Boolean(value)}
      clearLabel={clearLabel}
      onClear={() => onChange('')}
    >
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger showChevron={!clearable} className={clearable ? 'w-full pr-20' : 'w-full'}>
          <SelectValue
            placeholder={isLoading ? tNamedResources('loadingResources') : placeholder}
          />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-56">
          {favoriteResources.length > 0 ? (
            <SelectGroup>
              <SelectLabel>{tNamedResources('favorites')}</SelectLabel>
              {favoriteResources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {getTransactionNamedResourceLabel(resource, tNamedResources)}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : null}

          {otherResources.length > 0 ? (
            <SelectGroup>
              {favoriteResources.length > 0 ? (
                <SelectLabel>{tNamedResources(ALL_RESOURCES_LABEL_KEY[kind])}</SelectLabel>
              ) : null}
              {otherResources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {getTransactionNamedResourceLabel(resource, tNamedResources)}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : null}
        </SelectContent>
      </Select>
    </SelectControl>
  );
};
