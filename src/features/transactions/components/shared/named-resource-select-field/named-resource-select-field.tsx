import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  type INamedResource,
  type NamedResourceKind,
} from '@named-resources/api';
import { getFavoriteIcon } from '@transactions/components/shared';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';

import {
  Select,
  SelectContent,
  SelectControl,
  SelectGroup,
  SelectItem,
  SelectSeparator,
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
  excludedSystemNames?: string[];
};

const renderResourceOption = (
  resource: INamedResource,
  tNamedResources: (key: string) => string,
) => (
  <span className="flex min-w-0 items-center gap-2">
    {resource.isFavorite ? (
      <span className="shrink-0 text-text-muted">{getFavoriteIcon()}</span>
    ) : null}
    <span className="truncate">
      {getTransactionNamedResourceLabel(resource, tNamedResources)}
    </span>
  </span>
);

// TODO split this component
export const NamedResourceSelectField = ({
  kind,
  value,
  onChange,
  placeholder,
  clearable = false,
  clearLabel,
  includeSystem = kind !== 'categories',
  excludedSystemNames = [],
}: NamedResourceSelectFieldProps) => {
  const { t: tNamedResources, i18n } = useTranslation('namedResources');

  const { data = [], isLoading } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });
  const collator = useMemo(
    () =>
      new Intl.Collator(i18n.language, {
        sensitivity: 'base',
        numeric: true,
      }),
    [i18n.language],
  );

  const availableResources = useMemo(
    () =>
      data.filter((resource) => {
        if (resource.type !== 'system') {
          return true;
        }

        if (!includeSystem) {
          return false;
        }

        return !excludedSystemNames.includes(resource.name);
      }),
    [data, excludedSystemNames, includeSystem],
  );
  const sortResourcesByDisplayLabel = useMemo(
    () => (resources: INamedResource[]) =>
      [...resources].sort((left, right) =>
        collator.compare(
          getTransactionNamedResourceLabel(left, tNamedResources),
          getTransactionNamedResourceLabel(right, tNamedResources),
        ),
      ),
    [collator, tNamedResources],
  );

  const favoriteResources = useMemo(
    () => sortResourcesByDisplayLabel(availableResources.filter((resource) => resource.isFavorite)),
    [availableResources, sortResourcesByDisplayLabel],
  );
  const otherResources = useMemo(
    () =>
      sortResourcesByDisplayLabel(availableResources.filter((resource) => !resource.isFavorite)),
    [availableResources, sortResourcesByDisplayLabel],
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
              {favoriteResources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {renderResourceOption(resource, tNamedResources)}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : null}

          {otherResources.length > 0 ? (
            <>
              {favoriteResources.length > 0 ? <SelectSeparator /> : null}
              <SelectGroup>
                {otherResources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {renderResourceOption(resource, tNamedResources)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          ) : null}
        </SelectContent>
      </Select>
    </SelectControl>
  );
};
