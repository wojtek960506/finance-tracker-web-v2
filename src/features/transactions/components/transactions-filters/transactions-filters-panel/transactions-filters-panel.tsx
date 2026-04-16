import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getNamedResources, type INamedResource } from '@named-resources/api';
import {
  Button,
  Card,
  DateInput,
  Label,
  NumberInput,
  SearchableMultiSelect,
} from '@shared/ui';
import type { TransactionFilters } from '@transactions/api';
import { CurrencySelectField } from '@transactions/components/shared';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';

import { NamedResourceFilterSelectField } from '../named-resource-filter-select-field';
import {
  getTransactionFiltersFormDefaults,
  normalizeTransactionFiltersFormValues,
  transactionFiltersFormSchema,
  type TransactionFiltersFormValues,
} from '../transactions-filters-form';

type TransactionsFiltersPanelProps = {
  appliedFilters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
};

const filterTypeOptions = ['', 'expense', 'income'] as const;

const getFavoriteIcon = () => <Star className="size-4 fill-current" aria-hidden="true" />;

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

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

export const TransactionsFiltersPanel = ({
  appliedFilters,
  onApply,
}: TransactionsFiltersPanelProps) => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const [showMoreExcludedCategories, setShowMoreExcludedCategories] = useState(false);

  const form = useForm<TransactionFiltersFormValues>({
    resolver: zodResolver(transactionFiltersFormSchema),
    defaultValues: getTransactionFiltersFormDefaults(appliedFilters),
  });

  useEffect(() => {
    form.reset(getTransactionFiltersFormDefaults(appliedFilters));
  }, [appliedFilters, form]);

  const categoryMode = useWatch({ control: form.control, name: 'categoryMode' });
  const selectedCurrency = useWatch({ control: form.control, name: 'currency' });

  useEffect(() => {
    // reset value of the other field for category filter when switching filtering way
    // to avoid invalid data passed when submitting
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
      (favoriteCategories.length === 0 || showMoreExcludedCategories) &&
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
  }, [favoriteCategories, otherCategories, showMoreExcludedCategories, tNamedResources]);

  const handleApply = () => {
    console.log('handleApply in filters');
    console.log('before validateion', form.getValues());

    void form.handleSubmit(
      (values) => {
        console.log('after validation');

        console.log('values', values);

        onApply(normalizeTransactionFiltersFormValues(values));
      },
      (errors) => {
        console.log('invalid', errors);
      },
    )();
  };

  return (
    <Card
      className={clsx(
        'relative z-[141] h-full w-full min-w-0 max-w-full gap-4 overflow-hidden',
        'rounded-3xl border-fg/20 bg-modal-bg/95',
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl">{t('filters')}</h2>
        <p className="text-sm text-text-muted">{t('filtersDescription')}</p>
      </div>

      <form
        className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden"
        onSubmit={handleApply}
      >
        <div className="grid min-h-0 min-w-0 gap-4 overflow-y-auto pr-[1px]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            <Label>
              <span className="text-sm font-semibold">{t('startDate')}</span>
              <Controller
                control={form.control}
                name="startDate"
                render={({ field }) => <DateInput {...field} />}
              />
              <FieldError
                message={
                  form.formState.errors.startDate?.message &&
                  t(form.formState.errors.startDate.message)
                }
              />
            </Label>

            <Label>
              <span className="text-sm font-semibold">{t('endDate')}</span>
              <Controller
                control={form.control}
                name="endDate"
                render={({ field }) => <DateInput {...field} />}
              />
              <FieldError
                message={
                  form.formState.errors.endDate?.message &&
                  t(form.formState.errors.endDate.message)
                }
              />
            </Label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            <Label>
              <span className="text-sm font-semibold">{t('minAmount')}</span>
              <Controller
                control={form.control}
                name="minAmount"
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    onValueChange={field.onChange}
                    decimalPlaces={2}
                    step="0.01"
                    min="0"
                  />
                )}
              />
              <FieldError
                message={
                  form.formState.errors.minAmount?.message &&
                  t(form.formState.errors.minAmount.message)
                }
              />
            </Label>

            <Label>
              <span className="text-sm font-semibold">{t('maxAmount')}</span>
              <Controller
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    onValueChange={field.onChange}
                    decimalPlaces={2}
                    step="0.01"
                    min="0"
                  />
                )}
              />
              <FieldError
                message={
                  form.formState.errors.maxAmount?.message &&
                  t(form.formState.errors.maxAmount.message)
                }
              />
            </Label>
          </div>

          <Label>
            <span className="text-sm font-semibold">{t('transactionType')}</span>
            <Controller
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <div
                  className={clsx(
                    'gap-2',
                    '2xl:grid 2xl:grid-cols-3',
                    'lg:flex lg:flex-col',
                    'sm:grid sm:grid-cols-3',
                    'flex flex-col',
                  )}
                >
                  {filterTypeOptions.map((transactionType) => {
                    const isActive = field.value === transactionType;

                    return (
                      <Button
                        key={transactionType || 'all'}
                        type="button"
                        variant={isActive ? 'primary' : 'outline'}
                        onClick={() => field.onChange(transactionType)}
                      >
                        {transactionType ? t(transactionType) : t('allTransactionTypes')}
                      </Button>
                    );
                  })}
                </div>
              )}
            />
          </Label>

          <Label>
            <span className="text-sm font-semibold">{t('currency')}</span>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <CurrencySelectField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('currencyPlaceholder')}
                  searchPlaceholder={t('searchCurrencyPlaceholder')}
                  emptyMessage={t('noCurrenciesFound')}
                />
              )}
            />
            {selectedCurrency ? (
              <Button
                type="button"
                variant="ghost"
                className="justify-start"
                onClick={() => form.setValue('currency', '')}
              >
                {t('clearCurrencyFilter')}
              </Button>
            ) : null}
          </Label>

          <div className="flex flex-col gap-3 rounded-2xl border border-fg/15 bg-bg/60 p-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{t('category')}</span>
              <p className="text-xs text-text-muted">
                {t('categoryFilterModeDescription')}
              </p>
            </div>

            <Controller
              control={form.control}
              name="categoryMode"
              render={({ field }) => (
                <div
                  className={clsx(
                    'gap-2',
                    '2xl:grid 2xl:grid-cols-2',
                    'lg:flex lg:flex-col',
                    'sm:grid sm:grid-cols-2',
                    'flex flex-col',
                  )}
                >
                  <Button
                    type="button"
                    variant={field.value === 'include' ? 'primary' : 'outline'}
                    onClick={() => field.onChange('include')}
                  >
                    {t('includeCategory')}
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'exclude' ? 'primary' : 'outline'}
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
                  <NamedResourceFilterSelectField
                    kind="categories"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('categoryPlaceholder')}
                    searchPlaceholder={t('searchCategoryPlaceholder')}
                    emptyMessage={t('noCategoriesFound')}
                    showMoreLabel={t('showMoreCategories')}
                    showLessLabel={t('showLessCategories')}
                    clearLabel={t('clearCategoryFilter')}
                  />
                )}
              />
            ) : (
              <Controller
                control={form.control}
                name="excludeCategoryIds"
                render={({ field }) => (
                  <SearchableMultiSelect
                    values={field.value}
                    onChange={field.onChange}
                    groups={excludeCategoryGroups}
                    placeholder={t('excludeCategoriesPlaceholder')}
                    searchPlaceholder={t('searchCategoryPlaceholder')}
                    emptyMessage={t('noCategoriesFound')}
                    disabled={areCategoriesLoading}
                    footer={
                      <div className="flex flex-col gap-2 border-t border-fg/20 pt-3">
                        {favoriteCategories.length > 0 && otherCategories.length > 0 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="justify-start"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setShowMoreExcludedCategories((prev) => !prev);
                            }}
                          >
                            {showMoreExcludedCategories
                              ? t('showLessCategories')
                              : t('showMoreCategories')}
                          </Button>
                        ) : null}

                        {field.value.length > 0 ? (
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
                        ) : null}
                      </div>
                    }
                  />
                )}
              />
            )}
          </div>

          <Label>
            <span className="text-sm font-semibold">{t('paymentMethod')}</span>
            <Controller
              control={form.control}
              name="paymentMethodId"
              render={({ field }) => (
                <NamedResourceFilterSelectField
                  kind="paymentMethods"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('paymentMethodPlaceholder')}
                  searchPlaceholder={t('searchPaymentMethodPlaceholder')}
                  emptyMessage={t('noPaymentMethodsFound')}
                  showMoreLabel={t('showMorePaymentMethods')}
                  showLessLabel={t('showLessPaymentMethods')}
                  clearLabel={t('clearPaymentMethodFilter')}
                />
              )}
            />
          </Label>

          <Label>
            <span className="text-sm font-semibold">{t('account')}</span>
            <Controller
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <NamedResourceFilterSelectField
                  kind="accounts"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('accountPlaceholder')}
                  searchPlaceholder={t('searchAccountPlaceholder')}
                  emptyMessage={t('noAccountsFound')}
                  showMoreLabel={t('showMoreAccounts')}
                  showLessLabel={t('showLessAccounts')}
                  clearLabel={t('clearAccountFilter')}
                />
              )}
            />
          </Label>
        </div>

        <div className="flex flex-col gap-2 border-t border-fg/10 pt-4">
          <Button type="button" variant="primary" onClick={handleApply}>
            {t('applyFilters')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset(getTransactionFiltersFormDefaults({}))}
          >
            {t('clearFilters')}
          </Button>
        </div>
      </form>
    </Card>
  );
};
