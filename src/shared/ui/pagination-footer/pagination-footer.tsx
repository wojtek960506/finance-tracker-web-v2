import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../button';

import type { PaginationFooterProps } from './types';

export const PaginationFooter = ({
  testId = 'pagination-footer',
  containerTestId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
  i18nNamespace,
  labels,
}: PaginationFooterProps) => {
  const { t } = useTranslation(i18nNamespace ?? 'common');
  const [isOptimisticLoading, setIsOptimisticLoading] = useState(false);

  const showFooter = Boolean(
    hasNextPage ||
    (totalCount !== undefined && loadedCount !== undefined && totalCount > 0),
  );

  if (!showFooter) {
    return null;
  }

  const isLoadingMore = Boolean(isFetchingNextPage || isOptimisticLoading);

  const handleLoadMore = async () => {
    setIsOptimisticLoading(true);
    try {
      await fetchNextPage?.();
    } finally {
      setIsOptimisticLoading(false);
    }
  };

  const loadMoreText =
    labels?.loadMore ?? t('actions.loadMore', { defaultValue: 'Load More' });
  const loadingMoreText =
    labels?.loadingMore ?? t('actions.loadingMore', { defaultValue: 'Loading more...' });
  const showingCountText =
    labels?.showingCount ??
    t('actions.showingCount', {
      loaded: loadedCount,
      total: totalCount,
      defaultValue: `Showing ${loadedCount} of ${totalCount}`,
    });
  const loadMoreWithCountText =
    labels?.loadMoreWithCount ??
    t('actions.loadMoreWithCount', {
      loaded: loadedCount,
      total: totalCount,
      defaultValue: `Load more (${loadedCount} of ${totalCount})`,
    });
  const showingAllText =
    labels?.showingAll ??
    t('actions.showingAll', {
      total: totalCount,
      defaultValue: `Showing all ${totalCount}`,
    });

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 pt-1 text-xs text-text-muted"
      data-testid={containerTestId ?? `${testId}-pagination-footer`}
    >
      {/* Mobile counter: visible only on small screens when more pages can be loaded */}
      {hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
        <span className="sm:hidden" data-testid={`${testId}-counter`}>
          {showingCountText}
        </span>
      )}

      {/* Interactive Load More Button */}
      {hasNextPage && fetchNextPage && (
        <Button
          type="button"
          variant="secondary"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="w-full sm:max-w-sm sm:mx-auto"
          data-testid={`${testId}-load-more-button`}
        >
          {isLoadingMore && (
            <Loader2
              className="mr-2 h-3.5 w-3.5 animate-spin"
              data-testid={`${testId}-load-more-spinner`}
            />
          )}
          {isLoadingMore ? (
            loadingMoreText
          ) : (
            <>
              <span className="sm:hidden">{loadMoreText}</span>
              <span className="hidden sm:inline">
                {totalCount !== undefined && loadedCount !== undefined
                  ? loadMoreWithCountText
                  : loadMoreText}
              </span>
            </>
          )}
        </Button>
      )}

      {/* All records loaded status text */}
      {!hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
        <span data-testid={`${testId}-counter`}>{showingAllText}</span>
      )}
    </div>
  );
};
