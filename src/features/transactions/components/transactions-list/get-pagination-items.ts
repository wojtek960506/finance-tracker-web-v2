export type PaginationItem = number | 'ellipsis';

export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
  siblingCount = 2,
): PaginationItem[] => {
  if (totalPages <= 0) return [];

  const pages = new Set<number>([1, totalPages]);

  for (
    let page = currentPage - siblingCount;
    page <= currentPage + siblingCount;
    page += 1
  ) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  for (const page of sortedPages) {
    const previousPage = items[items.length - 1];

    if (typeof previousPage === 'number') {
      const gap = page - previousPage;

      if (gap === 2) {
        items.push(previousPage + 1);
      } else if (gap > 2) {
        items.push('ellipsis');
      }
    }

    items.push(page);
  }

  return items;
};
