import { Loader2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card } from '@shared/ui';

export type VehicleTableShellProps = {
  isEmpty: boolean;
  emptyState: ReactNode;
  testId: string;
  headers: ReactNode;
  desktopRows: ReactNode;
  mobileCards: ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
};

export const VehicleTableShell = ({
  isEmpty,
  emptyState,
  testId,
  headers,
  desktopRows,
  mobileCards,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
}: VehicleTableShellProps) => {
  const { t } = useTranslation('vehicles');

  const [isOptimisticLoading, setIsOptimisticLoading] = useState(false);

  if (isEmpty) {
    return <>{emptyState}</>;
  }

  const showFooter = Boolean(
    hasNextPage ||
    (totalCount !== undefined && loadedCount !== undefined && totalCount > 0),
  );

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
    <div className="flex flex-col gap-3" data-testid={testId}>
      {/* Desktop table view */}
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>{headers}</tr>
            </thead>
            <tbody className="divide-y divide-border">{desktopRows}</tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="flex flex-col gap-2.5 lg:hidden">{mobileCards}</div>

      {/* Pagination / Cursor Load More Footer */}
      {showFooter && (
        <div
          className="flex flex-col items-center justify-center gap-2 pt-1 text-xs text-text-muted"
          data-testid={`${testId}-pagination-footer`}
        >
          {hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
            <span className="sm:hidden" data-testid={`${testId}-counter`}>
              {t('actions.showingCount', {
                loaded: loadedCount,
                total: totalCount,
              })}
            </span>
          )}

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

          {!hasNextPage && totalCount !== undefined && loadedCount !== undefined && (
            <span data-testid={`${testId}-counter`}>
              {t('actions.showingAll', {
                total: totalCount,
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
