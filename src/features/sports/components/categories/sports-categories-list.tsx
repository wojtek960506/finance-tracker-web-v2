import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getCategoryDisplayName } from '../../utils';

import { SportCategoryItem } from './sport-category-item';
import type { SportsCategoriesListProps } from './types';

export const SportsCategoriesList = ({
  categories,
  onDeleteRequest,
}: SportsCategoriesListProps) => {
  const { t, i18n } = useTranslation('sports');

  const sortedCategories = useMemo(() => {
    const collator = new Intl.Collator(i18n.language, {
      sensitivity: 'base',
      numeric: true,
    });

    return [...categories].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'system' ? -1 : 1;
      }

      return collator.compare(
        getCategoryDisplayName(left, t),
        getCategoryDisplayName(right, t),
      );
    });
  }, [categories, i18n.language, t]);

  return (
    <ul className="flex flex-col gap-2 sm:gap-3" data-testid="sports-categories-list">
      {sortedCategories.map((category) => (
        <li key={category.id}>
          <SportCategoryItem category={category} onDeleteRequest={onDeleteRequest} />
        </li>
      ))}
    </ul>
  );
};
