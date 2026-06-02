import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  type INamedResource,
  NAMED_RESOURCE,
  type NamedResourceKind,
} from '@named-resources/api';
import { Button } from '@shared/ui';
import { capitalize } from '@shared/utils';
import { getFavoriteIcon } from '@transactions/components/shared';
import { getTransactionNamedResourceLabel } from '@transactions/utils';

import type { TransactionFiltersFormValues } from '../utils';
import { TRANSACTION_FILTER_RESOURCE_FIELD_NAMES } from '../utils';

import type { MultiSelectGroup } from '@/components/ui/multi-select';
import { MultiSelect } from '@/components/ui/multi-select';
import { FORM_BUTTON_CLASS_NAME } from '@/features/transactions/components/transaction-forms';

const mapNamedResourceToOption = (
  resource: INamedResource,
  tNamedResources: (key: string) => string,
) => ({
  value: resource.id,
  label: getTransactionNamedResourceLabel(resource, tNamedResources),
  searchText:
    resource.type === 'system'
      ? `${resource.name} ${tNamedResources(resource.name)}`
      : resource.name,
  icon: resource.isFavorite ? getFavoriteIcon() : undefined,
});

type NamedResourceFilterFieldProps = {
  kind: NamedResourceKind;
  includeSystem?: boolean;
  excludedSystemNames?: string[];
};

export const NamedResourceFilterField = ({
  kind,
  includeSystem = kind !== 'categories',
  excludedSystemNames = [],
}: NamedResourceFilterFieldProps) => {
  const form = useFormContext<TransactionFiltersFormValues>();
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const resourceKeyBase = NAMED_RESOURCE[kind];
  const resourceKindSuffix = capitalize(kind);
  const fieldNames = TRANSACTION_FILTER_RESOURCE_FIELD_NAMES[kind];
  const filterMode = useWatch({
    control: form.control,
    name: fieldNames.mode,
  });

  useEffect(() => {
    if (filterMode === 'include') {
      form.setValue(fieldNames.exclude, []);
      return;
    }

    form.setValue(fieldNames.include, []);
  }, [fieldNames.exclude, fieldNames.include, filterMode, form]);

  const { data: resources = [], isLoading: areResourcesLoading } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });

  const availableResources = useMemo(
    () =>
      resources.filter((resource) => {
        if (resource.type !== 'system') {
          return true;
        }

        if (!includeSystem) {
          return false;
        }

        return !excludedSystemNames.includes(resource.name);
      }),
    [excludedSystemNames, includeSystem, resources],
  );
  const favoriteResources = useMemo(
    () => availableResources.filter((resource) => resource.isFavorite),
    [availableResources],
  );
  const otherResources = useMemo(
    () => availableResources.filter((resource) => !resource.isFavorite),
    [availableResources],
  );
  const groups = useMemo<MultiSelectGroup[]>(() => {
    const favoritesGroup =
      favoriteResources.length > 0
        ? [
            {
              key: 'favorites',
              label: tNamedResources('favorites'),
              options: favoriteResources.map((resource) =>
                mapNamedResourceToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    const othersGroup =
      otherResources.length > 0
        ? [
            {
              key: 'others',
              label:
                favoriteResources.length > 0 && kind === 'categories'
                  ? tNamedResources('allCategories')
                  : undefined,
              options: otherResources.map((resource) =>
                mapNamedResourceToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    return [...favoritesGroup, ...othersGroup];
  }, [favoriteResources, kind, otherResources, tNamedResources]);

  const includeButtonLabel = t('includeMany');
  const excludeButtonLabel = t('excludeMany');
  const includePlaceholderKey = `include${resourceKindSuffix}Placeholder`;
  const excludePlaceholderKey = `exclude${resourceKindSuffix}Placeholder`;
  const clearIncludedKey = `clearIncluded${resourceKindSuffix}`;
  const clearExcludedKey = `clearExcluded${resourceKindSuffix}`;
  const noResultsKey = `no${resourceKindSuffix}Found`;

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-fg/15 bg-bg/60 p-3">
      <div className="flex min-w-0 flex-col gap-1">
        <span>{t(resourceKeyBase)}</span>
      </div>
      <Controller
        control={form.control}
        name={fieldNames.mode}
        render={({ field }) => (
          <div
            className={clsx(
              'min-w-0 gap-2',
              '2xl:grid 2xl:grid-cols-2',
              'lg:flex lg:flex-col',
              'sm:grid sm:grid-cols-2',
              'flex flex-col',
            )}
          >
            <Button
              type="button"
              variant={field.value === 'include' ? 'primary' : 'outline'}
              className={clsx('w-full min-w-0', FORM_BUTTON_CLASS_NAME)}
              onClick={() => field.onChange('include')}
            >
              {includeButtonLabel}
            </Button>
            <Button
              type="button"
              variant={field.value === 'exclude' ? 'primary' : 'outline'}
              className={clsx('w-full min-w-0', FORM_BUTTON_CLASS_NAME)}
              onClick={() => field.onChange('exclude')}
            >
              {excludeButtonLabel}
            </Button>
          </div>
        )}
      />

      <Controller
        control={form.control}
        name={filterMode === 'include' ? fieldNames.include : fieldNames.exclude}
        render={({ field }) => (
          <MultiSelect
            values={field.value}
            onChange={field.onChange}
            groups={groups}
            placeholder={t(filterMode === 'include' ? includePlaceholderKey : excludePlaceholderKey)}
            emptyMessage={t(noResultsKey)}
            disabled={areResourcesLoading}
            footer={
              field.value.length > 0 ? (
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      field.onChange([]);
                    }}
                  >
                    {t(filterMode === 'include' ? clearIncludedKey : clearExcludedKey)}
                  </Button>
                </div>
              ) : null
            }
          />
        )}
      />
    </div>
  );
};
