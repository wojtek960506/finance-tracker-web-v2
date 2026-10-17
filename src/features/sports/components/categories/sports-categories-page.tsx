import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, Card, LoadingCard } from '@shared/ui';

import type { SportCategory } from '../../api';
import { useSportCategories } from '../../hooks';

import { CreateSportCategory } from './create-sport-category';
import { SportCategoryDeleteModal } from './sport-category-delete-modal';
import { SportsCategoriesList } from './sports-categories-list';

export const SportsCategoriesPage = () => {
  const { t } = useTranslation('sports');
  const [deleteTarget, setDeleteTarget] = useState<SportCategory | null>(null);

  const { data: categories, isLoading, error, refetch } = useSportCategories();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <LoadingCard
          title={t('categories.allCategories')}
          description={t('description')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-auto flex w-full max-w-[35rem] flex-col gap-2 p-4 sm:gap-3">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 text-center sm:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {t('toasts.categoryCreateError')}
          </h2>
          <p className="text-sm text-text-muted">{error.message}</p>
          <Button
            variant="primary"
            className={clsx(FORM_BUTTON_SIZE_CLASS, 'mx-auto')}
            onClick={() => void refetch()}
          >
            {t('stats.emptyStats')}
          </Button>
        </Card>
      </div>
    );
  }

  const items = categories ?? [];
  const isEmpty = items.length === 0;

  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden p-4 sm:gap-3',
        'max-w-[35rem]',
      )}
      data-testid="sports-categories-page"
    >
      <CreateSportCategory />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {isEmpty ? (
          <Card className="gap-3 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 text-center sm:gap-4 sm:p-8">
            <h2 className="text-xl font-semibold sm:text-2xl">
              {t('categories.allCategories')}
            </h2>
            <p className="text-sm text-text-muted sm:text-base">
              {t('categories.empty')}
            </p>
          </Card>
        ) : (
          <SportsCategoriesList
            categories={items}
            onDeleteRequest={(cat) => setDeleteTarget(cat)}
          />
        )}
      </div>

      <SportCategoryDeleteModal
        category={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
