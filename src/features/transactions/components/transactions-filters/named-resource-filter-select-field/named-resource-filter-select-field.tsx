import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  type INamedResource,
  type NamedResourceKind,
} from '@named-resources/api';
import {
  type SearchableSelectOption,
} from '@shared/ui';
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

type NamedResourceFilterSelectFieldProps = {
  kind: NamedResourceKind;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  showMoreLabel: string;
  showLessLabel: string;
  clearLabel: string;
  includeSystem?: boolean;
};

const ALL_RESOURCES_LABEL_KEY: Record<NamedResourceKind, string> = {
  categories: 'allCategories',
  paymentMethods: 'allPaymentMethods',
  accounts: 'allAccounts',
};

const getFavoriteIcon = () => <Star className="size-4 fill-current" aria-hidden="true" />;

const mapResourceToOption = (
  resource: INamedResource,
  tNamedResources: (key: string) => string,
): SearchableSelectOption => ({
  value: resource.id,
  label: getTransactionNamedResourceLabel(resource, tNamedResources),
  searchText:
    resource.type === 'system'
      ? `${resource.name} ${tNamedResources(resource.name)}`
      : resource.name,
  icon: resource.isFavorite ? getFavoriteIcon() : undefined,
});

// TODO split this file to smaller ones
export const NamedResourceFilterSelectField = ({
  kind,
  value,
  onChange,
  placeholder,
  clearLabel,
  includeSystem = true,
}: NamedResourceFilterSelectFieldProps) => {
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
      clearable
      hasValue={Boolean(value)}
      clearLabel={clearLabel}
      onClear={() => onChange('')}
    >
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger showChevron={false} className="w-full pr-20">
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
                  {mapResourceToOption(resource, tNamedResources).label}
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
                  {mapResourceToOption(resource, tNamedResources).label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : null}
        </SelectContent>
      </Select>
    </SelectControl>
  );
};
