export interface PaginationFooterProps {
  testId?: string;
  containerTestId?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
  i18nNamespace?: string;
  labels?: {
    loadMore?: string;
    loadMoreWithCount?: string;
    loadingMore?: string;
    showingCount?: string;
    showingAll?: string;
  };
}
