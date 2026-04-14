import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  type INamedResource,
  type NamedResourceKind,
} from '@named-resources/api';
import {
  Button,
  SearchableSelect,
  type SearchableSelectGroup,
  type SearchableSelectOption,
} from '@shared/ui';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';

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

export const NamedResourceFilterSelectField = ({
  kind,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  showMoreLabel,
  showLessLabel,
  clearLabel,
  includeSystem = true,
}: NamedResourceFilterSelectFieldProps) => {
  const [showMore, setShowMore] = useState(false);
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

  const groups = useMemo<SearchableSelectGroup[]>(() => {
    const favoritesGroup =
      favoriteResources.length > 0
        ? [
            {
              key: 'favorites',
              label: tNamedResources('favorites'),
              options: favoriteResources.map((resource) =>
                mapResourceToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    const othersGroup =
      (favoriteResources.length === 0 || showMore) && otherResources.length > 0
        ? [
            {
              key: 'others',
              label:
                favoriteResources.length > 0
                  ? tNamedResources(ALL_RESOURCES_LABEL_KEY[kind])
                  : undefined,
              options: otherResources.map((resource) =>
                mapResourceToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    return [...favoritesGroup, ...othersGroup];
  }, [favoriteResources, kind, otherResources, showMore, tNamedResources]);

  const selectedOption = useMemo(() => {
    const selectedResource = availableResources.find((resource) => resource.id === value);

    return selectedResource
      ? mapResourceToOption(selectedResource, tNamedResources)
      : undefined;
  }, [availableResources, tNamedResources, value]);

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      groups={groups}
      selectedOption={selectedOption}
      placeholder={isLoading ? tNamedResources('loadingResources') : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={isLoading}
      footer={
        <div className="flex flex-col gap-2 border-t border-fg/20 pt-3">
          {favoriteResources.length > 0 && otherResources.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="justify-start"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setShowMore((prev) => !prev);
              }}
            >
              {showMore ? showLessLabel : showMoreLabel}
            </Button>
          )}

          {value ? (
            <Button
              type="button"
              variant="ghost"
              className="justify-start"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onChange('');
              }}
            >
              {clearLabel}
            </Button>
          ) : null}
        </div>
      }
    />
  );
};
