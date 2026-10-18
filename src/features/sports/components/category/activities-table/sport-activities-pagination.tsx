import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

import type { SportActivitiesPaginationProps } from './types';

export const SportActivitiesPagination = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
  testId = 'sport-activities-table',
}: SportActivitiesPaginationProps) => {
  const { t } = useTranslation('sports');
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

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 pt-1 text-xs text-text-muted"
      data-testid={`${testId}-pagination`}
    >
      {/* Mobile counter */}
      {hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
        <span className="sm:hidden" data-testid={`${testId}-counter`}>
          {t('actions.showingCount', {
            loaded: loadedCount,
            total: totalCount,
          })}
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
            t('actions.loadingMore')
          ) : (
            <>
              <span className="sm:hidden">{t('actions.loadMore')}</span>
              <span className="hidden sm:inline">
                {totalCount !== undefined && loadedCount !== undefined
                  ? t('actions.loadMoreWithCount', {
                      loaded: loadedCount,
                      total: totalCount,
                    })
                  : t('actions.loadMore')}
              </span>
            </>
          )}
        </Button>
      )}

      {/* All records loaded status text */}
      {!hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
        <span data-testid={`${testId}-counter`}>
          {t('actions.showingAll', {
            total: totalCount,
          })}
        </span>
      )}
    </div>
  );
};
