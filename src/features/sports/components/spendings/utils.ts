import type { SportEntry, SportSpendingTarget } from '../../api/types';

export const isSportCategory = (categoryName?: string): boolean => {
  if (!categoryName) return false;
  const normalized = categoryName.trim().toLowerCase();
  return (
    normalized === 'sport' ||
    normalized === 'sports' ||
    normalized === 'fitness' ||
    normalized === 'siłownia'
  );
};

export const toSportSpendingTarget = (entry: SportEntry): SportSpendingTarget => ({
  id: entry.id,
  costPln: entry.costPln,
  date: entry.date,
  itemName: entry.itemName,
  categoryId: entry.category.id,
  categoryName: entry.category.name,
  transactionId: entry.transactionId,
});
