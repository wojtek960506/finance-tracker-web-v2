import { SPORTS_CATEGORY_COLORS } from './consts';

export const getCategoryDisplayName = (
  category: {
    name: string;
    type: 'user' | 'system';
    categoryKey?: string | null;
  },
  t: (key: string, options?: { defaultValue: string }) => string,
): string => {
  if (category.type === 'system') {
    if (category.categoryKey) {
      return t(`categories.${category.categoryKey}`, {
        defaultValue: category.name,
      });
    }
    if (category.name === 'otherCategory' || category.name === 'other') {
      return t('categories.otherCategory', {
        defaultValue: t('categories.other', {
          defaultValue: category.name,
        }),
      });
    }
  }
  return category.name;
};

export const formatPln = (amount: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} PLN`;
};

export const formatDate = (dateStr: string, language = 'en'): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getCategoryColor = (index: number): string => {
  return SPORTS_CATEGORY_COLORS[index % SPORTS_CATEGORY_COLORS.length];
};
