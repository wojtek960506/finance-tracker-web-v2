import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useSportCategories } from '../../hooks';
import { getCategoryDisplayName } from '../../utils';
import { SportsLayout } from '../layout';

export const SportCategoryContent = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation('sports');
  const { data: categories = [] } = useSportCategories();

  const currentCategory = categories.find((c) => c.id === categoryId);
  const displayName = currentCategory
    ? getCategoryDisplayName(currentCategory, t)
    : categoryId;

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="sport-category-content">
      <div className="rounded-xl border border-border bg-card-bg p-6 text-fg">
        <h2 className="text-lg font-semibold">{displayName}</h2>
        <p className="text-sm text-text-muted mt-1">{t('entries.empty')}</p>
      </div>
    </div>
  );
};

export const SportCategoryPage = () => {
  return (
    <SportsLayout>
      <SportCategoryContent />
    </SportsLayout>
  );
};
