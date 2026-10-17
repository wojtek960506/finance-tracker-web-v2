import type { ReactNode } from 'react';
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
  fetchNextPage?: () => void;
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
  const { t: tCommon } = useTranslation('common');

  if (isEmpty) {
    return <>{emptyState}</>;
  }

  const showFooter = Boolean(
    hasNextPage ||
    (totalCount !== undefined && loadedCount !== undefined && totalCount > 0),
  );

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
          className={
            'flex flex-col items-center justify-between gap-3 pt-1 ' +
            'sm:flex-row text-xs text-text-muted'
          }
          data-testid={`${testId}-pagination-footer`}
        >
          {totalCount !== undefined && loadedCount !== undefined && (
            <span data-testid={`${testId}-counter`}>
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
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              className="w-full sm:w-auto"
              data-testid={`${testId}-load-more-button`}
            >
              {isFetchingNextPage ? tCommon('loading') : t('actions.loadMore')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
