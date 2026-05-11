import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getNamedResources, type INamedResource } from '@named-resources/api';
import { Button } from '@shared/ui';
import { getFavoriteIcon, NamedResourceSelectField } from '@transactions/components/shared';
import { getTransactionNamedResourceLabel } from '@transactions/utils';

import type { TransactionFiltersFormValues } from '../utils';

import { MultiSelect } from '@/components/ui/multi-select';
import { FORM_BUTTON_CLASS_NAME } from '@/features/transactions/components/transaction-forms';

const mapCategoryToOption = (
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

// TODO split this file to smaller ones
export const CategoryFields = () => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const form = useFormContext<TransactionFiltersFormValues>();
  const categoryMode = useWatch({
    control: form.control,
    name: 'categoryMode',
  });

  useEffect(() => {
    // Reset the other field when switching filtering mode to avoid stale values.
    if (categoryMode === 'include') {
      form.setValue('excludeCategoryIds', []);
      return;
    }

    form.setValue('categoryId', '');
  }, [categoryMode, form]);

  const { data: categories = [], isLoading: areCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getNamedResources('categories'),
  });

  const favoriteCategories = useMemo(
    () => categories.filter((resource) => resource.isFavorite),
    [categories],
  );
  const otherCategories = useMemo(
    () => categories.filter((resource) => !resource.isFavorite),
    [categories],
  );

  const excludeCategoryGroups = useMemo(() => {
    const favoritesGroup =
      favoriteCategories.length > 0
        ? [
            {
              key: 'favorites',
              label: tNamedResources('favorites'),
              options: favoriteCategories.map((resource) =>
                mapCategoryToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    const othersGroup =
      otherCategories.length > 0
        ? [
            {
              key: 'others',
              label:
                favoriteCategories.length > 0
                  ? tNamedResources('allCategories')
                  : undefined,
              options: otherCategories.map((resource) =>
                mapCategoryToOption(resource, tNamedResources),
              ),
            },
          ]
        : [];

    return [...favoritesGroup, ...othersGroup];
  }, [favoriteCategories, otherCategories, tNamedResources]);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-fg/15 bg-bg/60 p-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold">{t('category')}</span>
        <p className="text-xs text-text-muted">{t('categoryFilterModeDescription')}</p>
      </div>

      <Controller
        control={form.control}
        name="categoryMode"
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
              {t('includeCategory')}
            </Button>
            <Button
              type="button"
              variant={field.value === 'exclude' ? 'primary' : 'outline'}
              className={clsx('w-full min-w-0', FORM_BUTTON_CLASS_NAME)}
              onClick={() => field.onChange('exclude')}
            >
              {t('excludeCategories')}
            </Button>
          </div>
        )}
      />

      {categoryMode === 'include' ? (
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <NamedResourceSelectField
              kind="categories"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('categoryPlaceholder')}
              clearable
              clearLabel={t('clearCategoryFilter')}
              includeSystem={true}
            />
          )}
        />
      ) : (
        <Controller
          control={form.control}
          name="excludeCategoryIds"
          render={({ field }) => (
            <MultiSelect
              values={field.value}
              onChange={field.onChange}
              groups={excludeCategoryGroups}
              placeholder={t('excludeCategoriesPlaceholder')}
              emptyMessage={t('noCategoriesFound')}
              disabled={areCategoriesLoading}
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
                      {t('clearExcludedCategories')}
                    </Button>
                  </div>
                ) : null
              }
            />
          )}
        />
      )}
    </div>
  );
};
