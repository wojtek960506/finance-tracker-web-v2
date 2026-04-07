import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Star } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createNamedResource,
  getNamedResources,
  type INamedResource,
  NAMED_RESOURCE,
  type NamedResourceKind,
} from '@named-resources/api';
import { normalizeApiError } from '@shared/api/api-error';
import { Button, Input, SearchableSelect, type SearchableSelectOption } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

type NamedResourceSelectFieldProps = {
  kind: NamedResourceKind;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  showMoreLabel: string;
  showLessLabel: string;
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const getFavoriteIcon = () => <Star className="size-4 fill-current" aria-hidden="true" />;
const ALL_RESOURCES_LABEL_KEY: Record<NamedResourceKind, string> = {
  categories: 'allCategories',
  paymentMethods: 'allPaymentMethods',
  accounts: 'allAccounts',
};

export const NamedResourceSelectField = ({
  kind,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  showMoreLabel,
  showLessLabel,
}: NamedResourceSelectFieldProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');

  const { t: tNamedResources } = useTranslation('namedResources');
  const pushToast = useToastStore((state) => state.pushToast);
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => await createNamedResource(kind, name),
    onSuccess: (createdResource) => {
      queryClient.setQueryData<INamedResource[] | undefined>([kind], (current = []) => [
        ...current,
        createdResource,
      ]);
    },
  });

  const availableResources = useMemo(
    () =>
      data.filter((resource) =>
        kind === 'categories' ? resource.type !== 'system' : true,
      ),
    [data, kind],
  );

  const favoriteResources = useMemo(
    () => availableResources.filter((resource) => resource.isFavorite),
    [availableResources],
  );
  const otherResources = useMemo(
    () => availableResources.filter((resource) => !resource.isFavorite),
    [availableResources],
  );
  const shouldShowAllResources = favoriteResources.length === 0 || showMore;

  const mapResourceToOption = useCallback(
    (resource: INamedResource): SearchableSelectOption => ({
      value: resource.id,
      label: resource.type === 'system' ? tNamedResources(resource.name) : resource.name,
      searchText:
        resource.type === 'system'
          ? `${resource.name} ${tNamedResources(resource.name)}`
          : resource.name,
      icon: resource.isFavorite ? getFavoriteIcon() : undefined,
    }),
    [tNamedResources],
  );

  const selectedOption = useMemo(
    () => availableResources.find((resource) => resource.id === value),
    [availableResources, value],
  );

  const groups = useMemo(() => {
    const favoritesGroup =
      favoriteResources.length > 0
        ? [
            {
              key: 'favorites',
              label: tNamedResources('favorites'),
              options: favoriteResources.map(mapResourceToOption),
            },
          ]
        : [];

    const othersGroup =
      shouldShowAllResources && otherResources.length > 0
        ? [
            {
              key: 'others',
              label:
                favoriteResources.length > 0
                  ? tNamedResources(ALL_RESOURCES_LABEL_KEY[kind])
                  : undefined,
              options: otherResources.map(mapResourceToOption),
            },
          ]
        : [];

    return [...favoritesGroup, ...othersGroup];
  }, [
    favoriteResources,
    kind,
    mapResourceToOption,
    otherResources,
    shouldShowAllResources,
    tNamedResources,
  ]);

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      groups={groups}
      selectedOption={selectedOption ? mapResourceToOption(selectedOption) : undefined}
      placeholder={isLoading ? tNamedResources('loadingResources') : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={isLoading}
      isOpen={isDropdownOpen}
      onOpenChange={(open) => {
        setIsDropdownOpen(open);
        if (open) return;

        setIsCreating(false);
        setNewResourceName('');
      }}
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

          {!isCreating && (
            <Button
              type="button"
              variant="secondary"
              className="justify-start gap-2"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsCreating(true);
              }}
            >
              <Plus className="size-4" />
              {tNamedResources(`new${capitalize(NAMED_RESOURCE[kind])}`)}
            </Button>
          )}

          {isCreating && (
            <div className="flex flex-col gap-2">
              <Input
                value={newResourceName}
                placeholder={tNamedResources(`new${capitalize(NAMED_RESOURCE[kind])}`)}
                onChange={(event) => setNewResourceName(event.target.value)}
                disabled={createMutation.isPending}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  disabled={newResourceName.trim() === '' || createMutation.isPending}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const trimmedName = newResourceName.trim();
                    if (trimmedName === '') return;

                    try {
                      const createdResource =
                        await createMutation.mutateAsync(trimmedName);
                      onChange(createdResource.id);
                      setIsDropdownOpen(false);
                      setNewResourceName('');
                      setIsCreating(false);
                      pushToast({
                        variant: 'success',
                        title: tNamedResources(
                          `resourceCreatedTitle${capitalize(NAMED_RESOURCE[kind])}`,
                          { resourceName: trimmedName },
                        ),
                      });
                    } catch (error) {
                      const apiError = normalizeApiError(error);
                      pushToast({
                        variant: 'error',
                        title: apiError.message,
                      });
                    }
                  }}
                >
                  {tNamedResources('confirmCreateInline')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={createMutation.isPending}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setNewResourceName('');
                    setIsCreating(false);
                  }}
                >
                  {tNamedResources('cancelCreateInline')}
                </Button>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
